import path from 'node:path';
import { execSync } from 'node:child_process';
import * as p from '@clack/prompts';
import { detectEnvironment, formatDetectionReport } from './detect.js';
import { TEMPLATES, getTemplate } from './templates.js';
import { scaffoldProject } from './scaffold.js';
import { isGhAuthenticated, createGithubRepo } from './github.js';
import { isDopplerAuthenticated, runDopplerSetup } from './doppler.js';

export async function run() {
  p.intro('program-starter — spin up a new project the right way');

  const report = detectEnvironment();
  p.note(formatDetectionReport(report), 'Environment check');

  const missingCore = ['git', 'node'].filter((tool) => !report[tool].installed);
  if (missingCore.length > 0) {
    p.log.warn(
      `Missing required tool(s): ${missingCore.join(', ')}. Install them first — ` +
        'program-starter does not auto-install language runtimes or Git.'
    );
    p.outro('Exiting.');
    return;
  }

  const templateId = await p.select({
    message: 'What do you want to build?',
    options: TEMPLATES.map((t) => ({ value: t.id, label: t.label })),
  });
  bail(templateId);
  const template = getTemplate(templateId);

  const projectName = await p.text({
    message: 'Project name',
    placeholder: 'my-new-project',
    validate: (value) => {
      if (!value) return 'Required';
      if (!/^[a-z0-9-_]+$/i.test(value)) return 'Use letters, numbers, - and _ only';
    },
  });
  bail(projectName);

  if (template.runtime === 'python' && !report.conda.installed) {
    p.log.warn('This template uses Conda but Conda was not detected. You can still scaffold the files and install Conda later.');
  }

  const runSetup = await p.confirm({
    message: `Run setup commands now? (${template.setupCommands.join(' && ')})`,
    initialValue: true,
  });
  bail(runSetup);

  const initGit = await p.confirm({ message: 'Initialize a git repository?', initialValue: true });
  bail(initGit);

  let createRepo = false;
  if (initGit) {
    if (report.gh.installed && isGhAuthenticated()) {
      createRepo = await p.confirm({ message: 'Create a matching GitHub repo with `gh` and push?', initialValue: false });
      bail(createRepo);
    } else if (report.gh.installed) {
      p.log.warn('GitHub CLI (gh) is installed but not authenticated. Run `gh auth login` to enable repo creation next time.');
    } else {
      p.log.info('GitHub CLI (gh) not found — skipping GitHub repo creation. Install it to enable this: https://cli.github.com');
    }
  }

  let setupDoppler = false;
  if (report.doppler.installed) {
    if (isDopplerAuthenticated()) {
      setupDoppler = await p.confirm({ message: 'Run `doppler setup` to link a secrets project?', initialValue: false });
      bail(setupDoppler);
    } else {
      p.log.warn('Doppler CLI is installed but not logged in. Run `doppler login` to enable secrets setup next time.');
    }
  } else {
    p.log.info('Doppler CLI not found — skipping secrets setup. Install it to enable this: https://docs.doppler.com/docs/install-cli');
  }

  let wantsDbCompose = false;
  if (template.needsDb) {
    wantsDbCompose = await p.confirm({
      message: 'Add a docker-compose.yml with Postgres + Redis for local dev (no local DB install needed)?',
      initialValue: !!report.docker.installed,
    });
    bail(wantsDbCompose);
    if (wantsDbCompose && !report.docker.installed) {
      p.log.warn('Docker was not detected. The docker-compose.yml will still be generated — install Docker Desktop to use it: https://www.docker.com/products/docker-desktop');
    }
  }

  const targetDir = path.resolve(process.cwd(), projectName);

  const s = p.spinner();
  s.start('Scaffolding project files');
  await scaffoldProject({ template, projectName, targetDir });
  if (!wantsDbCompose) {
    // Remove the docker-compose stub for templates that ship one by default
    // but the user declined — keeps the tree honest about what was chosen.
    const fs = await import('fs-extra');
    await fs.default.remove(path.join(targetDir, 'docker-compose.yml'));
  }
  s.stop('Project files scaffolded');

  if (runSetup) {
    for (const cmd of template.setupCommands) {
      s.start(`Running: ${cmd}`);
      try {
        execSync(cmd, { cwd: targetDir, stdio: 'inherit' });
        s.stop(`Done: ${cmd}`);
      } catch {
        s.stop(`Failed: ${cmd} (continuing — you can re-run it manually)`);
      }
    }
  }

  if (initGit) {
    execSync('git init', { cwd: targetDir, stdio: 'ignore' });
    execSync('git add -A', { cwd: targetDir, stdio: 'ignore' });
    execSync('git commit -m "Initial commit from program-starter"', { cwd: targetDir, stdio: 'ignore' });
    p.log.success('Git repository initialized with an initial commit.');
  }

  if (createRepo) {
    try {
      createGithubRepo({ name: projectName, cwd: targetDir });
    } catch (err) {
      p.log.error(`GitHub repo creation failed: ${err.message}`);
    }
  }

  if (setupDoppler) {
    try {
      runDopplerSetup(targetDir);
    } catch (err) {
      p.log.error(`Doppler setup failed: ${err.message}`);
    }
  }

  p.outro(`Done. cd ${projectName} and start building.`);
}

function bail(value) {
  if (p.isCancel(value)) {
    p.cancel('Cancelled.');
    process.exit(0);
  }
}

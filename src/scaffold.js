import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Copies a template directory into the target project directory and
 * rewrites placeholder tokens ({{PROJECT_NAME}}) in text files.
 */
export async function scaffoldProject({ template, projectName, targetDir }) {
  const templateSrc = path.join(__dirname, 'templates', template.dir);

  if (!(await fs.pathExists(templateSrc))) {
    throw new Error(`Template "${template.id}" is missing its files at ${templateSrc}`);
  }

  if (await fs.pathExists(targetDir)) {
    const contents = await fs.readdir(targetDir);
    if (contents.length > 0) {
      throw new Error(`Target directory "${targetDir}" already exists and is not empty.`);
    }
  }

  await fs.copy(templateSrc, targetDir);
  await replaceTokens(targetDir, { PROJECT_NAME: projectName });

  return targetDir;
}

async function replaceTokens(dir, tokens) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await replaceTokens(full, tokens);
      continue;
    }
    if (!isTextFile(entry.name)) continue;
    let contents = await fs.readFile(full, 'utf8');
    for (const [key, value] of Object.entries(tokens)) {
      contents = contents.replaceAll(`{{${key}}}`, value);
    }
    await fs.writeFile(full, contents);
  }
}

function isTextFile(name) {
  return !/\.(png|jpg|jpeg|gif|ico|woff2?|ttf|eot)$/i.test(name);
}

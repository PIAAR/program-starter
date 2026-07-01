import { execSync } from 'node:child_process';

export function isGhAuthenticated() {
  try {
    execSync('gh auth status', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates a GitHub repo for the freshly scaffolded project using the gh CLI.
 * Assumes the caller has already run `git init` + an initial commit in cwd.
 */
export function createGithubRepo({ name, visibility = 'private', cwd }) {
  execSync(`gh repo create ${name} --${visibility} --source=. --remote=origin --push`, {
    cwd,
    stdio: 'inherit',
  });
}

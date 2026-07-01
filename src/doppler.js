import { execSync } from 'node:child_process';

export function isDopplerAuthenticated() {
  try {
    execSync('doppler me', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Runs `doppler setup` interactively so the user picks/creates a project +
 * config for the new repo. Left interactive on purpose — project/config
 * selection is a judgment call the CLI shouldn't make for the user.
 */
export function runDopplerSetup(cwd) {
  execSync('doppler setup', { cwd, stdio: 'inherit' });
}

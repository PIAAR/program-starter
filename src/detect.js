import { execSync } from 'node:child_process';

function checkVersion(cmd) {
  try {
    const out = execSync(`${cmd}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
      .split('\n')[0];
    return { installed: true, version: out };
  } catch {
    return { installed: false, version: null };
  }
}

/**
 * Detects the developer tools program-starter cares about.
 * Never installs GUI apps or system services itself — only reports state.
 */
export function detectEnvironment() {
  return {
    git: checkVersion('git --version'),
    node: checkVersion('node --version'),
    npm: checkVersion('npm --version'),
    conda: checkVersion('conda --version'),
    python: checkVersion('python3 --version'),
    gh: checkVersion('gh --version'),
    doppler: checkVersion('doppler --version'),
    docker: checkVersion('docker --version'),
  };
}

export function formatDetectionReport(report) {
  const rows = Object.entries(report).map(([tool, info]) => {
    const status = info.installed ? `✔ ${info.version}` : '✘ not found';
    return `  ${tool.padEnd(8)} ${status}`;
  });
  return rows.join('\n');
}

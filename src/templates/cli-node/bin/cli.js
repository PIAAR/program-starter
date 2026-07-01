#!/usr/bin/env node
import * as p from '@clack/prompts';

async function main() {
  p.intro('{{PROJECT_NAME}}');
  p.outro('Hello from {{PROJECT_NAME}}. Start editing bin/cli.js.');
}

main();

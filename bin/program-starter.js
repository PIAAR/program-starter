#!/usr/bin/env node
import { run } from '../src/cli.js';

run().catch((err) => {
  console.error('\nprogram-starter failed:', err?.message ?? err);
  process.exit(1);
});

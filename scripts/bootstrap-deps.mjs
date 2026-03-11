#!/usr/bin/env node
import { existsSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value = ''] = arg.split('=');
    return [key, value];
  }),
);

const mode = args.get('--mode') || '';
const target = args.get('--target') || '';

function runNpmInstall(targetDir) {
  if (!existsSync(targetDir)) {
    console.error(`[bootstrap-deps] Target directory not found: ${targetDir}`);
    process.exit(1);
  }

  const command = 'npm';
  const installArgs = ['install', '--prefer-offline', '--no-audit', '--fund=false'];

  const result = spawnSync(command, installArgs, {
    cwd: targetDir,
    stdio: 'inherit',
    env: process.env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (mode === 'postinstall') {
  if (process.env.WM_INSTALL_OPTIONAL_WORKSPACES === '1') {
    runNpmInstall(path.join(repoRoot, 'blog-site'));
  } else {
    console.log('[bootstrap-deps] Skipping blog-site install during postinstall.');
    console.log('[bootstrap-deps] Set WM_INSTALL_OPTIONAL_WORKSPACES=1 to restore legacy behavior.');
  }
  process.exit(0);
}

if (!target) {
  console.error('[bootstrap-deps] Missing --target=<folder>.');
  process.exit(1);
}

runNpmInstall(path.join(repoRoot, target));

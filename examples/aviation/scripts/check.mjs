import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
async function check(dir) {
  for (const entry of await readdir(new URL(dir, root), { withFileTypes: true })) {
    const path = `${dir}${entry.name}`;
    if (entry.isDirectory()) await check(`${path}/`);
    else if (/\.m?js$/.test(entry.name)) {
      const result = spawnSync(process.execPath, ['--check', fileURLToPath(new URL(path, root))], { stdio: 'inherit' });
      if (result.status !== 0) process.exit(result.status ?? 1);
    }
  }
}
for (const dir of ['src/', 'scripts/', 'tests/']) await check(dir);
console.log('JavaScript syntax checks passed.');

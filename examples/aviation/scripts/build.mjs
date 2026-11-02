import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
await rm(new URL('dist/', root), { recursive: true, force: true });
await mkdir(new URL('dist/', root));
await cp(new URL('public/', root), new URL('dist/', root), { recursive: true });
await cp(new URL('src/', root), new URL('dist/src/', root), { recursive: true });
console.log(`Built ${fileURLToPath(new URL('dist/', root))}`);

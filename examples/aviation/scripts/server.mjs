import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, sep, extname } from 'node:path';
const project = fileURLToPath(new URL('../', import.meta.url));
export function createApp({ dist = false } = {}) {
  const roots = dist ? [resolve(project, 'dist')] : [resolve(project, 'public'), resolve(project, 'src')];
  return createServer(async (req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return; }
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { res.writeHead(400); res.end('Bad request'); return; }
    if (pathname === '/healthz') { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(req.method === 'HEAD' ? undefined : '{"ok":true}'); return; }
    const root = !dist && pathname.startsWith('/src/') ? roots[1] : roots[0];
    const relative = !dist && pathname.startsWith('/src/') ? pathname.slice(5) : pathname.slice(1);
    const candidate = resolve(root, relative || 'index.html');
    if (candidate !== root && !candidate.startsWith(root + sep)) { res.writeHead(403); res.end('Forbidden'); return; }
    try {
      const path = await realpath(candidate);
      if (!path.startsWith((await realpath(root)) + sep) || !(await stat(path)).isFile()) { res.writeHead(404); res.end('Not found'); return; }
      const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml' };
      const content = await readFile(path);
      res.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      res.end(req.method === 'HEAD' ? undefined : content);
    } catch { res.writeHead(404); res.end('Not found'); }
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 5173);
  const host = process.env.HOST ?? '0.0.0.0';
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be 1–65535');
  const server = createApp({ dist: process.argv.includes('--dist') });
  server.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, host, () => console.log(`Aviation Lab ready: http://${host}:${port}`));
  for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => server.close());
}

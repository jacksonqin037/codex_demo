import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApp } from '../scripts/server.mjs';
test('HTTP serves app, JS, health and rejects unrelated files',async()=>{
  const server=createApp();server.listen(0,'127.0.0.1');await once(server,'listening');
  const base=`http://127.0.0.1:${server.address().port}`;
  try {
    const home=await fetch(base);assert.equal(home.status,200);assert.match(await home.text(),/ADF/);
    const js=await fetch(`${base}/src/physics.js`);assert.equal(js.status,200);assert.match(js.headers.get('content-type'),/javascript/);
    const health=await fetch(`${base}/healthz`);assert.deepEqual(await health.json(),{ok:true});
    for(const path of ['/package.json','/.env','/%2e%2e%2fpackage.json','/missing']) assert.ok((await fetch(base+path)).status>=400,path);
    assert.equal((await fetch(base,{method:'POST'})).status,405);
    assert.equal((await fetch(base,{method:'HEAD'})).status,200);
  } finally { await new Promise(resolve=>server.close(resolve)); }
});

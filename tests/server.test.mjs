import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from '../server.mjs';
test('server serves interface, generates scenes, rejects bad input and protects files',async()=>{const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;try{
 assert.equal((await fetch(base+'/')).status,200);assert.match(await(await fetch(base+'/app.mjs')).text(),/requestAnimationFrame/);
 const post=body=>fetch(base+'/api/scenes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 const response=await post({description:'RC电容充放电12V 1kΩ 1000uF'});assert.equal(response.status,200);assert.equal((await response.json()).scene.model,'rc');
 assert.equal((await post({description:'未知实验'})).status,400);assert.equal((await post({description:'x'.repeat(4001)})).status,400);
 assert.equal((await fetch(base+'/api/scenes',{method:'POST',headers:{Origin:'https://other.example'},body:'{}'})).status,403);
 assert.equal((await fetch(base+'/.env')).status,404);
}finally{await new Promise(r=>server.close(r));}});

import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseDescription,validateScene} from './src/engine.mjs';
const root=fileURLToPath(new URL('.',import.meta.url));
export function createServer(){return http.createServer(async(req,res)=>{
  const reply=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
  try {
    const url=new URL(req.url,'http://localhost');
    if(url.pathname==='/api/health')return reply(200,{ok:true,planner:process.env.SCENE_PLANNER_URL?'external':'local'});
    if(url.pathname==='/api/scenes' && req.method==='POST') {
      if(req.headers.origin && new URL(req.headers.origin).host!==req.headers.host)return reply(403,{error:'仅接受同源请求'});
      let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>16384)return reply(413,{error:'请求过大'});}
      const {description}=JSON.parse(body);
      if(typeof description!=='string'||!description.trim()||description.length>4000)return reply(400,{error:'请输入 1–4000 字的实验描述'});
      if(process.env.SCENE_PLANNER_URL) {
        // Optional, provider-neutral planner service. Never execute generated JS/HTML.
        const response=await fetch(process.env.SCENE_PLANNER_URL,{method:'POST',signal:AbortSignal.timeout(20000),headers:{'Content-Type':'application/json',...(process.env.SCENE_PLANNER_TOKEN?{Authorization:`Bearer ${process.env.SCENE_PLANNER_TOKEN}`}:{})},body:JSON.stringify({description,schemaVersion:1,allowedModels:['ohm','rc','spring']})});
        if(!response.ok)throw new Error('远程场景规划服务调用失败');
        return reply(200,{scene:validateScene(await response.json()),source:'external'});
      }
      return reply(200,{scene:parseDescription(description),source:'local'});
    }
    if(req.method!=='GET' && req.method!=='HEAD')return reply(405,{error:'Method not allowed'});
    let path=decodeURIComponent(url.pathname);if(path==='/')path='/public/index.html';else if(!path.startsWith('/src/'))path='/public'+path;
    const absolute=resolve(root,'.'+path);
    if(!absolute.startsWith(resolve(root,'public')+sep)&&!absolute.startsWith(resolve(root,'src')+sep))return reply(403,{error:'Forbidden'});
    const data=await readFile(absolute);const ext=absolute.split('.').pop();
    res.writeHead(200,{'Content-Type':({html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',mjs:'text/javascript; charset=utf-8',js:'text/javascript; charset=utf-8'})[ext]??'application/octet-stream','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'"});res.end(req.method==='HEAD'?undefined:data);
  } catch(error) {if(error.code==='ENOENT')return reply(404,{error:'Not found'});reply(400,{error:error.message});}
});}
if(process.argv[1]===fileURLToPath(import.meta.url)){const arg=name=>{const i=process.argv.indexOf(name);return i>=0?process.argv[i+1]:undefined;};const port=Number(arg('--port')??process.env.PORT??3000);createServer().listen(port,arg('--host')??process.env.HOST??'0.0.0.0',()=>console.log(`Experiment Lab ready on http://localhost:${port}`));}

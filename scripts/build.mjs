import {cp,mkdir,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const path of ['public','src','server.mjs','package.json'])await cp(path,`dist/${path}`,{recursive:true});
console.log('Built dist/. Run node dist/server.mjs.');

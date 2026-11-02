import {execFileSync} from 'node:child_process';
import {readdirSync} from 'node:fs';
import {join} from 'node:path';
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):e.name.endsWith('.mjs')?[join(dir,e.name)]:[]);}
for(const file of ['server.mjs',...walk('src'),...walk('public'),...walk('scripts'),...walk('tests')])execFileSync(process.execPath,['--check',file],{stdio:'inherit'});
console.log('JavaScript syntax checks passed.');

import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const files=(await readdir(root)).filter(x=>x.endsWith('.html'));
let errors=[];let titles=new Set();let descriptions=new Set();
for(const file of files){const html=await readFile(path.join(root,file),'utf8');const clean=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');const ids=[...clean.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);if(new Set(ids).size!==ids.length)errors.push(`${file}: duplicate IDs`);
const title=html.match(/<title>(.*?)<\/title>/s)?.[1];if(!title||titles.has(title))errors.push(`${file}: missing or duplicate title`);titles.add(title);
if(file!=='404.html'){if((html.match(/<h1\b/g)||[]).length!==1)errors.push(`${file}: expected one h1`);if((html.match(/rel="canonical"/g)||[]).length!==1)errors.push(`${file}: expected canonical`);const desc=html.match(/<meta name="description" content="([^"]*)/i)?.[1];if(!desc||descriptions.has(desc))errors.push(`${file}: missing or duplicate description`);descriptions.add(desc);}
for(const match of clean.matchAll(/\b(?:href|src)="([^"<>]+)"/g)){let url=match[1];if(/^(https?:|mailto:|tel:|data:)/.test(url))continue;const [target,hash]=url.split('?')[0].split('#');if(!target&&!hash){errors.push(`${file}: empty target`);continue;}const dest=path.join(root,target||file);try{await stat(dest);}catch{errors.push(`${file}: missing ${target}`);continue;}if(hash&&dest.endsWith('.html')){const other=target?await readFile(dest,'utf8'):clean;if(!other.includes(`id="${hash}"`))errors.push(`${file}: missing anchor ${url}`);}}
for(const [,json]of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)){try{JSON.parse(json)}catch{errors.push(`${file}: invalid JSON-LD`)}}
}
for(const file of (await readdir(root)).filter(x=>x.endsWith('.js'))){try{new vm.Script(await readFile(path.join(root,file),'utf8'))}catch(e){errors.push(`${file}: ${e.message}`)}}
const reviews=JSON.parse(await readFile(path.join(root,'reviews.json'),'utf8'));for(const review of reviews){if('email'in review)errors.push('Public review contains private email');if(review.approved!==true||review.consent!==true)errors.push('Unapproved review in public data');}
console.log(`Checked ${files.length} HTML pages, local assets and anchors, metadata, JSON-LD, JavaScript and review privacy.`);if(errors.length){console.error(errors.join('\n'));process.exit(1)}console.log('PASS: all site integrity checks');

import {cp,mkdir,rm,readdir} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const file of ['index.html','album.html','style.css','app.js'])await cp(file,`dist/${file}`);
for(const file of ['LICENSE','THIRD_PARTY_NOTICES.md'])await cp(file,`dist/${file}`);
await mkdir('dist/assets',{recursive:true});
for(const file of ['desk.webp','empty.webp','childhood.webp','mother.webp','soup.webp','snow.webp','family.webp','teaching.webp','return.webp','favicon.svg'])await cp(`assets/${file}`,`dist/assets/${file}`);
await mkdir('dist/docs',{recursive:true});
await cp('docs/research.md','dist/docs/research.md');
console.log('Static album built in dist/');

await cp('film','dist/film',{recursive:true});

await mkdir('dist/assets/lamp-film/audio',{recursive:true});
for (const file of await readdir('assets/lamp-film')) {if(file.endsWith('.jpg'))await cp(`assets/lamp-film/${file}`,`dist/assets/lamp-film/${file}`);}
await cp('assets/lamp-film/audio/lamp-score-v1.mp3','dist/assets/lamp-film/audio/lamp-score-v1.mp3');

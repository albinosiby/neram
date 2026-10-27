import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

// Ship one matching stylesheet and script instead of mixing cached releases.
const root=new URL('./dist/',import.meta.url);
const read=name=>readFile(new URL(name,root),'utf8');
const css=(await Promise.all(['styles.css','views.css','metro.css'].map(read))).join('\n');
const js=(await Promise.all(['config.js','preferences.js','app.js','metro-data.js','metro.js'].map(read))).join('\n;\n');
const fingerprint=content=>createHash('sha256').update(content).digest('hex').slice(0,16);
const cssName=`neram.${fingerprint(css)}.css`,jsName=`neram.${fingerprint(js)}.js`;
let html=await read('index.html');
const styles=/(?:<link rel="stylesheet" href="\/(?:styles|views|neram\.[a-f0-9]+)\.css">\s*)+/g;
const scripts=/(?:<script src="\/(?:config|preferences|app|neram\.[a-f0-9]+)\.js"><\/script>\s*)+/g;
if(!styles.test(html)||!scripts.test(html))throw new Error('Missing Neram asset entrypoints');
styles.lastIndex=0;scripts.lastIndex=0;
html=html.replace(styles,`<link rel="stylesheet" href="/${cssName}">`)
 .replace(scripts,`<script src="/${jsName}"></script>\n`);
await writeFile(new URL(cssName,root),css);
await writeFile(new URL(jsName,root),js);
await writeFile(new URL('index.html',root),html);
// Keep prior committed bundles available to browsers with an older open page.
console.log(`Built ${cssName} and ${jsName}`);

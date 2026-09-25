/*
  Optional: download the venture photos so the site serves them itself.

    npm run fetch-images

  Saves one 1800px JPEG per venture into public/images/ventures/, then prints
  the `src:` lines to use in src/data/ventureMedia.js (replace `photo:` with
  `src:` for each venture you have downloaded).
*/
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { VENTURE_PHOTOS, unsplash } from '../src/data/ventureMedia.js';

const outDir = path.resolve('public/images/ventures');
await mkdir(outDir, { recursive: true });

for (const [name, id] of Object.entries(VENTURE_PHOTOS)) {
  const url = unsplash(id, 1800).replace('auto=format', 'fm=jpg');
  const res = await fetch(url);
  if (!res.ok) { console.error(`✗ ${name}: ${res.status}`); continue; }
  const file = path.join(outDir, `${name}.jpg`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  console.log(`✓ ${name}  →  src: '/images/ventures/${name}.jpg'`);
}

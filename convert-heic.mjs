import heicConvert from 'heic-convert';
import { readFile, writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const files = [
  { input: 'halims-img/IMG_6881.HEIC', output: 'public/halims-img/img_6881.jpg' },
  { input: 'halims-img/IMG_6882.HEIC', output: 'public/halims-img/img_6882.jpg' },
];

for (const f of files) {
  const inputBuffer = await readFile(resolve(__dirname, f.input));
  const outputBuffer = await heicConvert({
    buffer: inputBuffer,
    format: 'JPEG',
    quality: 0.88,
  });
  await writeFile(resolve(__dirname, f.output), Buffer.from(outputBuffer));
  console.log(`✓ Converted ${f.input} → ${f.output}`);
}

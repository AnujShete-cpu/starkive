import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Perfectly tuned, ultra-smooth connected SE monogram matching TS style
const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="114" ry="114" fill="#FEFD06" />

  <g transform="translate(256, 256) skewX(-13) translate(-256, -256)">
    <!-- Seamless Interlocked SE -->
    <path d="
      M 72 232
      C 72 188 108 165 160 165
      L 466 165
      L 434 218
      L 342 218
      L 342 254
      L 426 254
      L 398 304
      L 342 304
      L 342 338
      L 468 338
      L 436 391
      L 290 391
      L 290 218
      L 182 218
      C 150 218 138 228 138 240
      C 138 253 150 263 182 263
      L 230 263
      C 265 263 285 285 285 318
      C 285 358 255 391 198 391
      L 58 391
      L 90 338
      L 186 338
      C 212 338 224 328 224 318
      C 224 305 212 295 186 295
      L 138 295
      C 92 295 72 270 72 232
      Z
    " fill="#000000" />
  </g>
</svg>
`;

async function generate() {
  const publicDir = path.resolve(__dirname, '../public');

  const sizes = [
    { name: 'android-chrome-512x512.png', size: 512 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-16x16.png', size: 16 }
  ];

  const svgBuffer = Buffer.from(svg.trim());

  for (const s of sizes) {
    await sharp(svgBuffer)
      .resize(s.size, s.size)
      .png()
      .toFile(path.join(publicDir, s.name));
    console.log(`Generated ${s.name} (${s.size}x${s.size})`);
  }

  // Also write 48x48 as favicon.ico
  await sharp(svgBuffer)
    .resize(48, 48)
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Generated favicon.ico');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});

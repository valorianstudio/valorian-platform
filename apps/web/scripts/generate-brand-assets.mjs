// Regenerates every brand raster (navbar logo, favicon, app icons, OpenGraph image) from one master logo.
// Usage: node scripts/generate-brand-assets.mjs <path-to-master-logo.png>
// The master is black lettering on a white background; luminance becomes the alpha channel.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const source = process.argv[2];
if (!source) throw new Error('Pass the master logo path as the first argument.');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SLATE = '#344648';
const CREAM = '#fbe0c3';
const BACKGROUND = '#f8f4ee';

/** Black-on-white master -> single-colour RGBA with soft anti-aliased edges, trimmed to the artwork. */
async function recolour(input, hex) {
  const { data, info } = await sharp(input).greyscale().raw().toBuffer({ resolveWithObject: true });
  const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < data.length; i += 1) {
    const alpha = Math.max(0, Math.min(255, Math.round((255 - data[i]) * 1.08)));
    rgba.set([r, g, b, alpha < 6 ? 0 : alpha], i * 4);
  }
  return sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } });
}

async function trimmed(image, pad = 0) {
  const buffer = await image.png().toBuffer();
  const out = await sharp(buffer).trim({ threshold: 1 }).extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return out;
}

const write = async (path, buffer) => {
  const target = resolve(root, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, buffer);
  console.log('wrote', path, `${(buffer.length / 1024).toFixed(1)} KB`);
};

// 1. Wordmark (transparent). Black is the official colour; the cream variant is for dark sections.
const logoBlack = await trimmed(await recolour(source, '#000000'), 4);
await write('public/branding/valorian-logo.png', await sharp(logoBlack).png({ compressionLevel: 9 }).toBuffer());
const logoCream = await trimmed(await recolour(source, '#fffdfc'), 4);
await write('public/branding/valorian-logo-light.png', await sharp(logoCream).png({ compressionLevel: 9 }).toBuffer());
const meta = await sharp(logoBlack).metadata();
console.log('logo size', meta.width, meta.height);

// 2. The "V" monogram: the left part of the wordmark, up to where the "a" begins.
const monoBuffer = await (await recolour(source, CREAM)).png().toBuffer();
const vBox = { left: 40, top: 80, width: 285, height: 255 };
const cropped = await sharp(monoBuffer).extract(vBox).png().toBuffer();
// Keep only the connected shape holding the V (the crop also catches the corner of the "a").
const mono = await (async () => {
  const { data, info } = await sharp(cropped).raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const keep = new Uint8Array(width * height);
  const start = data.findIndex((_, i) => i % 4 === 3 && data[i] > 200) >> 2;
  const stack = [start];
  while (stack.length) {
    const p = stack.pop();
    if (keep[p] || data[p * 4 + 3] < 40) continue;
    keep[p] = 1;
    const x = p % width;
    if (x > 0) stack.push(p - 1);
    if (x < width - 1) stack.push(p + 1);
    if (p >= width) stack.push(p - width);
    if (p < width * (height - 1)) stack.push(p + width);
  }
  for (let p = 0; p < width * height; p += 1) if (!keep[p]) data[p * 4 + 3] = 0;
  const isolated = await sharp(data, { raw: { width, height, channels: 4 } }).png().toBuffer();
  return sharp(isolated).trim({ threshold: 1 }).png().toBuffer();
})();

async function tile(size, { radius = 0.22, glyph = 0.58 } = {}) {
  const glyphBuffer = await sharp(mono).resize({ width: Math.round(size * glyph), height: Math.round(size * glyph), fit: 'inside' }).toBuffer();
  const mask = Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${Math.round(size * radius)}" fill="#fff"/></svg>`);
  return sharp({ create: { width: size, height: size, channels: 4, background: SLATE } })
    .composite([{ input: glyphBuffer, gravity: 'center' }, { input: mask, blend: 'dest-in' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

await write('src/app/icon.png', await tile(512));
// iOS applies its own rounding, so the Apple icon is full-bleed.
await write('src/app/apple-icon.png', await (async () => {
  const size = 180;
  const glyph = await sharp(mono).resize({ width: 104, height: 104, fit: 'inside' }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 3, background: SLATE } }).composite([{ input: glyph, gravity: 'center' }]).png({ compressionLevel: 9 }).toBuffer();
})());

// favicon.ico: PNG-compressed 16/32/48 entries.
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => tile(s, { radius: 0.2, glyph: 0.64 })));
const header = Buffer.alloc(6);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = pngs.map((png, i) => {
  const entry = Buffer.alloc(16);
  entry[0] = sizes[i];
  entry[1] = sizes[i];
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += png.length;
  return entry;
});
await write('src/app/favicon.ico', Buffer.concat([header, ...entries, ...pngs]));

// 3. OpenGraph / Twitter card, 1200x630.
const W = 1200;
const H = 630;
const ogLogo = await sharp(logoCream).resize({ width: 560 }).toBuffer();
const ogLogoMeta = await sharp(ogLogo).metadata();
const svg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g" cx="82%" cy="12%" r="70%"><stop offset="0" stop-color="#4c6468"/><stop offset="1" stop-color="${SLATE}" stop-opacity="0"/></radialGradient>
    <radialGradient id="c" cx="10%" cy="105%" r="55%"><stop offset="0" stop-color="#ffbb98" stop-opacity="0.35"/><stop offset="1" stop-color="#ffbb98" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#2a3a3c"/><rect width="${W}" height="${H}" fill="url(#g)"/><rect width="${W}" height="${H}" fill="url(#c)"/>
  <rect x="80" y="${H - 150}" width="64" height="4" rx="2" fill="#ffbb98"/>
  <text x="80" y="${H - 96}" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="34" font-weight="600" fill="#fbe0c3">Software Development &amp; AI Solutions</text>
  <text x="80" y="${H - 52}" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="26" fill="#a9b8ba">Web apps · SaaS · Mobile · Custom software</text>
</svg>`);
await write('public/brand/og.png', await sharp(svg).composite([{ input: ogLogo, left: 80, top: Math.round((H - 190 - ogLogoMeta.height) / 2) + 20 }]).png({ compressionLevel: 9 }).toBuffer());

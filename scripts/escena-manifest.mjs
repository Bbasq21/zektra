/* Lo llama scripts/escena.sh: pone un hash del contenido en el nombre de cada archivo de
   la escena, lo mueve a public/como-trabajamos/, borra la versión anterior y actualiza
   src/data/proceso-media.json.
     node scripts/escena-manifest.mjs <carpeta-temporal> <número> */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, renameSync, copyFileSync, unlinkSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const [tmp, n] = process.argv.slice(2);
if (!tmp || !n) {
  console.error('Uso: node scripts/escena-manifest.mjs <carpeta-temporal> <número>');
  process.exit(1);
}
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/como-trabajamos');
const manifestPath = join(root, 'src/data/proceso-media.json');
const urlBase = '/como-trabajamos/';
const name = `escena-${n}`;

const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
const entry = manifest[name] ?? {};

/** Mueve el archivo con su hash y borra las versiones anteriores del mismo tipo. */
function place(file, base, ext) {
  const buf = readFileSync(join(tmp, file));
  const hash = createHash('sha256').update(buf).digest('hex').slice(0, 8);
  const old = new RegExp(`^${base.replace(/[-.]/g, '\\$&')}\\.[0-9a-f]{8}\\.${ext}$`);
  for (const f of readdirSync(outDir)) if (old.test(f)) unlinkSync(join(outDir, f));
  const finalName = `${base}.${hash}.${ext}`;
  try {
    renameSync(join(tmp, file), join(outDir, finalName));
  } catch {
    copyFileSync(join(tmp, file), join(outDir, finalName));
  }
  return urlBase + finalName;
}

/** Ancho y alto de un PNG (cabecera IHDR). */
function pngSize(path) {
  const b = readFileSync(path);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

const files = readdirSync(tmp);
if (files.includes(`${name}.mp4`)) entry.clip = place(`${name}.mp4`, name, 'mp4');
if (files.includes(`${name}-m.mp4`)) entry.clipMobile = place(`${name}-m.mp4`, `${name}-m`, 'mp4');

const widths = files
  .map((f) => f.match(new RegExp(`^${name}-(\\d+)\\.avif$`))?.[1])
  .filter(Boolean)
  .map(Number)
  .sort((a, b) => a - b);
if (widths.length) {
  const { width, height } = pngSize(join(tmp, 'cuadro.png'));
  entry.poster = {
    width,
    height,
    avif: widths.map((w) => [w, place(`${name}-${w}.avif`, `${name}-${w}`, 'avif')]),
    webp: widths.map((w) => [w, place(`${name}-${w}.webp`, `${name}-${w}`, 'webp')]),
  };
}
if (files.includes('og.jpg')) entry.og = place('og.jpg', 'og', 'jpg');

manifest[name] = entry;
const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b, 'es', { numeric: true })));
writeFileSync(manifestPath, JSON.stringify(sorted, null, 2) + '\n');
console.log(`Listo: ${name} en public/como-trabajamos/ y src/data/proceso-media.json.`);

import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';

/* Fecha real de cada artículo (updatedDate o pubDate) para el lastmod del sitemap.
   Solo se marca lastmod donde la fecha es real: Google ignora lastmod poco fiables. */
const blogDates = Object.fromEntries(
  readdirSync('./src/content/blog')
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const fm = readFileSync(`./src/content/blog/${f}`, 'utf8').split('---')[1] ?? '';
      const pick = (k) => fm.match(new RegExp(`^${k}:\\s*(.+)$`, 'm'))?.[1]?.trim();
      return [`/blog/${f.replace(/\.md$/, '')}/`, pick('updatedDate') ?? pick('pubDate')];
    })
    .filter(([, d]) => d),
);

/* Páginas fuera del blog con fecha real de su último cambio de contenido. Actualízala
   cuando cambie el texto o los videos de la página. */
const pageDates = {
  '/como-trabajamos/': '2026-10-13',
};

/* Los encabezados de vercel.json también se escriben en la salida del adaptador
   (.vercel/output/config.json), que es la que Vercel usa al desplegar con el Build Output API.
   Así la caché de un año de los videos y pósteres de /como-trabajamos/ no depende de que
   Vercel combine los dos archivos. Las fuentes de vercel.json aquí son expresiones regulares. */
const vercelHeaders = {
  name: 'zektra:vercel-headers',
  hooks: {
    'astro:build:done': () => {
      const out = './.vercel/output/config.json';
      if (!existsSync(out) || !existsSync('./vercel.json')) return;
      const { headers = [] } = JSON.parse(readFileSync('./vercel.json', 'utf8'));
      const config = JSON.parse(readFileSync(out, 'utf8'));
      const routes = headers.map((h) => ({
        src: `^${h.source}$`,
        headers: Object.fromEntries(h.headers.map(({ key, value }) => [key.toLowerCase(), value])),
        continue: true,
      }));
      config.routes = [...routes, ...config.routes.filter((r) => !routes.some((n) => n.src === r.src))];
      writeFileSync(out, JSON.stringify(config, null, '\t'));
    },
  },
};

export default defineConfig({
  site: 'https://zektra.co',
  trailingSlash: 'ignore',
  adapter: vercel(),
  integrations: [
    vercelHeaders,
    sitemap({
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        const path = new URL(item.url).pathname;
        const date = blogDates[path] ?? pageDates[path];
        if (date) item.lastmod = new Date(date).toISOString();
        return item;
      },
    }),
  ],
  devToolbar: { enabled: false },
  vite: {
    optimizeDeps: {
      include: ['three', 'three/examples/jsm/loaders/SVGLoader.js', 'three/examples/jsm/environments/RoomEnvironment.js', 'gsap', 'gsap/ScrollTrigger', 'lenis'],
    },
  },
  /* Todo el CSS va inline en el HTML: sin peticiones bloqueantes antes del primer render. */
  build: { inlineStylesheets: 'always' },
});

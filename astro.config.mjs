import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

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

export default defineConfig({
  site: 'https://zektra.co',
  trailingSlash: 'ignore',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        const date = blogDates[new URL(item.url).pathname];
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
  build: { inlineStylesheets: 'auto' },
});

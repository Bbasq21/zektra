import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://zektra.co',
  trailingSlash: 'ignore',
  adapter: vercel(),
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'auto' },
});

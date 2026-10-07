import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://zektra.co',
  trailingSlash: 'ignore',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  devToolbar: { enabled: false },
  vite: {
    optimizeDeps: {
      include: ['three', 'three/examples/jsm/loaders/SVGLoader.js', 'three/examples/jsm/environments/RoomEnvironment.js', 'gsap', 'gsap/ScrollTrigger', 'lenis'],
    },
  },
  build: { inlineStylesheets: 'auto' },
});

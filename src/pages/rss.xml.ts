import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../data/blog';

export const prerender = true;

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: 'Blog de Zektra',
    description: 'Guías prácticas sobre software a la medida, SEO técnico y producto digital.',
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/blog/${p.id}/`,
      categories: p.data.tags,
    })),
    customData: '<language>es-co</language>',
  });
}

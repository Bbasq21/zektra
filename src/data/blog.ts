import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Artículos publicados, del más reciente al más antiguo. */
export async function getPosts(): Promise<Post[]> {
  // Un pubDate futuro deja el artículo programado: aparece en el primer build posterior a esa hora.
  const posts = await getCollection('blog', ({ data }) => !data.draft && data.pubDate <= new Date());
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

const dateFmt = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const formatDate = (d: Date) => dateFmt.format(d);

/** Minutos de lectura a ~220 palabras por minuto. */
export function readingTime(body = ''): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

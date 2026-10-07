import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { SERVICES } from './data/services';

const serviceIds = SERVICES.map((s) => s.id) as [string, ...string[]];

/* Artículos del blog: un .md por artículo en src/content/blog/.
   El nombre del archivo es la URL: mi-articulo.md → /blog/mi-articulo/ */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    /** Título del artículo (H1). Sentence case. */
    title: z.string(),
    /** Título para Google si debe ser distinto o más corto (≤ 60 caracteres). */
    seoTitle: z.string().max(60).optional(),
    /** Meta description, 140–160 caracteres. */
    description: z.string().min(80).max(170),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Servicio de Zektra relacionado: se enlaza al final del artículo. */
    service: z.enum(serviceIds).optional(),
    tags: z.array(z.string()).default([]),
    /** true = no se publica ni entra al sitemap. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };

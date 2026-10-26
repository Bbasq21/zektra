import type { APIRoute } from 'astro';

/* /feed/ es una URL heredada del sitio anterior (Google aún la rastrea).
   Se redirige con 301 al feed actual para que salga del informe de indexación. */
export const prerender = false;

export const GET: APIRoute = ({ redirect }) => redirect('/rss.xml', 301);

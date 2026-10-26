---
title: "Cómo migrar tu sitio web sin perder posicionamiento en Google"
seoTitle: "Migrar un sitio web sin perder posicionamiento"
description: "Guía paso a paso para cambiar de plataforma, dominio o diseño sin que tu tráfico orgánico pague el cambio: inventario, redirecciones 301 y seguimiento."
pubDate: 2026-10-07
service: seo-rendimiento
tags: [SEO, Migración]
---

Cambiar de plataforma, rediseñar el sitio o pasar a un dominio nuevo es una buena noticia para tu negocio. Para Google, en cambio, es un momento de duda: las páginas que conocía cambian de dirección, de contenido o desaparecen. Si nadie le explica qué pasó, el posicionamiento que tardaste años en construir puede caer en semanas.

La buena noticia es que una migración bien planeada no tiene por qué costarte tráfico. Este es el proceso que seguimos en Zektra, el mismo que aplicamos al migrar el sitio y el blog de una empresa del sector inmobiliario a una plataforma .NET.

## 1. Mide antes de tocar

Antes de cambiar una sola línea necesitas una **línea base**: una foto de cómo está el sitio hoy. Sin ella no sabrás si la migración salió bien ni qué corregir.

- Exporta desde Google Search Console las páginas que reciben clics e impresiones, y las consultas que las traen.
- Mide el rendimiento con PageSpeed Insights en las páginas más importantes, en móvil y en escritorio.
- Anota qué páginas generan contactos, ventas o registros. No todas las URL valen lo mismo.

Guarda todo con fecha. Será tu punto de comparación durante los meses siguientes.

## 2. Haz un inventario completo de URL

Lista **todas** las direcciones del sitio actual, no solo las del menú: artículos del blog, categorías, etiquetas, landing pages de campañas, PDF e imágenes que reciben tráfico. Un rastreador como Screaming Frog, el sitemap y los informes de Search Console te ayudan a no dejar nada por fuera.

Las URL que olvides en este paso son las que se convierten en errores 404 después del lanzamiento.

## 3. Construye el mapa de redirecciones

Por cada URL vieja decide a dónde va en el sitio nuevo:

| Situación | Qué hacer |
|---|---|
| La página sigue existiendo con otra dirección | Redirección 301 a la nueva URL |
| Varias páginas se unen en una | Redirección 301 de todas a la página que las reemplaza |
| La página desaparece y no tiene equivalente | Redirección 301 a la página más relacionada o, si no existe ninguna, dejar que responda 404 |

Dos reglas que evitan la mayoría de problemas:

- **Redirige uno a uno, no todo al inicio.** Mandar cientos de URL a la página principal es, para Google, casi lo mismo que borrarlas.
- **Evita cadenas.** Si la URL A ya redirigía a B, y ahora B pasa a C, haz que A vaya directo a C.

## 4. Conserva lo que ya funciona

Una migración no es el momento para reescribir todo a la vez. En las páginas que ya posicionan, mantén los títulos, las meta descriptions, los encabezados y el contenido principal, o mejóralos con cuidado. Cuantos más cambios simultáneos, más difícil será saber qué causó una caída.

Revisa también lo técnico que suele perderse en el cambio:

- Etiquetas canonical apuntando a las URL nuevas.
- Datos estructurados (organización, artículos, migas de pan).
- Textos alternativos de las imágenes.
- Enlaces internos: actualízalos a las URL nuevas en vez de depender de las redirecciones.

## 5. Prueba en un entorno de staging

Monta el sitio nuevo en un entorno de pruebas **bloqueado para buscadores** (con contraseña o con `noindex`) y verifica allí:

- Que cada redirección del mapa responde con código 301 y llega a la página correcta.
- Que no hay enlaces rotos ni páginas importantes sin título o sin descripción.
- Que el sitio carga rápido en móvil.

Antes de lanzar, **quita el bloqueo**. Publicar un sitio con `noindex` olvidado es uno de los errores más comunes y más dañinos.

## 6. Lanza y avísale a Google

El día del lanzamiento:

1. Activa las redirecciones al mismo tiempo que el sitio nuevo.
2. Envía el sitemap nuevo en Search Console.
3. Usa la herramienta de inspección de URL para pedir la indexación de las páginas clave.
4. Si cambiaste de dominio, usa además la herramienta de cambio de dirección de Search Console.

## 7. Haz seguimiento durante las semanas siguientes

Es normal ver algo de movimiento en el posicionamiento los primeros días mientras Google rastrea las URL nuevas. Lo importante es la tendencia. Durante al menos un mes revisa:

- El informe de páginas de Search Console, buscando errores 404 y páginas excluidas.
- Clics e impresiones comparados con tu línea base.
- Que las URL viejas desaparezcan del índice y las nuevas ocupen su lugar.

Si una página importante cae, vuelve a tu inventario: casi siempre la causa es una redirección que falta, un contenido que cambió demasiado o un canonical mal configurado.

## En resumen

Migrar sin perder posicionamiento es, sobre todo, cuestión de orden: medir, inventariar, redirigir uno a uno, probar y hacer seguimiento. Si estás por cambiar de plataforma o rediseñar tu sitio, [cuéntanos tu caso](/contacto/?servicio=seo-rendimiento) y te ayudamos a planear la migración antes de que el tráfico pague el cambio.

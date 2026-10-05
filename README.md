# zektra.co

Sitio web de Zektra, construido sobre el Design System Zektra (Manual de Identidad Visual 2026).

- **Astro 7**: páginas estáticas, más una sola función serverless para el formulario.
- **CSS con BEM**: sin Tailwind. Tokens en `src/styles/tokens.css` y estilos de cada componente dentro de su `.astro`.
- **GSAP + ScrollTrigger**: animaciones de entrada, texto por palabras y progreso del proceso. **Lenis** maneja el scroll suave.
- **three.js**: tres escenas que se cargan solo cuando hacen falta.

## Empezar

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # compila para producción (.vercel/output)
```

Requiere Node 22.12 o superior.

## Estructura

```
src/
  styles/        tokens.css (design system) · base.css (reset y bloques globales)
  layouts/       BaseLayout.astro (SEO, Open Graph, header, footer, scripts)
  components/    Header, Footer, Hero, Button, SectionHead, ServiceCard, CaseCard,
                 Process, CtaBand, Marquee, Icon
  pages/         index · servicios · casos · nosotros · contacto · 404 · api/contacto.ts
  data/          site.ts (nav y contacto) · services.ts · cases.ts · monogram.ts
  scripts/
    app.ts       Lenis, header, menú, split de texto, reveals, efectos de puntero
    scenes/      loader.ts (carga perezosa) · base.ts · flow.ts · network.ts · monogram.ts
public/          fonts (woff2), logos (SVG oficiales), favicon, og.png
```

### Convención BEM

`bloque__elemento--modificador`. Un bloque por componente (`.service-card`, `.service-card__title`, `.case-card--detailed`). Los estados que pone JavaScript usan `is-*` (`.is-active`, `.is-loaded`). Los ganchos para animación son atributos `data-*`, nunca clases:

| Atributo | Qué hace |
|---|---|
| `data-reveal` | Entra con fade y desplazamiento al hacer scroll |
| `data-stagger` | Sus hijos entran en cascada |
| `data-split` | Titular que entra palabra por palabra (`data-split-immediate` en el hero) |
| `data-scrub-text` | El texto se ilumina palabra a palabra con el scroll |
| `data-progress` | Línea de progreso del proceso |
| `data-magnetic` / `data-tilt` | Botón magnético / brillo que sigue al puntero |
| `data-scene="flow\|network\|monogram"` | Escena 3D del hero |

### Escenas 3D

| Escena | Página | Idea |
|---|---|---|
| `flow` | Inicio y 404 | Cintas de partículas que recorren el gradiente oficial |
| `network` | Servicios | Constelación de nodos conectados con pulsos de datos |
| `monogram` | Nosotros | El monograma ZK oficial, extruido en 3D |

three.js se descarga solo cuando la escena está cerca de la pantalla y se pausa cuando sale de ella. Con `prefers-reduced-motion` se dibuja un único cuadro estático y no hay scroll suave ni animaciones. Sin WebGL, el hero muestra el resplandor en CSS.

### Editar contenido

- Servicios: `src/data/services.ts`
- Casos (sin nombre de cliente): `src/data/cases.ts`
- Correo, ciudad y menú: `src/data/site.ts`

## Publicar en Vercel (recomendado)

1. Crea un repositorio en GitHub y sube este proyecto (`git push`).
2. En Vercel: **Add New → Project**, importa el repositorio. Vercel detecta Astro solo. No cambies nada del build.
3. En **Settings → Environment Variables** agrega:
   - `RESEND_API_KEY`: crea la cuenta en resend.com y verifica el dominio `zektra.co`.
   - `CONTACT_TO`: `brandon@zektra.co`
   - `CONTACT_FROM`: `Zektra Web <web@zektra.co>` (debe ser del dominio verificado).
4. En **Settings → Domains** agrega `zektra.co` y `www.zektra.co`. Vercel te muestra los registros DNS (un `A` y un `CNAME`). Créalos en el DNS de Hostinger. El correo de Hostinger sigue funcionando porque los registros MX no se tocan.
5. Cada `git push` a `main` publica. Cada rama o pull request genera una URL de vista previa.

Sin `RESEND_API_KEY` el sitio funciona igual; el formulario responde «aún no está configurado» y muestra el correo directo.

## Pendientes antes de publicar

- Revisar la redacción de los casos en `src/data/cases.ts`.
- Confirmar que la licencia de **Technovier** (Almarkhatype) permite uso web.
- Pedir al diseñador versiones de los logos sin la sombra paralela que traen los SVG.

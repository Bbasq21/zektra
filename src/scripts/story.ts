/* «Nuestra historia»: lectura del scroll por capítulo y estado de las tarjetas.
   La escena 3D (scenes/world.ts) usa las mismas funciones para mover la cámara, así que
   texto y cámara siempre están de acuerdo sobre en qué capítulo va el visitante.

   Cada capítulo ocupa varias pantallas de scroll y se recorre en tres tramos:
     0 → DIVE   la cámara baja desde lo alto hasta el interior de la isla
     DIVE → HOLD la cámara se queda mientras se lee la tarjeta
     HOLD → 1   la cámara sube y vuela hasta la isla siguiente
   El último capítulo no tiene vuelo: baja y se queda. */
import { scrollToY } from './app';

export const STORY = { dive: 0.38, hold: 0.62, lastDive: 0.45 } as const;

export interface StoryPosition {
  /** Capítulo en pantalla. */
  index: number;
  /** Avance dentro del capítulo, de 0 a 1. */
  s: number;
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/** Capítulo actual y avance dentro de él, leído de la posición real de cada capítulo. */
export function readStory(chapters: HTMLElement[]): StoryPosition {
  const n = chapters.length;
  const vh = window.innerHeight;
  for (let i = 0; i < n; i++) {
    const r = chapters[i].getBoundingClientRect();
    if (i === 0 && r.top > 0) return { index: 0, s: 0 };
    const last = i === n - 1;
    if (r.bottom > 0 || last) {
      // El último capítulo termina cuando su borde inferior llega al borde inferior de la pantalla.
      const span = last ? Math.max(1, r.height - vh) : r.height;
      return { index: i, s: clamp01(-r.top / span) };
    }
  }
  return { index: 0, s: 0 };
}

/** Posición de la cámara en la lista de puntos clave del recorrido (3 por capítulo, 2 en el último). */
export function chapterKey(index: number, s: number, n: number) {
  const base = 3 * index;
  if (index >= n - 1) return s < STORY.lastDive ? base + easeInOut(s / STORY.lastDive) : base + 1;
  if (s < STORY.dive) return base + easeInOut(s / STORY.dive);
  if (s < STORY.hold) return base + 1;
  return base + 1 + 2 * easeInOut((s - STORY.hold) / (1 - STORY.hold));
}

/** 0 fuera de la pausa del capítulo; sube a 1 y vuelve a 0 durante la pausa (deriva lenta de cámara). */
export function holdDrift(index: number, s: number, n: number) {
  const last = index >= n - 1;
  const a = last ? STORY.lastDive : STORY.dive;
  const b = last ? 1 : STORY.hold;
  if (s <= a || s >= b) return 0;
  return Math.sin(((s - a) / (b - a)) * Math.PI);
}

/** La tarjeta se ve mientras la cámara está llegando o quieta, y se va antes del vuelo. */
export function cardVisible(index: number, s: number, n: number) {
  if (index === 0) return s < 0.78;
  if (index >= n - 1) return s > 0.15;
  return s > 0.15 && s < 0.78;
}

/** Punto de scroll donde el capítulo tiene la cámara quieta y la tarjeta a la vista. */
function holdY(chapter: HTMLElement, last: boolean) {
  const top = chapter.getBoundingClientRect().top + window.scrollY;
  const h = chapter.offsetHeight;
  return last ? top + 0.6 * Math.max(0, h - window.innerHeight) : top + ((STORY.dive + STORY.hold) / 2) * h;
}

export function initStory() {
  const section = document.querySelector<HTMLElement>('[data-story]');
  if (!section) return;
  const chapters = Array.from(section.querySelectorAll<HTMLElement>('[data-story-chapter]'));
  const links = Array.from(section.querySelectorAll<HTMLAnchorElement>('[data-story-link]'));
  const n = chapters.length;
  const root = document.documentElement;
  const wide = window.matchMedia('(min-width: 861px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Modo vivo: escritorio con escena 3D y sin movimiento reducido. En cualquier otro caso
     (móvil, sin WebGL, equipo lento) los capítulos se apilan y todas las tarjetas se ven. */
  const isLive = () => wide.matches && !reduced.matches && !root.classList.contains('no-scenes');

  let current = -1;
  let ticking = false;

  const update = () => {
    ticking = false;
    if (!section.classList.contains('story--live')) return;
    const { index, s } = readStory(chapters);
    const show = cardVisible(index, s, n);
    chapters.forEach((c, i) => c.classList.toggle('is-active', i === index && show));
    if (index !== current) {
      current = index;
      links.forEach((l, i) => (i === index ? l.setAttribute('aria-current', 'step') : l.removeAttribute('aria-current')));
    }
  };

  const applyMode = () => {
    const live = isLive();
    section.classList.toggle('story--live', live);
    if (!live) chapters.forEach((c) => c.classList.remove('is-active'));
    update();
  };

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
  wide.addEventListener('change', applyMode);
  reduced.addEventListener('change', applyMode);
  window.addEventListener('resize', update, { passive: true });

  // Si el equipo no sostiene la escena (base.ts la congela), la historia pasa a capítulos apilados.
  section.addEventListener('scene:frozen', () => {
    root.classList.add('no-scenes');
    applyMode();
  });

  /* El riel lleva a la pausa de cada capítulo, no a su borde superior (ahí la cámara aún va
     en lo alto y la tarjeta no ha entrado). Se escucha en captura para adelantarse al scroll
     suave genérico de los enlaces con #. */
  section.addEventListener(
    'click',
    (e) => {
      if (!section.classList.contains('story--live')) return;
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('[data-story-link]');
      if (!link) return;
      const i = links.indexOf(link);
      if (i < 0) return;
      e.preventDefault();
      e.stopPropagation();
      scrollToY(holdY(chapters[i], i === n - 1));
      history.replaceState(null, '', `#${chapters[i].id}`);
    },
    true,
  );

  // El modo depende de la decisión del cargador de escenas (clase no-scenes), que corre al iniciar la app.
  requestAnimationFrame(() => {
    applyMode();
    const target = location.hash ? chapters.findIndex((c) => `#${c.id}` === location.hash) : -1;
    if (target > 0 && section.classList.contains('story--live')) scrollToY(holdY(chapters[target], target === n - 1), true);
  });
}

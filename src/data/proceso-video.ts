/* Videos del recorrido «Cómo trabajamos» (/como-trabajamos/).
   El scroll mueve el tiempo del video. Las seis escenas son cortes consecutivos de una sola
   película: cada una empieza donde termina la anterior (la cámara sale de la isla, vuela
   siguiendo el hilo de datos y baja a la isla siguiente) y termina quieta sobre su escena,
   así que las costuras coinciden cuadro a cuadro y no hay clips de transición aparte.

   Los archivos y sus nombres con hash salen de src/data/proceso-media.json, que escribe
   scripts/escena.sh. Para cambiar una escena:
     1. bash scripts/escena.sh <video.mp4> <número>
     2. Si la cámara llega a la isla en otro momento, ajusta `focus`. */
import media from './proceso-media.json';

export interface PosterSet {
  width: number;
  height: number;
  avif: [number, string][];
  webp: [number, string][];
}

export interface ChapterVideo {
  /** Video de escritorio (resolución original, GOP corto). */
  clip: string;
  /** 960×540, GOP 4: celulares y conexiones lentas. */
  clipMobile: string;
  /** Cuadro que se ve mientras el video no carga y en el modo sin video. */
  poster: PosterSet;
  /** Pantallas de scroll que dura la escena. Más scroll = la cámara va más despacio. */
  scroll: number;
  /** 0–1: punto del video donde el texto queda del todo visible (la llegada a la escena). */
  focus: number;
}

type MediaEntry = { clip: string; clipMobile: string; poster: PosterSet; og?: string };
const M = media as unknown as Record<string, MediaEntry>;

/** Ritmo por capítulo, en el orden de CHAPTERS. Los `focus` salen de medir el movimiento
    de cada clip: es donde la cámara termina de bajar y la escena se queda quieta. */
const PACE: Record<string, { scene: number; scroll: number; focus: number }> = {
  origen: { scene: 1, scroll: 2.2, focus: 0 },
  estrategia: { scene: 2, scroll: 2, focus: 0.82 },
  diseno: { scene: 3, scroll: 2, focus: 0.48 },
  desarrollo: { scene: 4, scroll: 2, focus: 0.68 },
  evolucion: { scene: 5, scroll: 2, focus: 0.42 },
  'tu-proyecto': { scene: 6, scroll: 1.8, focus: 0.5 },
};

export const CHAPTER_VIDEOS: Record<string, ChapterVideo> = Object.fromEntries(
  Object.entries(PACE).map(([id, p]) => {
    const m = M[`escena-${p.scene}`];
    return [id, { clip: m.clip, clipMobile: m.clipMobile, poster: m.poster, scroll: p.scroll, focus: p.focus }];
  }),
);

/** Imagen para redes (1200×630), sacada del póster de la escena 1. */
export const OG_IMAGE = M['escena-1'].og ?? '/og.png';

/** Fundido entre escenas, en pantallas. Corto: las costuras ya coinciden cuadro a cuadro. */
export const CROSSFADE = 0.04;

export const srcset = (list: [number, string][]) => list.map(([w, u]) => `${u} ${w}w`).join(', ');

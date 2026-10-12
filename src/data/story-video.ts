/* «Nuestra historia» en video (/historia-video/).
   Mismos capítulos y textos que la versión 3D (src/data/story.ts); aquí solo se dice qué
   video acompaña a cada uno. El scroll mueve el tiempo del video.

   Las seis escenas son cortes consecutivos de una sola película: cada una empieza donde
   termina la anterior (la cámara sale de la isla, vuela siguiendo el hilo de datos y baja a
   la isla siguiente) y termina quieta sobre su escena. Por eso no hay clips de transición
   aparte: la escena i+1 ya trae el vuelo desde la i, y las costuras coinciden cuadro a
   cuadro.

   Cómo cambiar o sumar una escena:
     1. Codifícala con scripts/escena.sh (deja el .mp4, el -m.mp4 y el póster en
        public/historia/).
     2. Llena `clip`, `clipMobile` y `poster` del capítulo.
     3. Ajusta `focus` al momento en que la cámara llega a la escena: ahí aparece el texto.
   Si algún día hay clips de transición separados, van en TRANSITIONS (posición i = de la
   escena i a la i+1); con `null` las dos escenas se funden directamente. */
export interface ChapterVideo {
  /** Video de escritorio (resolución original, GOP corto). */
  clip?: string;
  /** Versión liviana para celulares (960 de ancho, GOP 4). */
  clipMobile?: string;
  /** Primer cuadro del video: se ve mientras el clip carga y con movimiento reducido. */
  poster?: string;
  /** Pantallas de scroll que dura la escena. Más scroll = la cámara va más despacio. */
  scroll?: number;
  /** 0–1: punto del video donde el texto queda del todo visible (la llegada a la escena).
      El texto entra un poco antes y se va cuando empieza la escena siguiente. */
  focus?: number;
  /** 0–0,6: la cámara se detiene a mitad de escena. 0 = ritmo parejo. */
  linger?: number;
}

/** En el mismo orden de CHAPTERS. Los `focus` salen de medir el movimiento de cada clip:
    es donde la cámara termina de bajar y la escena se queda quieta. */
export const CHAPTER_VIDEOS: Record<string, ChapterVideo> = {
  origen: { clip: '/historia/escena-1.mp4', clipMobile: '/historia/escena-1-m.mp4', poster: '/historia/escena-1.webp', scroll: 2.2, focus: 0 },
  estrategia: { clip: '/historia/escena-2.mp4', clipMobile: '/historia/escena-2-m.mp4', poster: '/historia/escena-2.webp', scroll: 2, focus: 0.82 },
  diseno: { clip: '/historia/escena-3.mp4', clipMobile: '/historia/escena-3-m.mp4', poster: '/historia/escena-3.webp', scroll: 2, focus: 0.48 },
  desarrollo: { clip: '/historia/escena-4.mp4', clipMobile: '/historia/escena-4-m.mp4', poster: '/historia/escena-4.webp', scroll: 2, focus: 0.68 },
  evolucion: { clip: '/historia/escena-5.mp4', clipMobile: '/historia/escena-5-m.mp4', poster: '/historia/escena-5.webp', scroll: 2, focus: 0.42 },
  'tu-proyecto': { clip: '/historia/escena-6.mp4', clipMobile: '/historia/escena-6-m.mp4', poster: '/historia/escena-6.webp', scroll: 1.8, focus: 0.5 },
};

/** Transiciones: TRANSITIONS[i] vuela de la escena i a la i+1. `null` = sin clip aparte. */
export const TRANSITIONS: (string | null)[] = [null, null, null, null, null];

/** Pantallas de scroll por escena y por transición, si el capítulo no dice otra cosa.
    El fundido entre escenas es corto porque las costuras ya coinciden cuadro a cuadro. */
export const REEL = { sceneScroll: 1.8, transitionScroll: 0.9, crossfade: 0.04 } as const;

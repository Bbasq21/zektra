/* «Nuestra historia» en video (/historia-video/).
   Mismos capítulos y textos que la versión 3D (src/data/story.ts); aquí solo se dice qué
   video acompaña a cada uno. El scroll mueve el tiempo del video: la cámara baja a la
   escena de cada capítulo y un clip de transición la lleva a la siguiente.

   Cómo sumar una escena nueva:
     1. Codifica el video con scripts/escena.sh (deja el .mp4, el -m.mp4 y el póster en
        public/historia/).
     2. Llena `clip`, `clipMobile` y `poster` del capítulo.
     3. Cuando exista la transición entre dos escenas, ponla en TRANSITIONS (posición i =
        de la escena i a la i+1). Si falta, las dos escenas se funden directamente.

   Un capítulo sin video ni póster se muestra sobre el fondo crema con el texto encima:
   la página funciona completa mientras se producen las escenas. */
export interface ChapterVideo {
  /** Video de escritorio (1080p, GOP corto). */
  clip?: string;
  /** Versión liviana para celulares (720p, GOP 4). */
  clipMobile?: string;
  /** Primer cuadro del video: se ve mientras el clip carga y con movimiento reducido. */
  poster?: string;
  /** Pantallas de scroll que dura la escena. Más scroll = la cámara va más despacio. */
  scroll?: number;
  /** 0–0,6: la cámara se detiene a mitad de escena, justo cuando el texto está arriba. */
  linger?: number;
}

/** En el mismo orden de CHAPTERS. */
export const CHAPTER_VIDEOS: Record<string, ChapterVideo> = {
  origen: {
    clip: '/historia/escena-1.mp4',
    clipMobile: '/historia/escena-1-m.mp4',
    poster: '/historia/escena-1.webp',
    scroll: 1.8,
    linger: 0.35,
  },
  estrategia: {},
  diseno: {},
  desarrollo: {},
  evolucion: {},
  'tu-proyecto': { scroll: 1.6 },
};

/** Transiciones: TRANSITIONS[i] vuela de la escena i a la i+1. `null` = fundido directo. */
export const TRANSITIONS: (string | null)[] = [null, null, null, null, null];

/** Pantallas de scroll por escena y por transición, si el capítulo no dice otra cosa. */
export const REEL = { sceneScroll: 1.4, transitionScroll: 0.9, crossfade: 0.12 } as const;

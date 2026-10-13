/* Método de trabajo de Zektra.
   - STEPS: los cuatro pasos del proceso. Los usan el componente Process (inicio) y la
     página /como-trabajamos/; cambiarlos aquí los cambia en los dos lugares.
   - CHAPTERS: los seis capítulos del recorrido en /como-trabajamos/, en el orden de los
     videos (src/data/proceso-video.ts). El `id` es el ancla de cada capítulo y la llave del
     video: no lo cambies sin cambiarlo allá.
   Los pasos de cada servicio (src/data/service-details.ts, «Cómo lo trabajamos») son estos
   mismos cuatro pasos aterrizados a cada servicio: si cambias el método, revísalos.
   Reglas de voz: tuteo, Zektra en primera plural, beneficio antes que tecnología, sin
   cifras, plazos ni clientes inventados. */

export type ProcessStep = { title: string; text: string };

/** Paso de proceso (Estrategia · Diseño · Desarrollo · Evolución). */
export const STEPS: ProcessStep[] = [
  { title: 'Estrategia', text: 'Entendemos tu negocio, a tus usuarios y qué tiene que lograr el producto. Salimos con un alcance claro y priorizado.' },
  { title: 'Diseño', text: 'Flujos, arquitectura y prototipo de alta fidelidad. Lo validamos contigo, y con usuarios reales cuando hace falta, antes de construir.' },
  { title: 'Desarrollo', text: 'Código limpio, administrable y medido desde el primer despliegue. Ves avances en un entorno de pruebas durante todo el proceso.' },
  { title: 'Evolución', text: 'Lanzamos y nos quedamos: medimos, corregimos y mejoramos. Un producto digital nunca está terminado.' },
];

export type ChapterAccent = 'indigo' | 'violeta' | 'magenta' | 'coral' | 'ambar' | 'menta';

export type Chapter = {
  id: string;
  /** Nombre corto para el riel de capítulos. */
  label: string;
  /** Número del capítulo (01–06), en Google Sans: nunca en Technovier. */
  number: string;
  /** Eyebrow en Technovier: solo letras, sin cifras. */
  eyebrow: string;
  /** Admite <strong> (itálica bold en color acento) y, solo en el H1, <em> (la palabra en Magenta). */
  title: string;
  text: string;
  /** Qué recibes al terminar este paso, si aplica. */
  deliverable?: string;
  /** Color del gradiente oficial que marca el capítulo en el riel. */
  accent: ChapterAccent;
};

export const CHAPTERS: Chapter[] = [
  {
    id: 'origen',
    label: 'Punto de partida',
    number: '01',
    eyebrow: 'Cómo trabajamos',
    title: 'Tu <em>idea</em> es el <strong>punto de partida</strong>',
    text: 'Antes de proponer, escuchamos qué quieres lograr, para quién y qué te frena hoy. Te acompañamos desde Medellín, con comunicación directa de principio a fin.',
    deliverable: 'Una propuesta clara de cómo seguir.',
    accent: 'indigo',
  },
  {
    id: 'estrategia',
    label: STEPS[0].title,
    number: '02',
    eyebrow: STEPS[0].title,
    title: 'Primero, <strong>entender</strong>',
    text: 'Entendemos tu negocio, a tus usuarios y qué tiene que lograr el producto. Así lo primero que se construye es lo que más resuelve.',
    deliverable: 'Un alcance claro y priorizado.',
    accent: 'violeta',
  },
  {
    id: 'diseno',
    label: STEPS[1].title,
    number: '03',
    eyebrow: STEPS[1].title,
    title: 'Diseño que se <strong>valida</strong>',
    text: 'Flujos, arquitectura y un prototipo de alta fidelidad que pruebas antes de construir, con usuarios reales cuando hace falta. Cambiar de idea aquí cuesta poco.',
    deliverable: 'Un prototipo navegable, validado contigo.',
    accent: 'magenta',
  },
  {
    id: 'desarrollo',
    label: STEPS[2].title,
    number: '04',
    eyebrow: STEPS[2].title,
    title: 'Hecho para <strong>tu equipo</strong>',
    text: 'Construimos por entregas y ves cada avance en un entorno de pruebas. Trabajamos con IA de la mano para ir más rápido, sin perder la calidad humana: las decisiones y la revisión final las hace una persona.',
    deliverable: 'Un producto administrable, con su código y su documentación.',
    accent: 'coral',
  },
  {
    id: 'evolucion',
    label: STEPS[3].title,
    number: '05',
    eyebrow: STEPS[3].title,
    title: 'Lanzamos y <strong>nos quedamos</strong>',
    text: 'Salimos con velocidad, accesibilidad y SEO técnico desde el primer día. Después medimos, corregimos y mejoramos: un producto digital nunca está terminado.',
    deliverable: 'Tu producto publicado y una ruta clara de lo que sigue.',
    accent: 'ambar',
  },
  {
    id: 'tu-proyecto',
    label: 'Tu proyecto',
    number: '06',
    eyebrow: 'Tu proyecto',
    title: '¿Tienes una idea? <strong>Hagámosla real.</strong>',
    text: 'Cuéntanos qué quieres construir y te respondemos con una propuesta clara.',
    accent: 'menta',
  },
];

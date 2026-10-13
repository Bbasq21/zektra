/* Capítulos de «Nuestra historia» (/historia/).
   Cada capítulo es una isla del mundo 3D (src/scripts/scenes/world.ts), en este mismo orden.
   Los textos salen del proceso y los principios que ya usa el sitio; si cambias el proceso
   en Process.astro o en Nosotros, actualízalo también aquí. */
export type ChapterAccent = 'indigo' | 'violeta' | 'magenta' | 'coral' | 'ambar' | 'menta';

export type Chapter = {
  id: string;
  /** Nombre corto para el riel de capítulos. */
  label: string;
  /** Número del paso del proceso (01–04), si el capítulo es un paso. */
  step?: string;
  eyebrow: string;
  /** Admite <strong> para el gesto de marca. */
  title: string;
  text: string;
  tags?: string[];
  /** Color del gradiente oficial que marca la isla y el hilo de datos que llega a ella. */
  accent: ChapterAccent;
};

export const CHAPTERS: Chapter[] = [
  {
    id: 'origen',
    label: 'Origen',
    eyebrow: 'Nuestra historia · Medellín',
    title: 'Todo empieza con una <strong>idea</strong>',
    text: 'Zektra nace en Medellín para convertir ideas en soluciones digitales: software a la medida, sitios y plataformas que impulsan a empresas y personas.',
    accent: 'indigo',
  },
  {
    id: 'estrategia',
    label: 'Estrategia',
    step: '01',
    eyebrow: 'Primer paso · Estrategia',
    title: 'Primero, <strong>entender</strong>',
    text: 'Antes de diseñar una pantalla entendemos tu negocio, a las personas que lo usan y lo que el producto tiene que lograr. Salimos con un alcance claro y priorizado.',
    tags: ['Procesos', 'Usuarios', 'Alcance'],
    accent: 'violeta',
  },
  {
    id: 'diseno',
    label: 'Diseño',
    step: '02',
    eyebrow: 'Segundo paso · Diseño',
    title: 'Diseño que se <strong>valida</strong>',
    text: 'Flujos, arquitectura y prototipos de alta fidelidad que probamos contigo, y con usuarios reales cuando hace falta, antes de escribir código.',
    tags: ['UX/UI', 'Prototipos', 'Figma'],
    accent: 'magenta',
  },
  {
    id: 'desarrollo',
    label: 'Desarrollo',
    step: '03',
    eyebrow: 'Tercer paso · Desarrollo',
    title: 'Hecho para <strong>tu equipo</strong>',
    text: 'Código limpio, administrable y medido desde el primer despliegue. Ves avances en un entorno de pruebas durante todo el proceso.',
    tags: ['Software a la medida', 'CMS', 'Integraciones'],
    accent: 'coral',
  },
  {
    id: 'evolucion',
    label: 'Evolución',
    step: '04',
    eyebrow: 'Cuarto paso · Evolución',
    title: 'Lanzamos y <strong>nos quedamos</strong>',
    text: 'Velocidad, accesibilidad y SEO técnico desde el primer día. Después medimos, corregimos y mejoramos: un producto digital nunca está terminado.',
    tags: ['SEO técnico', 'Rendimiento', 'Soporte'],
    accent: 'ambar',
  },
  {
    id: 'tu-proyecto',
    label: 'Tu proyecto',
    eyebrow: 'Tu turno',
    title: '¿Tienes una idea? <strong>Hagámosla real.</strong>',
    text: 'Cuéntanos qué quieres construir y te respondemos con una propuesta clara.',
    accent: 'menta',
  },
];

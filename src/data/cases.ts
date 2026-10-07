/* Casos sin nombre de cliente: se describen por industria y por lo que se hizo.
   Antes de publicar, revisa que cada descripción sea precisa. */
export type Case = {
  id: string;
  industry: string;
  title: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  tags: string[];
  accent: 'menta' | 'violeta' | 'magenta' | 'coral' | 'ambar' | 'indigo';
  /** id del servicio de Zektra que resolvió el caso (enlaza a /servicios/<id>/). */
  service: string;
};

export const CASES: Case[] = [
  {
    id: 'plataforma-contrapartes',
    industry: 'Grupo empresarial · Cumplimiento',
    title: 'Plataforma de gestión de contrapartes',
    challenge:
      'Un grupo empresarial necesitaba unificar cómo sus compañías registran, validan y aprueban proveedores y otras contrapartes, con reglas de cumplimiento distintas y varios actores en el proceso.',
    solution:
      'Lideramos el Sprint Zero de experiencia: plan de acción, flujos de usuario, arquitectura de información, journeys de contratación, licitación y legalización, y un prototipo de alta fidelidad navegable para validar con usuarios clave.',
    deliverables: ['Flujos de usuario navegables', 'Arquitectura de información', 'Prototipo Hi-Fi', 'Plan de validación de usabilidad'],
    tags: ['UX', 'Prototipo Hi-Fi', 'Figma Make'],
    accent: 'violeta',
    service: 'ux-ui',
  },
  {
    id: 'migracion-inmobiliaria',
    industry: 'Sector inmobiliario',
    title: 'Migración de sitio y blog a una nueva plataforma',
    challenge:
      'Una empresa del sector inmobiliario iba a migrar su sitio a una nueva plataforma .NET sin perder el posicionamiento orgánico construido durante años.',
    solution:
      'Hicimos auditorías de SEO y rendimiento para fijar una línea base, planeamos la migración, trasladamos el blog desde WordPress y diseñamos una landing para inversionistas sobre la plataforma nueva.',
    deliverables: ['Auditoría SEO y de rendimiento', 'Migración del blog', 'Landing de inversionistas', 'Plan de redirecciones'],
    tags: ['SEO', 'Oqtane', 'Migración'],
    accent: 'menta',
    service: 'seo-rendimiento',
  },
  {
    id: 'experiencias-administrables',
    industry: 'Bienestar y experiencias',
    title: 'Sección interactiva administrable',
    challenge:
      'Una marca de experiencias tenía una sección interactiva diseñada en Figma que su equipo debía poder actualizar sin tocar código.',
    solution:
      'Llevamos el diseño a WordPress con Elementor como una sección dinámica: interacción fiel al diseño y contenidos que el equipo edita desde el panel.',
    deliverables: ['Maquetación desde Figma', 'Componente interactivo', 'Contenido administrable'],
    tags: ['WordPress', 'Elementor', 'Interacción'],
    accent: 'magenta',
    service: 'cms',
  },
  {
    id: 'demo-restringido',
    industry: 'Tecnología · Logística',
    title: 'Entorno de demo con acceso restringido',
    challenge:
      'Una empresa de tecnología necesitaba mostrar su aplicación a clientes potenciales antes de tener lista su infraestructura definitiva en la nube.',
    solution:
      'Desplegamos el frontend en un entorno propio con acceso restringido para demos, como puente controlado mientras se preparaba el despliegue en AWS.',
    deliverables: ['Despliegue del frontend', 'Acceso restringido', 'Ruta hacia AWS'],
    tags: ['Despliegue', 'Hosting', 'Seguridad'],
    accent: 'ambar',
    service: 'despliegue',
  },
];

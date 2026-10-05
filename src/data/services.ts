export type Service = {
  id: string;
  icon: 'code' | 'layout' | 'gauge' | 'sparkles' | 'blocks' | 'cloud' | 'zap' | 'palette' | 'trending' | 'pen';
  title: string;
  summary: string;
  description: string;
  deliverables: string[];
  stack: string[];
};

export const SERVICES: Service[] = [
  {
    id: 'software-a-la-medida',
    icon: 'code',
    title: 'Software a la medida',
    summary: 'Desarrollamos software a la medida de tus necesidades: aplicaciones, plataformas, sistemas internos y sitios.',
    description:
      'No adaptamos tu negocio a una herramienta genérica: construimos la herramienta que tu negocio necesita. Analizamos tus procesos, diseñamos la solución y la desarrollamos desde cero o sobre lo que ya tienes, con código limpio, escalable y fácil de mantener.',
    deliverables: ['Aplicaciones y plataformas web', 'Sistemas internos y paneles de gestión', 'Automatización de procesos', 'Integraciones con APIs y servicios externos', 'Sitios corporativos y landing pages'],
    stack: ['Astro', 'React', 'TypeScript', '.NET', 'PHP'],
  },
  {
    id: 'ux-ui',
    icon: 'layout',
    title: 'Diseño UX/UI y prototipos',
    summary: 'Flujos, arquitectura de información y prototipos de alta fidelidad que se validan antes de construir.',
    description:
      'Entendemos el proceso real de tus usuarios y lo convertimos en pantallas claras. Entregamos flujos navegables, inventario de pantallas, estados y un prototipo que se puede probar con personas reales.',
    deliverables: ['Flujos de usuario y journeys', 'Arquitectura de información', 'Prototipos Hi-Fi navegables', 'Pruebas de usabilidad'],
    stack: ['Figma', 'Figma Make', 'FigJam'],
  },
  {
    id: 'automatizaciones',
    icon: 'zap',
    title: 'Automatizaciones e IA',
    summary: 'Procesos que se hacen solos: flujos automáticos, integraciones y chatbots que ahorran tiempo y errores.',
    description:
      'Identificamos las tareas repetitivas de tu operación y las automatizamos: conectamos tus herramientas, movemos datos entre sistemas y sumamos asistentes con inteligencia artificial donde de verdad aportan.',
    deliverables: ['Flujos de trabajo automatizados', 'Integración entre herramientas', 'Chatbots y asistentes con IA', 'Optimización de procesos'],
    stack: ['APIs', 'Webhooks', 'IA generativa'],
  },
  {
    id: 'seo-rendimiento',
    icon: 'gauge',
    title: 'SEO técnico y rendimiento',
    summary: 'Auditorías, migraciones sin perder posicionamiento y sitios que cargan en segundos.',
    description:
      'Medimos antes de tocar. Levantamos una línea base de SEO y rendimiento, planeamos redirecciones y migramos sin que tu tráfico orgánico pague el cambio.',
    deliverables: ['Auditoría de SEO y Core Web Vitals', 'Plan de migración y redirecciones', 'Optimización de carga e imágenes', 'Seguimiento posterior al lanzamiento'],
    stack: ['Search Console', 'Lighthouse', 'PageSpeed', 'Screaming Frog'],
  },
  {
    id: 'marketing-digital',
    icon: 'trending',
    title: 'Marketing digital',
    summary: 'Estrategias digitales que impulsan tu presencia en línea y generan resultados medibles.',
    description:
      'Conectamos tu producto digital con las personas correctas. Planeamos campañas y contenidos alineados con tu marca y medimos lo que funciona para invertir mejor cada mes.',
    deliverables: ['Campañas en redes sociales', 'Email marketing', 'Contenido estratégico', 'Análisis de métricas'],
    stack: ['Redes sociales', 'Email', 'Analítica web'],
  },
  {
    id: 'branding',
    icon: 'palette',
    title: 'Branding e identidad',
    summary: 'Identidades de marca únicas y memorables que conectan con tu audiencia.',
    description:
      'Construimos la marca desde su idea central hasta un sistema visual completo: logotipo, paleta, tipografía y un manual para que se aplique igual en cada pieza, digital o impresa.',
    deliverables: ['Estrategia de marca', 'Diseño de logotipo', 'Identidad visual completa', 'Manual de marca y design system'],
    stack: ['Illustrator', 'Figma', 'Photoshop'],
  },
  {
    id: 'diseno-grafico',
    icon: 'pen',
    title: 'Diseño gráfico',
    summary: 'Piezas profesionales que comunican tu mensaje de forma clara y atractiva.',
    description:
      'Diseñamos las piezas del día a día de tu marca con el mismo cuidado que un sitio: publicidad, material corporativo, presentaciones y contenido para redes.',
    deliverables: ['Diseño publicitario', 'Material corporativo y papelería', 'Infografías y presentaciones', 'Diseño para redes sociales'],
    stack: ['Illustrator', 'Photoshop', 'Figma', 'InDesign'],
  },
  {
    id: 'experiencias-interactivas',
    icon: 'sparkles',
    title: 'Experiencias interactivas',
    summary: 'Animación, 3D y piezas rich media que hacen que tu marca se recuerde.',
    description:
      'Cuando una página estática no alcanza: escenas 3D, animaciones ligadas al scroll y piezas publicitarias interactivas, siempre cuidando que carguen rápido y funcionen en móvil.',
    deliverables: ['Escenas 3D para la web', 'Animación con scroll', 'Banners y piezas rich media en HTML5', 'Microinteracciones'],
    stack: ['three.js', 'GSAP', 'WebGL', 'HTML5'],
  },
  {
    id: 'cms',
    icon: 'blocks',
    title: 'CMS y sitios administrables',
    summary: 'WordPress, Elementor y Oqtane configurados para que tu equipo publique sin miedo.',
    description:
      'Diseñamos secciones y módulos a la medida dentro del CMS que ya usas, con campos claros y límites que evitan que una edición rompa el diseño.',
    deliverables: ['Temas y módulos a la medida', 'Blogs y migración de contenidos', 'Secciones dinámicas administrables', 'Capacitación al equipo'],
    stack: ['WordPress', 'Elementor', 'Oqtane'],
  },
  {
    id: 'despliegue',
    icon: 'cloud',
    title: 'Despliegue y acompañamiento',
    summary: 'Publicamos, protegemos y seguimos cuidando tu producto después del lanzamiento.',
    description:
      'Configuramos hosting, dominios, certificados y entornos de prueba con acceso restringido. Y nos quedamos: soporte, mejoras y evolución continua.',
    deliverables: ['Hosting, dominio y SSL', 'Entornos de demo y pruebas', 'Versionamiento y despliegue continuo', 'Soporte y mejoras'],
    stack: ['Vercel', 'Hostinger', 'AWS', 'GitHub'],
  },
];

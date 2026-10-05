export type Service = {
  id: string;
  icon: 'code' | 'layout' | 'gauge' | 'sparkles' | 'blocks' | 'cloud';
  title: string;
  summary: string;
  description: string;
  deliverables: string[];
  stack: string[];
};

export const SERVICES: Service[] = [
  {
    id: 'desarrollo-web',
    icon: 'code',
    title: 'Desarrollo web a la medida',
    summary: 'Sitios y plataformas rápidos, administrables y listos para crecer con tu negocio.',
    description:
      'Construimos desde cero o sobre lo que ya tienes. Código limpio, componentes reutilizables y un panel que tu equipo puede usar sin depender de nosotros para cada cambio.',
    deliverables: ['Sitios corporativos y landing pages', 'Plataformas y aplicaciones web', 'Integraciones con APIs y servicios externos', 'Paneles administrables'],
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

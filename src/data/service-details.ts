/* Contenido ampliado de cada página de servicio (/servicios/<id>/).
   Reglas: tuteo, Zektra en primera plural, beneficio antes que tecnología.
   Sin cifras, precios, plazos ni clientes inventados: si se agregan, que sean reales. */

export type ServiceDetail = {
  /** Párrafo de apertura: el problema que resuelve, en palabras del cliente. */
  intro: string;
  /** Señales de que lo necesitas (4–5). */
  needs: string[];
  /** Cómo lo trabajamos: 4 pasos propios de este servicio. */
  approach: { title: string; text: string }[];
  /** Qué te queda al final del proyecto. */
  outcome: string;
};

export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  'software-a-la-medida': {
    intro:
      'Llega un punto en que las hojas de cálculo, los correos y las herramientas genéricas ya no alcanzan: la información vive en muchos lugares, los procesos dependen de que alguien se acuerde y cada nuevo cliente suma trabajo manual. El software a la medida ordena eso en una sola herramienta pensada para cómo trabaja tu negocio, no al revés.',
    needs: [
      'Tu operación depende de hojas de cálculo que crecen, se duplican y nadie se atreve a tocar.',
      'Pagas varias herramientas que no se hablan entre sí y alguien copia datos de una a otra.',
      'Tienes un proceso propio que ningún software del mercado resuelve bien.',
      'Quieres ofrecer a tus clientes un portal, una plataforma o una app con tu marca.',
      'Tu sistema actual quedó corto y cada cambio es lento, caro o riesgoso.',
    ],
    approach: [
      { title: 'Entendemos el proceso', text: 'Conversamos con quienes usan el proceso todos los días y lo dibujamos tal como funciona hoy, con sus atajos y sus cuellos de botella.' },
      { title: 'Definimos el alcance', text: 'Priorizamos qué resuelve más con menos. Empezamos por una primera versión útil en lugar de intentar construirlo todo de una vez.' },
      { title: 'Diseñamos y validamos', text: 'Un prototipo navegable te deja probar la solución antes de escribir código, que es el momento más barato para cambiar de idea.' },
      { title: 'Construimos por entregas', text: 'Desarrollamos en ciclos cortos sobre un entorno de pruebas donde ves y opinas cada avance, hasta salir a producción.' },
    ],
    outcome:
      'Una aplicación en producción, con su código versionado en tu repositorio, documentación para tu equipo y una ruta clara de lo que sigue. El software es tuyo: no quedas atado a nosotros para cada cambio.',
  },

  'ux-ui': {
    intro:
      'Un producto puede funcionar perfecto y aun así fracasar si la gente no entiende cómo usarlo. El diseño UX/UI define qué ve cada persona, en qué orden y qué hace después, para que la herramienta se sienta obvia. Y lo hace antes de construir, cuando corregir todavía cuesta poco.',
    needs: [
      'Vas a construir una plataforma o una app y quieres validar la idea antes de invertir en desarrollo.',
      'Tus usuarios se pierden, llaman a soporte o abandonan a mitad de un proceso.',
      'Tienes un proceso complejo, con varios roles y aprobaciones, que hay que volver claro.',
      'Necesitas alinear a negocio, tecnología y usuarios alrededor de algo concreto que se pueda ver.',
    ],
    approach: [
      { title: 'Investigamos', text: 'Entrevistamos a usuarios y responsables del proceso, revisamos lo que existe y levantamos qué tiene que lograr cada persona.' },
      { title: 'Ordenamos la información', text: 'Definimos la arquitectura de información y los flujos de usuario: qué pantallas existen, cómo se conectan y qué pasa en cada caso.' },
      { title: 'Prototipamos en alta fidelidad', text: 'Diseñamos las pantallas con su contenido y estados reales, y las conectamos en un prototipo navegable.' },
      { title: 'Validamos con personas', text: 'Probamos el prototipo con usuarios reales cuando hace falta y ajustamos antes de pasar a desarrollo.' },
    ],
    outcome:
      'Un prototipo navegable listo para mostrar y probar, los flujos documentados, el inventario de pantallas y sus estados, y un archivo de diseño ordenado que el equipo de desarrollo puede construir sin adivinar.',
  },

  automatizaciones: {
    intro:
      'Muchas horas del equipo se van en tareas que no requieren criterio: copiar datos de un sistema a otro, enviar el mismo correo, armar el mismo reporte cada semana. Automatizarlas libera tiempo para lo que sí lo requiere y reduce los errores de digitación. Y cuando aporta de verdad, sumamos inteligencia artificial.',
    needs: [
      'Alguien de tu equipo pasa horas cada semana moviendo información entre herramientas.',
      'Los mismos datos se digitan dos o tres veces en sistemas distintos.',
      'Tus clientes preguntan lo mismo una y otra vez por chat o por correo.',
      'Los reportes se arman a mano y llegan tarde.',
      'Quieres usar IA en tu operación pero no sabes por dónde empezar con sentido.',
    ],
    approach: [
      { title: 'Mapeamos las tareas', text: 'Identificamos qué se repite, cuánto tiempo toma y dónde se cometen errores, para empezar por lo que más impacto tiene.' },
      { title: 'Elegimos la herramienta justa', text: 'A veces basta con conectar lo que ya usas; otras conviene una integración propia o un asistente con IA. Decidimos por el caso, no por la moda.' },
      { title: 'Construimos y probamos', text: 'Montamos el flujo con datos de prueba, revisamos los casos raros y definimos qué pasa cuando algo falla.' },
      { title: 'Medimos y ajustamos', text: 'Ya en uso, revisamos que el flujo haga lo que debe y lo ajustamos con lo que va pasando en la operación real.' },
    ],
    outcome:
      'Flujos automáticos funcionando sobre tus herramientas, documentados para que tu equipo sepa qué hacen, con alertas cuando algo falla y la posibilidad de ampliarlos a medida que crece tu operación.',
  },

  'seo-rendimiento': {
    intro:
      'De nada sirve un buen sitio si nadie lo encuentra o si tarda tanto en cargar que la gente se va antes de verlo. El SEO técnico se asegura de que Google pueda rastrear, entender e indexar tu sitio, y el trabajo de rendimiento hace que cargue rápido, sobre todo en el celular. Es la base sobre la que funciona todo el contenido y la pauta.',
    needs: [
      'Tu sitio no aparece en Google cuando buscas lo que vendes.',
      'Vas a rediseñar o cambiar de plataforma y no quieres perder el tráfico que ya tienes.',
      'El sitio se siente lento, especialmente en el celular.',
      'Search Console muestra errores, páginas excluidas o problemas de Core Web Vitals.',
      'Inviertes en contenido o en pauta y no sabes si el sitio está ayudando o estorbando.',
    ],
    approach: [
      { title: 'Medimos la línea base', text: 'Levantamos el estado actual con Search Console, Lighthouse y un rastreo completo del sitio. Sin esa foto no hay cómo saber si mejoramos.' },
      { title: 'Priorizamos los hallazgos', text: 'Ordenamos los problemas por impacto y esfuerzo para atacar primero lo que más mueve: indexación, estructura, velocidad.' },
      { title: 'Corregimos', text: 'Implementamos los cambios técnicos o acompañamos a tu equipo a hacerlos: redirecciones, metadatos, datos estructurados, imágenes, carga de scripts.' },
      { title: 'Hacemos seguimiento', text: 'Comparamos contra la línea base durante las semanas siguientes y ajustamos lo que no se comporte como esperábamos.' },
    ],
    outcome:
      'Un informe claro de lo que encontramos y lo que cambiamos, un sitio que Google puede indexar sin tropiezos y que carga rápido, y los datos para decidir los siguientes pasos de contenido.',
  },

  'marketing-digital': {
    intro:
      'Tener presencia en redes y en internet no es lo mismo que tener una estrategia. El marketing digital conecta tu marca con las personas que pueden comprarte, con un mensaje coherente en cada canal y con métricas que muestran qué funciona y qué no, para invertir mejor cada mes.',
    needs: [
      'Publicas en redes sin un plan y no ves resultados claros.',
      'Inviertes en pauta pero no sabes qué parte del presupuesto está funcionando.',
      'Tienes una base de clientes o contactos y no les escribes de forma constante.',
      'Vas a lanzar un producto o servicio y necesitas darlo a conocer.',
    ],
    approach: [
      { title: 'Definimos objetivos y público', text: 'Aclaramos qué quieres lograr, a quién le hablas y en qué canales está esa persona.' },
      { title: 'Planeamos el contenido', text: 'Armamos un calendario con mensajes alineados a tu marca y a cada etapa de decisión de tu cliente.' },
      { title: 'Ejecutamos las campañas', text: 'Producimos las piezas, publicamos, segmentamos la pauta y montamos los correos.' },
      { title: 'Medimos y optimizamos', text: 'Revisamos las métricas con frecuencia y movemos el presupuesto hacia lo que trae resultados.' },
    ],
    outcome:
      'Un plan de marketing con objetivos claros, campañas en marcha, piezas alineadas a tu marca y reportes que explican en lenguaje sencillo qué pasó y qué vamos a hacer después.',
  },

  branding: {
    intro:
      'La marca es lo que la gente recuerda de tu empresa cuando no estás presente. Un buen branding empieza por la idea que te hace distinto y la traduce en un sistema visual completo, para que cada pieza, del sitio web a una tarjeta, se vea y suene como la misma empresa.',
    needs: [
      'Estás creando una empresa o un producto nuevo y necesitas una identidad desde cero.',
      'Tu marca actual ya no representa lo que eres hoy.',
      'Cada pieza de tu marca se ve distinta según quién la haga.',
      'Necesitas un manual para que proveedores y equipo apliquen la marca igual.',
    ],
    approach: [
      { title: 'Construimos la estrategia', text: 'Definimos propósito, personalidad, público y lo que te diferencia de la competencia. Es la base de cada decisión visual.' },
      { title: 'Exploramos conceptos', text: 'Proponemos rutas visuales distintas para el logotipo y el sistema, y las afinamos contigo.' },
      { title: 'Armamos el sistema', text: 'Desarrollamos logotipo y sus versiones, paleta de color, tipografías, iconografía y aplicaciones clave.' },
      { title: 'Documentamos', text: 'Reunimos todo en un manual de marca y, cuando hace falta, en un design system listo para productos digitales.' },
    ],
    outcome:
      'Tu logotipo en todas sus versiones y formatos, una identidad visual completa, el manual de marca para aplicarla con consistencia y los archivos fuente organizados para que puedas usarlos siempre.',
  },

  'diseno-grafico': {
    intro:
      'La marca vive en el día a día: en la publicación de esta semana, la presentación para un cliente, la pieza para una feria. El diseño gráfico mantiene esa calidad en cada pieza, para que comunique tu mensaje con claridad y se reconozca como tuya.',
    needs: [
      'Necesitas piezas para redes, campañas o eventos con una calidad constante.',
      'Tus presentaciones comerciales no están a la altura de lo que ofreces.',
      'Tienes información compleja que debería entenderse de un vistazo.',
      'Necesitas papelería o material corporativo coherente con tu marca.',
    ],
    approach: [
      { title: 'Entendemos el mensaje', text: 'Aclaramos qué tiene que comunicar la pieza, a quién y en qué medio se va a ver.' },
      { title: 'Diseñamos con la marca', text: 'Aplicamos tu identidad visual para que cada pieza sume al reconocimiento de la marca.' },
      { title: 'Revisamos contigo', text: 'Ajustamos la propuesta con tus comentarios hasta que quede lista.' },
      { title: 'Entregamos listo para usar', text: 'Preparamos los archivos en los formatos que necesita cada medio: digital, impreso o redes.' },
    ],
    outcome:
      'Piezas terminadas en los formatos que necesitas, consistentes con tu marca, y los archivos editables para que puedas reutilizarlas.',
  },

  'experiencias-interactivas': {
    intro:
      'Hay mensajes que se recuerdan mejor cuando se pueden explorar. Escenas 3D, animaciones que responden al scroll o piezas publicitarias interactivas hacen que tu marca se sienta distinta. Las hacemos cuidando que carguen rápido y funcionen bien en el celular, porque una experiencia que no carga no impresiona a nadie.',
    needs: [
      'Vas a lanzar un producto y quieres una página que se recuerde.',
      'Tu marca necesita mostrar algo que una imagen estática no alcanza a explicar.',
      'Quieres piezas publicitarias más llamativas que un banner tradicional.',
      'Tu sitio se ve igual al de la competencia y quieres diferenciarte.',
    ],
    approach: [
      { title: 'Definimos la idea', text: 'Decidimos qué tiene que sentir y entender la persona, y qué interacción lo comunica mejor.' },
      { title: 'Prototipamos el movimiento', text: 'Probamos animaciones y escenas antes de producirlas completas para validar que funcionen.' },
      { title: 'Producimos y optimizamos', text: 'Construimos la experiencia con three.js, GSAP o HTML5, cuidando el peso y la carga diferida.' },
      { title: 'Probamos en dispositivos reales', text: 'Revisamos en celulares y navegadores distintos, y respetamos a quienes prefieren menos movimiento.' },
    ],
    outcome:
      'Una experiencia interactiva publicada en tu sitio o lista para tus campañas, liviana, accesible y con el código entregado para que puedas mantenerla.',
  },

  cms: {
    intro:
      'Tu equipo tiene que poder actualizar el sitio sin llamar a un desarrollador para cada cambio, y sin miedo a romper el diseño. Configuramos WordPress, Elementor u Oqtane con secciones a la medida, campos claros y límites sensatos, para que publicar sea fácil y el sitio se mantenga ordenado.',
    needs: [
      'Cada cambio pequeño en tu sitio depende de un proveedor.',
      'Tu equipo edita el sitio y termina descuadrando el diseño.',
      'Tienes un diseño en Figma que debe convertirse en secciones administrables.',
      'Vas a migrar tu blog o tus contenidos a otra plataforma.',
    ],
    approach: [
      { title: 'Revisamos qué se edita', text: 'Identificamos qué contenidos cambian y quién los cambia, para diseñar la administración alrededor de eso.' },
      { title: 'Construimos los módulos', text: 'Desarrollamos secciones y módulos a la medida dentro del CMS, fieles al diseño.' },
      { title: 'Ponemos límites claros', text: 'Campos con su ayuda, opciones cerradas donde conviene y validaciones que evitan errores.' },
      { title: 'Capacitamos al equipo', text: 'Enseñamos a tu equipo a publicar y dejamos una guía para consultar después.' },
    ],
    outcome:
      'Un sitio que tu equipo actualiza con confianza, módulos a la medida dentro del CMS que ya usas, contenidos migrados cuando aplica y una guía de uso.',
  },

  despliegue: {
    intro:
      'Publicar un sitio o una aplicación es solo el comienzo. Hace falta un hosting confiable, dominio y certificado en orden, entornos de prueba para revisar cambios sin riesgo y alguien pendiente después del lanzamiento. Nos encargamos de esa parte para que tu producto siga funcionando y mejorando.',
    needs: [
      'Tienes un sitio o una app lista y no sabes dónde ni cómo publicarla.',
      'Necesitas mostrar tu producto a clientes en un entorno de demo con acceso restringido.',
      'Los cambios se suben directo a producción y cada actualización es un riesgo.',
      'Nadie está pendiente de tu sitio después del lanzamiento.',
    ],
    approach: [
      { title: 'Elegimos la infraestructura', text: 'Recomendamos el hosting que se ajusta a tu proyecto: Vercel, Hostinger o AWS, según lo que necesites.' },
      { title: 'Configuramos todo', text: 'Dominio, DNS, certificado SSL, correo cuando aplica y entornos separados de pruebas y producción.' },
      { title: 'Automatizamos el despliegue', text: 'Conectamos el repositorio para que cada cambio aprobado se publique de forma controlada.' },
      { title: 'Acompañamos', text: 'Después del lanzamiento damos soporte, aplicamos mejoras y te avisamos de lo que conviene actualizar.' },
    ],
    outcome:
      'Tu producto publicado en una infraestructura estable, con su dominio y certificado, entornos de prueba, despliegue automatizado y un equipo que sigue pendiente.',
  },
};

export const SITE = {
  name: 'Zektra',
  tagline: 'Soluciones Digitales',
  promise: 'Transformamos ideas en soluciones digitales',
  description:
    'Desarrollo de software a la medida en Medellín, Colombia: aplicaciones, plataformas y sitios web. Estrategia, diseño UX/UI y desarrollo con calidad humana.',
  url: 'https://zektra.co',
  email: 'comunicaciones@zektra.co',
  city: 'Medellín, Colombia',
  locale: 'es_CO',
  /** Perfiles oficiales (Google Business Profile, LinkedIn, Instagram…). Agrégalos aquí cuando existan:
      alimentan el JSON-LD sameAs y ayudan a Google a confirmar que la marca es una sola entidad. */
  sameAs: [] as string[],
};

export const NAV = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios/', label: 'Servicios' },
  { href: '/casos/', label: 'Casos' },
  { href: '/nosotros/', label: 'Nosotros' },
  { href: '/blog/', label: 'Blog' },
];

/** Responsable del tratamiento de datos y titular del sitio, para las páginas legales.
    La Ley 1581 de 2012 y el Decreto 1377 de 2013 exigen identificar al responsable con nombre o razón social,
    documento, domicilio, dirección, correo y teléfono. Completa los campos vacíos: los que estén vacíos no se muestran. */
export const LEGAL = {
  /** Razón social (si hay empresa constituida) o nombre de la persona natural titular de la marca. */
  holder: 'Zektra Soluciones Digitales',
  /** Tipo y número de documento, p. ej. 'NIT 901.234.567-8' o 'C.C. 1.234.567.890'. */
  document: '',
  address: '',
  phone: '',
  email: SITE.email,
  domicile: 'Medellín, Antioquia, Colombia',
  /** Fecha de entrada en vigencia de la versión actual de las políticas (AAAA-MM-DD). */
  updated: new Date('2026-10-07'),
};

export const LEGAL_NAV = [
  { href: '/legal/privacidad/', label: 'Tratamiento de datos personales' },
  { href: '/legal/terminos/', label: 'Términos y condiciones' },
  { href: '/legal/cookies/', label: 'Política de cookies' },
];

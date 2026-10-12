/* Carga perezosa de las escenas three.js de cada hero.
   - Nunca se cargan en móvil (≤ 860px), con "ahorro de datos", en redes 2G/3G ni en
     equipos con ≤ 4 GB de memoria: ahí el hero se queda con el resplandor CSS (.hero__backdrop).
   - En escritorio three.js (~145 KB gzip) se descarga después de `load` y en un momento
     de inactividad del hilo principal, para no competir con el LCP ni con el INP.
   - Pausa el render cuando la escena sale de pantalla o la pestaña se oculta.
   - Con prefers-reduced-motion dibuja un único cuadro estático. */
import type { SceneController, SceneFactory } from './types';

const factories: Record<string, () => Promise<{ default: SceneFactory }>> = {
  flow: () => import('./flow'),
  network: () => import('./network'),
  monogram: () => import('./monogram'),
  world: () => import('./world'),
};

/** WebGL disponible y acelerado por hardware. Con SwiftShader/llvmpipe (sin GPU) three.js
    renderiza por CPU y cada frame bloquea el hilo principal: mejor dejar el hero en CSS. */
function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software|mesa offscreen|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

type NavigatorHints = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
  deviceMemory?: number;
};

/** Decide si el equipo y la red justifican descargar three.js. */
function allowScenes() {
  if (window.matchMedia('(max-width: 860px)').matches) return false;
  const nav = navigator as NavigatorHints;
  if (nav.connection?.saveData) return false;
  if (/(^|-)(slow-)?(2g|3g)$/.test(nav.connection?.effectiveType ?? '')) return false;
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4) return false;
  return supportsWebGL();
}

/** Ejecuta `cb` después de `load` y cuando el hilo principal esté libre. */
function whenIdle(cb: () => void) {
  const run = () => {
    const w = window as Window & { requestIdleCallback?: (fn: () => void, opts?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(cb, { timeout: 2500 });
    else setTimeout(cb, 400);
  };
  if (document.readyState === 'complete') run();
  else window.addEventListener('load', run, { once: true });
}

export function initScenes({ reduced }: { reduced: boolean }) {
  const hosts = document.querySelectorAll<HTMLElement>('[data-scene]');
  if (!hosts.length || !allowScenes()) {
    document.documentElement.classList.add('no-scenes');
    return;
  }
  whenIdle(() => mountScenes(hosts, reduced));
}

function mountScenes(hosts: NodeListOf<HTMLElement>, reduced: boolean) {
  hosts.forEach((host) => {
    const name = host.dataset.scene ?? '';
    const load = factories[name];
    if (!load) return;

    let controller: SceneController | null = null;
    let visible = false;

    const io = new IntersectionObserver(
      async (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
        if (visible && !controller) {
          const mod = await load();
          controller = mod.default(host, { reduced });
          host.classList.add('is-loaded');
        }
        if (!controller) return;
        if (visible && !reduced && !document.hidden) controller.start();
        else controller.stop();
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(host);

    document.addEventListener('visibilitychange', () => {
      if (!controller || reduced) return;
      document.hidden || !visible ? controller.stop() : controller.start();
    });

    if (!reduced) {
      const section = host.closest<HTMLElement>('[data-hero]') ?? host;
      const onScroll = () => {
        if (!controller) return;
        const r = section.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
        controller.setProgress(p);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  });
}

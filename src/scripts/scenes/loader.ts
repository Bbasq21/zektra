/* Carga perezosa de las escenas three.js de cada hero.
   - Solo descarga three.js cuando el contenedor está cerca del viewport.
   - Pausa el render cuando la escena sale de pantalla o la pestaña se oculta.
   - Con prefers-reduced-motion dibuja un único cuadro estático. */
import type { SceneController, SceneFactory } from './types';

const factories: Record<string, () => Promise<{ default: SceneFactory }>> = {
  flow: () => import('./flow'),
  network: () => import('./network'),
  monogram: () => import('./monogram'),
};

function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export function initScenes({ reduced }: { reduced: boolean }) {
  const hosts = document.querySelectorAll<HTMLElement>('[data-scene]');
  if (!hosts.length || !supportsWebGL()) return;

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

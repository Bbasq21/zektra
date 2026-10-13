/* «Cómo trabajamos» en video: el scroll mueve el tiempo de seis videos pre-renderizados.

   La sección es una pista alta con capas fijas (sticky) encima: el escenario con los videos,
   las tarjetas y el riel. El modo lo decide un script inline en el <head> antes del primer
   pintado (html.pv-live, y html.pv-still cuando solo van pósteres), y la altura de la pista
   la reserva el CSS: este script no mueve el layout, solo lee el scroll y escribe opacidad,
   transform y currentTime.

   Rendimiento:
   - Ningún video se descarga en la carga inicial: el primero se pide después de `load`, en
     un momento libre del hilo principal y solo cuando la persona ya hizo scroll o tocó la
     página. Mientras tanto se ve el póster.
   - Solo se cargan la escena actual y la siguiente. En celulares se liberan (revokeObjectURL
     y fuera el <video>) las que quedan a más de dos pasos.
   - El bucle de requestAnimationFrame se detiene cuando la sección sale de pantalla o cuando
     no hay scroll ni búsqueda pendiente, y se reactiva con el siguiente scroll.
   - getBoundingClientRect solo en layout(); cada cuadro solo escribe opacity y transform.

   Detalles de video (adaptados del motor de scroll-world):
   - Cada video se descarga como Blob y se reproduce desde una URL en memoria: así siempre
     se puede buscar cualquier cuadro, aunque el servidor no soporte rangos de bytes.
   - Nunca se pide un cuadro nuevo mientras el anterior se está decodificando; en celulares
     un scroll rápido apilaría búsquedas y congelaría el video.
   - El póster se queda visible hasta que el video pinta su primer cuadro (iOS no pinta un
     video silenciado que nunca se reprodujo) y en el primer toque se «ceba» cada video. */
/** Usa Lenis (app.ts) si ya cargó; si no, el scroll nativo. app.ts no se importa aquí para
    que GSAP y Lenis lleguen después de load y no compitan con el primer pintado. */
function scrollToY(y: number, immediate = false) {
  const zk = (window as Window & { zkScrollTo?: (y: number, immediate?: boolean) => void }).zkScrollTo;
  if (zk) zk(y, immediate);
  else window.scrollTo({ top: y, behavior: immediate || document.documentElement.classList.contains('pv-reduce') ? 'auto' : 'smooth' });
}

interface Scene {
  el: HTMLElement;
  card: HTMLElement;
  clip?: string;
  clipMobile?: string;
  w: number;
  /** 0–1: dónde el texto de la escena queda del todo visible. */
  focus: number;
  start: number;
  end: number;
  video: HTMLVideoElement | null;
  url: string | null;
  ctrl: AbortController | null;
  ready: boolean;
  cur: number;
  target: number;
  visible: boolean;
  op: string;
  z: string;
  cardOp: string;
  cardActive: boolean | null;
}

type NavigatorHints = Navigator & { connection?: { downlink?: number } };
type IdleWindow = Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (x: number) => {
  x = clamp(x);
  return x * x * (3 - 2 * x);
};

export function initProcesoVideo() {
  const html = document.documentElement;
  const found = document.querySelector<HTMLElement>('[data-reel]');
  if (!found || !html.classList.contains('pv-live')) return;
  const root: HTMLElement = found;
  const stage = root.querySelector<HTMLElement>('[data-reel-stage]')!;
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-reel-card]'));
  const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-reel-link]'));
  const hint = root.querySelector<HTMLElement>('[data-reel-hint]');
  const crossfade = Number(root.dataset.crossfade) || 0.04;

  const still = html.classList.contains('pv-still');
  const reduce = html.classList.contains('pv-reduce');
  const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const small = window.matchMedia('(max-width: 860px)');
  const isMobile = () => coarse || small.matches;
  const downlink = (navigator as NavigatorHints).connection?.downlink;
  // Celulares y conexiones lentas (< 5 Mb/s) usan la versión de 960×540.
  const useLight = () => isMobile() || (typeof downlink === 'number' && downlink < 5);

  const scenes: Scene[] = Array.from(root.querySelectorAll<HTMLElement>('[data-reel-seg]')).map((el, i) => ({
    el,
    card: cards[i],
    clip: el.dataset.clip || undefined,
    clipMobile: el.dataset.clipMobile || undefined,
    w: Number(el.dataset.w) || 2,
    focus: clamp(Number(el.dataset.focus ?? 0.5)),
    start: 0,
    end: 0,
    video: null,
    url: null,
    ctrl: null,
    ready: false,
    cur: 0,
    target: 0,
    visible: i === 0,
    op: i === 0 ? '1' : '0',
    z: '',
    cardOp: i === 0 ? '1' : '0',
    cardActive: null,
  }));
  const n = scenes.length;
  if (!n || cards.length !== n) return;

  html.classList.add('pv-ready');

  let vh = stage.offsetHeight || window.innerHeight;
  let laidOutW = window.innerWidth;
  let top = 0;
  let active = 0;
  let current = 0;
  let hintOp = '1';

  function layout() {
    vh = stage.offsetHeight || window.innerHeight;
    laidOutW = window.innerWidth;
    let off = 0;
    scenes.forEach((s) => {
      s.start = off * vh;
      off += s.w;
      s.end = off * vh;
    });
    top = root.getBoundingClientRect().top + window.scrollY;
    read();
  }

  /* ------------------------------------------------------------- videos */
  let allowVideo = false;
  let userReady = false;
  let interacted = false;

  function prime(v: HTMLVideoElement | null) {
    if (!v || !isMobile()) return;
    const p = v.play();
    if (p) p.then(() => v.pause()).catch(() => {});
  }

  function markPainted(s: Scene, v: HTMLVideoElement) {
    const show = () => {
      if (s.video === v) s.el.classList.add('has-clip');
    };
    const rvfc = (v as HTMLVideoElement & { requestVideoFrameCallback?: (cb: () => void) => number }).requestVideoFrameCallback;
    if (rvfc) rvfc.call(v, show);
    else show();
  }

  function load(s: Scene) {
    if (!allowVideo || s.video || s.ctrl || !s.clip) return;
    const url = useLight() && s.clipMobile ? s.clipMobile : s.clip;
    const ctrl = new AbortController();
    s.ctrl = ctrl;
    fetch(url, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
      .then((blob) => {
        if (s.ctrl !== ctrl) return;
        s.ctrl = null;
        const v = document.createElement('video');
        v.className = 'reel__video';
        v.muted = true;
        v.playsInline = true;
        v.preload = 'auto';
        v.setAttribute('muted', '');
        v.setAttribute('playsinline', '');
        v.setAttribute('aria-hidden', 'true');
        v.setAttribute('tabindex', '-1');
        s.url = URL.createObjectURL(blob);
        v.src = s.url;
        v.addEventListener('loadeddata', () => {
          v.pause();
          s.ready = true;
          s.cur = s.target;
          // Una primera búsqueda obliga a decodificar y pintar el cuadro que toca.
          v.currentTime = Math.max(0.001, clamp(s.cur, 0, 0.999) * (v.duration || 0));
          if (userReady) prime(v);
          wake();
        }, { once: true });
        v.addEventListener('seeked', () => markPainted(s, v), { once: true });
        v.addEventListener('seeked', wake);
        s.el.appendChild(v);
        s.video = v;
      })
      .catch(() => {
        if (s.ctrl === ctrl) s.ctrl = null;
      });
  }

  function release(s: Scene) {
    s.ctrl?.abort();
    s.ctrl = null;
    if (s.video) {
      s.video.removeAttribute('src');
      s.video.load();
      s.video.remove();
      s.video = null;
    }
    if (s.url) URL.revokeObjectURL(s.url);
    s.url = null;
    s.ready = false;
    s.el.classList.remove('has-clip');
  }

  /** Escenas con caja (póster cargado): la actual y sus vecinas. En celulares se sueltan
      las que quedan a más de dos pasos. */
  function manageNear() {
    scenes.forEach((s, i) => {
      const d = i - current;
      // Antes de la primera interacción solo la escena actual: nada extra en la carga inicial.
      if (d === 0 || (interacted && d >= -1 && d <= 1)) s.el.classList.add('is-near');
      else if (isMobile() && Math.abs(d) > 2) s.el.classList.remove('is-near');
    });
  }

  function manageVideos() {
    manageNear();
    if (!allowVideo) return;
    load(scenes[current]);
    if (current + 1 < n) load(scenes[current + 1]);
    if (isMobile()) scenes.forEach((s, i) => Math.abs(i - current) > 2 && (s.video || s.ctrl) && release(s));
  }

  /* --------------------------------------------------------------- lectura */
  function read() {
    const y = window.scrollY - top;
    const fade = crossfade * vh;
    let ci = 0;
    scenes.forEach((s, i) => {
      if (y >= s.start) ci = i;
    });
    if (ci !== current) {
      current = ci;
      manageVideos();
    }

    scenes.forEach((s, i) => {
      s.target = clamp((y - s.start) / (s.end - s.start));
      const outside = y < s.start ? s.start - y : y > s.end ? y - s.end : 0;
      // La primera escena se queda visible por encima de la pista; la última, al final.
      const o = (i === 0 && y < s.start) || (i === n - 1 && y > s.end) ? 1 : smooth(1 - outside / fade);
      const op = o > 0.999 ? '1' : o < 0.001 ? '0' : o.toFixed(3);
      s.visible = op !== '0';
      if (op !== s.op) {
        s.op = op;
        s.el.style.opacity = op;
      }
      const z = i === ci ? '2' : '1';
      if (z !== s.z) {
        s.z = z;
        s.el.style.zIndex = z;
      }
    });

    /* El texto entra mientras la cámara llega a la escena (hasta `focus`), se queda durante
       la pausa y se va cuando la escena siguiente empieza a moverse. El primero ya está
       visible al cargar; el último se queda con el llamado final. */
    scenes.forEach((s, i) => {
      const len = s.end - s.start;
      const inEnd = s.start + s.focus * len;
      const fadeIn = i === 0 ? 1 : smooth((y - (inEnd - 0.3 * len)) / (0.3 * len));
      const fadeOut = i === n - 1 ? 1 : smooth(1 - (y - (s.end - 0.05 * vh)) / (0.4 * vh));
      const o = Math.min(fadeIn, fadeOut);
      const op = o > 0.999 ? '1' : o < 0.001 ? '0' : o.toFixed(3);
      if (op !== s.cardOp) {
        s.cardOp = op;
        s.card.style.opacity = op;
        if (!reduce) s.card.style.transform = op === '1' ? '' : `translate3d(0, ${((1 - o) * 2.5).toFixed(2)}vh, 0)`;
      }
      const isActive = o > 0.5;
      if (isActive !== s.cardActive) {
        s.cardActive = isActive;
        s.card.classList.toggle('is-active', isActive);
        s.card.inert = !isActive;
      }
    });

    // El capítulo activo cambia cuando su texto empieza a entrar, no cuando arranca su clip
    // (cada clip empieza todavía en la escena anterior, con la cámara saliendo de ella).
    let near = 0;
    scenes.forEach((s, i) => {
      if (i > 0 && y >= s.start + (s.focus - 0.3) * (s.end - s.start)) near = i;
    });
    if (near !== active) {
      active = near;
      links.forEach((l, k) => (k === near ? l.setAttribute('aria-current', 'step') : l.removeAttribute('aria-current')));
    }
    if (hint) {
      const h = clamp(1 - y / (0.5 * vh)).toFixed(2);
      if (h !== hintOp) {
        hintOp = h;
        hint.style.opacity = h;
      }
    }
  }

  /* ----------------------------------------------------------------- bucle */
  let running = false;
  let inView = true;
  let lastY = -1;

  function frame() {
    if (!inView) {
      running = false;
      return;
    }
    let busy = false;
    // Lenis mueve el scroll en su propio ciclo; leerlo cada cuadro mantiene video y texto juntos.
    if (window.scrollY !== lastY) {
      lastY = window.scrollY;
      read();
      busy = true;
    }
    const eps = isMobile() ? 0.02 : 0.008;
    for (const s of scenes) {
      const v = s.video;
      if (!v || !s.ready) continue;
      if (v.seeking) {
        busy = true;
        continue;
      }
      if (!s.visible) continue;
      const d = s.target - s.cur;
      if (Math.abs(d) < 0.0005) s.cur = s.target;
      else {
        s.cur += d * 0.18;
        busy = true;
      }
      const t = clamp(s.cur, 0, 0.999) * (v.duration || 1);
      if (Math.abs(v.currentTime - t) > eps) {
        v.currentTime = t;
        busy = true;
      }
    }
    if (busy) requestAnimationFrame(frame);
    else running = false;
  }

  function wake() {
    if (running || !inView) return;
    running = true;
    requestAnimationFrame(frame);
  }

  new IntersectionObserver((entries) => {
    inView = entries[entries.length - 1].isIntersecting;
    if (inView) wake();
  }).observe(root);

  /* --------------------------------------------------------------- eventos */
  window.addEventListener('scroll', wake, { passive: true });

  links.forEach((l, i) =>
    l.addEventListener(
      'click',
      (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const s = scenes[i];
        scrollToY(top + s.start + (s.end - s.start) * Math.min(0.95, Math.max(0.3, s.focus + 0.15)));
        history.replaceState(null, '', `#${cards[i].id}`);
      },
      { capture: true },
    ),
  );

  /* Videos: después de `load`, en un momento libre y tras la primera interacción. Con
     pósteres solos (movimiento reducido, ahorro de datos, red lenta, poca memoria) nunca. */
  let idle = false;
  const tryEnable = () => {
    if (still || !idle || !interacted || allowVideo) return;
    allowVideo = true;
    manageVideos();
    wake();
  };
  const interactions = ['scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown'];
  const onInteract = () => {
    if (interacted) return;
    interacted = true;
    interactions.forEach((t) => window.removeEventListener(t, onInteract));
    manageNear();
    tryEnable();
  };
  interactions.forEach((t) => window.addEventListener(t, onInteract, { passive: true }));
  const afterLoad = () => {
    const w = window as IdleWindow;
    const go = () => {
      idle = true;
      tryEnable();
    };
    if (w.requestIdleCallback) w.requestIdleCallback(go, { timeout: 3000 });
    else setTimeout(go, 600);
  };
  if (document.readyState === 'complete') afterLoad();
  else window.addEventListener('load', afterLoad, { once: true });

  // iOS: el primer toque «ceba» los videos para que pinten al buscar cuadros.
  const onFirstTouch = () => {
    if (userReady) return;
    userReady = true;
    scenes.forEach((s) => prime(s.video));
  };
  window.addEventListener('pointerdown', onFirstTouch, { once: true, passive: true });
  window.addEventListener('touchstart', onFirstTouch, { once: true, passive: true });

  // En celulares la barra de direcciones cambia el alto de la ventana al subir y bajar: la
  // pista usa svh y no cambia, así que solo se recalcula si cambia el ancho.
  window.addEventListener('resize', () => {
    if (isMobile() && window.innerWidth === laidOutW) return;
    layout();
    wake();
  });
  window.addEventListener('load', () => {
    layout();
    wake();
  }, { once: true });

  manageNear();
  layout();
  // Enlace directo a un paso (#diseno): el ancla real está dentro del escenario fijo.
  const fromHash = cards.findIndex((c) => `#${c.id}` === location.hash);
  if (fromHash > 0) {
    const s = scenes[fromHash];
    scrollToY(top + s.start + (s.end - s.start) * Math.min(0.95, Math.max(0.3, s.focus + 0.15)), true);
  }
  lastY = window.scrollY;
  read();
}

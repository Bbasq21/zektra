/* «Nuestra historia» en video: el scroll mueve el tiempo de videos pre-renderizados.

   La sección es una pista alta con dos capas fijas (sticky) encima: el escenario con los
   videos y la capa de tarjetas. La pista se reparte en tramos, en orden:
     escena 1 · transición 1→2 · escena 2 · … · escena N
   Dentro de su tramo, cada video avanza de 0 a su duración según el scroll. En el borde
   entre tramos los dos videos se funden unos pocos cuadros (las transiciones empiezan y
   terminan en los cuadros reales de las escenas, así que el fundido casi no se nota).

   Detalles que importan (adaptados del motor de scroll-world):
   - Cada video se descarga como Blob y se reproduce desde una URL en memoria: así siempre
     se puede buscar cualquier cuadro, aunque el servidor no soporte rangos de bytes.
   - Nunca se pide un cuadro nuevo mientras el anterior se está decodificando; en celulares
     un scroll rápido apilaría búsquedas y congelaría el video.
   - El póster se queda visible hasta que el video pinta su primer cuadro (iOS no pinta un
     video silenciado que nunca se reprodujo) y en el primer toque se «ceba» cada video.
   - Con movimiento reducido no se carga ningún video: los pósteres se funden entre sí. */
import { scrollToY } from './app';

interface Segment {
  el: HTMLElement;
  img: HTMLImageElement | null;
  kind: 'scene' | 'transition';
  chapter: number;
  clip?: string;
  clipMobile?: string;
  w: number;
  linger: number;
  start: number;
  end: number;
  video: HTMLVideoElement | null;
  loading: boolean;
  ready: boolean;
  cur: number;
  target: number;
  visible: boolean;
}

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (x: number) => {
  x = clamp(x);
  return x * x * (3 - 2 * x);
};
/** f(0)=0 y f(1)=1 siempre: los cuadros de borde no cambian, solo el ritmo del medio. */
const lingerEase = (x: number, l: number) => {
  const c = x - 0.5;
  return (1 - l) * x + l * (4 * c * c * c + 0.5);
};

export function initStoryVideo() {
  const found = document.querySelector<HTMLElement>('[data-reel]');
  if (!found) return;
  const root: HTMLElement = found;
  const track = root.querySelector<HTMLElement>('[data-reel-track]')!;
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-reel-card]'));
  const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-reel-link]'));
  const hint = root.querySelector<HTMLElement>('[data-reel-hint]');
  const crossfade = Number(root.dataset.crossfade) || 0.12;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const small = window.matchMedia('(max-width: 860px)');
  const isMobile = () => coarse || small.matches;

  const segs: Segment[] = Array.from(root.querySelectorAll<HTMLElement>('[data-reel-seg]')).map((el) => ({
    el,
    img: el.querySelector('img'),
    kind: el.dataset.kind === 'transition' ? 'transition' : 'scene',
    chapter: Number(el.dataset.chapter),
    clip: el.dataset.clip || undefined,
    clipMobile: el.dataset.clipMobile || undefined,
    w: Number(el.dataset.w) || 1.2,
    linger: clamp(Number(el.dataset.linger) || 0, 0, 0.6),
    start: 0,
    end: 0,
    video: null,
    loading: false,
    ready: false,
    cur: 0,
    target: 0,
    visible: false,
  }));
  const scenes = segs.filter((s) => s.kind === 'scene');
  const n = scenes.length;
  if (!n) return;

  root.classList.add('reel--live');

  let vh = window.innerHeight;
  let laidOutW = window.innerWidth;
  let top = 0;
  let total = 0;
  let active = -1;

  function layout() {
    vh = window.innerHeight;
    laidOutW = window.innerWidth;
    let off = 0;
    segs.forEach((s) => {
      s.start = off * vh;
      off += s.w;
      s.end = off * vh;
    });
    total = off * vh;
    // +1 pantalla para que la última escena termine antes de soltar el escenario.
    track.style.height = `${total + vh}px`;
    top = root.getBoundingClientRect().top + window.scrollY;
    read();
  }

  let userReady = false;
  function prime(v: HTMLVideoElement | null) {
    if (!v || !isMobile()) return;
    const p = v.play();
    if (p) p.then(() => v.pause()).catch(() => {});
  }

  function load(s: Segment) {
    if (reduce || s.loading || !s.clip) return;
    s.loading = true;
    const url = isMobile() && s.clipMobile ? s.clipMobile : s.clip;
    fetch(url)
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
      .then((blob) => {
        const v = document.createElement('video');
        v.className = 'reel__video';
        v.muted = true;
        v.playsInline = true;
        v.preload = 'auto';
        v.setAttribute('muted', '');
        v.setAttribute('playsinline', '');
        v.setAttribute('aria-hidden', 'true');
        v.src = URL.createObjectURL(blob);
        v.addEventListener('loadedmetadata', () => {
          s.ready = true;
          read();
        });
        v.addEventListener('seeked', () => s.el.classList.add('has-clip'), { once: true });
        v.addEventListener('loadeddata', () => {
          v.pause();
          if (userReady) prime(v);
        });
        s.el.appendChild(v);
        s.video = v;
      })
      .catch(() => {
        s.loading = false;
      });
  }

  function chapterProgress(i: number, y: number) {
    const s = scenes[i];
    return { pr: clamp((y - s.start) / (s.end - s.start)), before: y < s.start, after: y > s.end };
  }

  function read() {
    const y = window.scrollY - top;
    const fade = crossfade * vh;
    let ci = 0;
    segs.forEach((s, i) => {
      if (y >= s.start) ci = i;
    });

    segs.forEach((s, i) => {
      if (y > s.start - 1.6 * vh && y < s.end + 1.6 * vh) load(s);
      const local = clamp((y - s.start) / (s.end - s.start));
      s.target = s.linger ? lingerEase(local, s.linger) : local;
      const outside = y < s.start ? s.start - y : y > s.end ? y - s.end : 0;
      const op = smooth(1 - outside / fade);
      s.el.style.opacity = String(op);
      s.visible = op > 0.001;
      s.el.style.zIndex = i === ci ? '20' : String(10 + Math.round(op * 5));
      // Sin video (cargando o movimiento reducido): el póster se acerca despacio.
      if (s.img && !s.ready) {
        const sc = reduce ? 1 : 1.02 + local * 0.1;
        s.img.style.transform = `scale(${sc.toFixed(3)})`;
      }
    });

    cards.forEach((c, i) => {
      const { pr, before, after } = chapterProgress(i, y);
      let op: number;
      if (i === 0) op = after ? 0 : smooth(1 - pr / 0.62); // saluda al llegar
      else if (i === n - 1) op = before ? 0 : smooth(pr / 0.4); // se queda con el llamado final
      else op = before || after ? 0 : smooth(1 - Math.abs(pr - 0.5) / 0.5);
      c.style.opacity = String(op);
      c.style.transform = reduce ? 'none' : `translateY(${((0.5 - pr) * 4).toFixed(2)}vh)`;
      c.classList.toggle('is-active', op > 0.5);
      c.toggleAttribute('inert', op <= 0.5);
    });

    const cur = segs[ci];
    const near =
      cur.kind === 'scene'
        ? cur.chapter
        : clamp((y - cur.start) / (cur.end - cur.start) > 0.5 ? cur.chapter + 1 : cur.chapter, 0, n - 1);
    if (near !== active) {
      active = near;
      links.forEach((l, k) => (k === near ? l.setAttribute('aria-current', 'step') : l.removeAttribute('aria-current')));
    }
    if (hint) hint.style.opacity = String(clamp(1 - y / (0.5 * vh)));
  }

  let lastY = -1;
  function frame() {
    // Lenis mueve el scroll en su propio ciclo; leerlo cada cuadro mantiene video y texto juntos.
    if (window.scrollY !== lastY) {
      lastY = window.scrollY;
      read();
    }
    const eps = isMobile() ? 0.02 : 0.008;
    for (const s of segs) {
      const v = s.video;
      if (!v || !s.ready || v.seeking) continue;
      if (!s.visible && Math.abs(s.cur - s.target) < 0.002) continue;
      s.cur += (s.target - s.cur) * (reduce ? 1 : 0.18);
      const t = clamp(s.cur, 0, 0.999) * (v.duration || 1);
      if (Math.abs(v.currentTime - t) > eps) v.currentTime = t;
    }
    requestAnimationFrame(frame);
  }

  links.forEach((l, i) =>
    l.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      const s = scenes[i];
      scrollToY(top + s.start + (s.end - s.start) * (i === n - 1 ? 0.7 : 0.5));
    }, { capture: true }),
  );

  const onFirst = () => {
    if (userReady) return;
    userReady = true;
    segs.forEach((s) => prime(s.video));
  };
  window.addEventListener('pointerdown', onFirst, { once: true, passive: true });
  window.addEventListener('touchstart', onFirst, { once: true, passive: true });

  // En celulares la barra de direcciones dispara resize al subir y bajar: solo se recalcula
  // si cambia el ancho, o la página saltaría.
  window.addEventListener('resize', () => {
    if (coarse && window.innerWidth === laidOutW) return;
    layout();
  });
  window.addEventListener('orientationchange', layout);
  window.addEventListener('load', layout);
  layout();
  requestAnimationFrame(frame);
}

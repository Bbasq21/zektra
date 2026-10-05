import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initScenes } from './scenes/loader';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let lenis: Lenis | null = null;

/* ---------------------------------------------------------------- Lenis */
function initSmoothScroll() {
  if (reduceMotion()) return;
  lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis?.scrollTo(target as HTMLElement, { offset: -88 });
    });
  });
}

/* --------------------------------------------------------------- Header */
function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  let last = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('header--scrolled', y > 24);
    if (!header.classList.contains('header--open')) {
      header.classList.toggle('header--hidden', y > 320 && y > last + 4);
      if (y < last - 4) header.classList.remove('header--hidden');
    }
    last = y;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = header.querySelector<HTMLElement>('[data-menu]');
  const label = header.querySelector<HTMLElement>('[data-menu-label]');
  if (!toggle || !menu) return;

  const items = menu.querySelectorAll<HTMLElement>('[data-menu-item]');
  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? 'Cerrar menú' : 'Abrir menú';
    header.classList.toggle('header--open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    open ? lenis?.stop() : lenis?.start();
    if (open) {
      menu.hidden = false;
      if (!reduceMotion()) {
        gsap.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'expo.out' });
        gsap.fromTo(items, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'expo.out', delay: 0.1 });
      }
    } else {
      menu.hidden = true;
    }
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => e.matches && setOpen(false));
}

/* ----------------------------------------------------------- Split text */
function splitWords(el: HTMLElement) {
  if (el.dataset.splitDone) return [] as HTMLElement[];
  el.dataset.splitDone = '1';
  const label = el.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  while (walker.nextNode()) texts.push(walker.currentNode as Text);
  const inners: HTMLElement[] = [];
  texts.forEach((node) => {
    const parts = (node.textContent ?? '').split(/(\s+)/);
    const frag = document.createDocumentFragment();
    parts.forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(' '));
        return;
      }
      const word = document.createElement('span');
      word.className = 'split__word';
      word.setAttribute('aria-hidden', 'true');
      const inner = document.createElement('span');
      inner.className = 'split__inner';
      inner.textContent = part;
      word.appendChild(inner);
      frag.appendChild(word);
      inners.push(inner);
    });
    node.replaceWith(frag);
  });
  el.setAttribute('aria-label', label);
  return inners;
}

function initSplits() {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const words = splitWords(el);
    if (!words.length) return;
    const immediate = el.hasAttribute('data-split-immediate');
    gsap.set(words, { yPercent: 110 });
    const tween = {
      yPercent: 0,
      duration: immediate ? 1.1 : 0.9,
      ease: 'expo.out',
      stagger: immediate ? 0.045 : 0.03,
      delay: immediate ? 0.15 : 0,
    };
    if (immediate) gsap.to(words, tween);
    else gsap.to(words, { ...tween, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
}

/* --------------------------------------------------------------- Reveal */
function initReveals() {
  const heroItems = document.querySelectorAll<HTMLElement>('[data-hero-item]');
  if (heroItems.length) {
    gsap.fromTo(heroItems, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.12, delay: 0.45 });
  }

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } },
    );
  });

  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
    const children = Array.from(group.children) as HTMLElement[];
    gsap.set(children, { opacity: 0, y: 40 });
    ScrollTrigger.batch(children, {
      start: 'top 92%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }),
    });
  });

  document.querySelectorAll<HTMLElement>('[data-progress]').forEach((el) => {
    const bar = el.querySelector<HTMLElement>('[data-progress-bar]');
    if (!bar) return;
    gsap.fromTo(bar, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 70%', end: 'bottom 60%', scrub: true } });
    el.querySelectorAll<HTMLElement>('[data-progress-step]').forEach((step) => {
      ScrollTrigger.create({ trigger: step, start: 'top 65%', onEnter: () => step.classList.add('is-active'), onLeaveBack: () => step.classList.remove('is-active') });
    });
  });

  document.querySelectorAll<HTMLElement>('[data-scrub-text]').forEach((el) => {
    const words = splitWords(el);
    if (!words.length) return;
    gsap.fromTo(words, { opacity: 0.18 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
  });

  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax) || 10;
    gsap.fromTo(el, { yPercent: -amount }, { yPercent: amount, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* ------------------------------------------------------- Pointer effects */
function initPointerEffects() {
  if (!finePointer() || reduceMotion()) return;

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((btn) => {
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.18);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
    });
    btn.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

/* ------------------------------------------------------------------ App */
export function initApp() {
  document.documentElement.classList.add('is-ready');
  initHeader();

  if (reduceMotion()) {
    document.documentElement.classList.remove('js');
    initScenes({ reduced: true });
    return;
  }

  try {
    initSmoothScroll();
    initSplits();
    initReveals();
    initPointerEffects();
  } catch (err) {
    console.error(err);
    document.documentElement.classList.remove('js');
  }

  initScenes({ reduced: false });

  window.addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import type { SceneController } from './types';

/* Esqueleto común: renderer, cámara, resize, puntero suavizado y bucle. */
export interface Stage {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  pointer: { x: number; y: number; tx: number; ty: number };
  progress: { value: number; target: number };
  size: { w: number; h: number };
}

export function createStage(
  host: HTMLElement,
  opts: { reduced: boolean; fov?: number; z?: number },
  hooks: {
    update: (t: number, dt: number, stage: Stage) => void;
    resize?: (stage: Stage) => void;
    dispose?: () => void;
  },
): SceneController {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(opts.fov ?? 45, 1, 0.1, 100);
  camera.position.set(0, 0, opts.z ?? 10);

  const stage: Stage = {
    renderer,
    scene,
    camera,
    pointer: { x: 0, y: 0, tx: 0, ty: 0 },
    progress: { value: 0, target: 0 },
    size: { w: 1, h: 1 },
  };

  const resize = () => {
    const w = host.clientWidth || window.innerWidth;
    const h = host.clientHeight || window.innerHeight;
    stage.size = { w, h };
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    hooks.resize?.(stage);
    if (opts.reduced || !running) renderer.render(scene, camera);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  const onPointer = (e: PointerEvent) => {
    stage.pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    stage.pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  if (!opts.reduced) window.addEventListener('pointermove', onPointer, { passive: true });

  let lastTime = 0;
  let raf = 0;
  let running = false;
  let elapsed = 0;

  const frame = () => {
    raf = requestAnimationFrame(frame);
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    elapsed += dt;
    stage.pointer.x += (stage.pointer.tx - stage.pointer.x) * 0.05;
    stage.pointer.y += (stage.pointer.ty - stage.pointer.y) * 0.05;
    stage.progress.value += (stage.progress.target - stage.progress.value) * 0.08;
    hooks.update(elapsed, dt, stage);
    renderer.render(scene, camera);
  };

  resize();
  if (opts.reduced) {
    hooks.update(4, 0, stage);
    renderer.render(scene, camera);
  }

  return {
    start() {
      if (running || opts.reduced) return;
      running = true;
      lastTime = performance.now();
      raf = requestAnimationFrame(frame);
    },
    stop() {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    },
    setProgress(p: number) {
      stage.progress.target = p;
    },
    dispose() {
      this.stop();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      hooks.dispose?.();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

/* Colores del gradiente oficial, en orden. */
export const BRAND_GRADIENT = ['#1E02FB', '#6902FC', '#FB1195', '#FD432B', '#FEB616', '#89FACE'];

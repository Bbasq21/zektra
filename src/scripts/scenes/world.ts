/* Escena «Mundo» — Nuestra historia (/historia/).
   Seis islas de arcilla flotando en la noche, una por capítulo: Medellín, estrategia,
   diseño, desarrollo, evolución y tu proyecto. El scroll mueve la cámara: baja a cada isla,
   se queda mientras se lee el capítulo y vuela a la siguiente siguiendo un hilo de datos
   que recorre el gradiente oficial, del Índigo de la primera isla al Menta de la última.
   Todo es geometría simple con flat shading, sin texturas ni sombras dinámicas. */
import {
  AmbientLight,
  Box3,
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Fog,
  Group,
  HemisphereLight,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PointLight,
  Points,
  PointsMaterial,
  QuadraticBezierCurve3,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { MONOGRAM_PATH } from '../../data/monogram';
import { chapterKey, holdDrift, readStory } from '../story';
import { BRAND_GRADIENT, createStage, type Stage } from './base';
import type { SceneFactory } from './types';

/* ------------------------------------------------------------------ Paleta
   Marca (tema Noche) más tonos de apoyo derivados de ella para la arcilla. */
const C = {
  noche: '#020315',
  indigo: '#1E02FB',
  violeta: '#6902FC',
  magenta: '#FB1195',
  coral: '#FD432B',
  ambar: '#FEB616',
  menta: '#89FACE',
  ink: '#F3F4FA',
  papel: '#D9DBEE',
  gris: '#666BA0',
  grisOscuro: '#3A3F7E',
  isla: '#2A2F72',
  ladera: '#171A48',
  roca: '#0C0E2A',
  piso: '#34306E',
  muro: '#2B3080',
  muro2: '#252A70',
  maquina: '#161944',
  cesped: '#1D5E5C',
  hoja: '#1F8A6E',
  hojaClara: '#2FB089',
  tronco: '#5E4A6E',
  piel: '#E3B18D',
  pielOscura: '#A8714D',
  nube: '#2C3170',
};

/* Paredes de las casas de las laderas: los colores de marca, apagados para la noche. */
const WALLS = ['#B83A6E', '#5B3FB0', '#C9673A', '#3A5FB8', '#3E9A86', C.papel, '#9A4FD0'];

type Tick = (t: number) => void;
interface Piece { group: Group; ticks: Tick[] }

/* ---------------------------------------------------------------- Escena */
const world: SceneFactory = (host, opts) => {
  const section = host.closest<HTMLElement>('[data-story]');
  const chapters = section ? Array.from(section.querySelectorAll<HTMLElement>('[data-story-chapter]')) : [];

  /* ---------- Fábrica de piezas (geometrías y materiales se registran para liberarlos) */
  const geos: BufferGeometry[] = [];
  const mats = new Map<string, MeshStandardMaterial>();
  const neons = new Map<string, MeshBasicMaterial>();
  const extraMats: (MeshStandardMaterial | MeshBasicMaterial | PointsMaterial)[] = [];
  const UP = new Vector3(0, 1, 0);

  let seed = 20261012;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const geo = <T extends BufferGeometry>(g: T) => (geos.push(g), g);
  /** Geometrías compartidas: cientos de cajas y cilindros repiten medidas, así que una
      misma forma se sube a la GPU una sola vez. */
  const geoCache = new Map<string, BufferGeometry>();
  const shared = (key: string, make: () => BufferGeometry) => {
    let g = geoCache.get(key);
    if (!g) {
      g = geo(make());
      geoCache.set(key, g);
    }
    return g;
  };

  /** Material de arcilla. `glow` lo vuelve emisivo (ventanas, pantallas, luces). */
  const mat = (color: string, glow = 0, rough = 0.82) => {
    const key = `${color}|${glow}|${rough}`;
    let m = mats.get(key);
    if (!m) {
      m = new MeshStandardMaterial({ color, roughness: rough, metalness: 0, flatShading: true, emissive: glow ? color : '#000000', emissiveIntensity: glow });
      mats.set(key, m);
    }
    return m;
  };
  /** Material sin luz, a brillo pleno: neones, chispas e hilos de datos. */
  const neon = (color: string) => {
    let m = neons.get(color);
    if (!m) {
      m = new MeshBasicMaterial({ color, toneMapped: false });
      neons.set(color, m);
    }
    return m;
  };

  const box = (w: number, h: number, d: number, c: string, glow = 0) =>
    new Mesh(shared(`b${w},${h},${d}`, () => new BoxGeometry(w, h, d)), mat(c, glow));
  const cyl = (rt: number, rb: number, h: number, c: string, seg = 10, glow = 0) =>
    new Mesh(shared(`c${rt},${rb},${h},${seg}`, () => new CylinderGeometry(rt, rb, h, seg)), mat(c, glow));
  const ball = (r: number, c: string, glow = 0, ws = 10, hs = 8) =>
    new Mesh(shared(`s${r},${ws},${hs}`, () => new SphereGeometry(r, ws, hs)), mat(c, glow));
  const cone = (r: number, h: number, c: string, seg = 8, glow = 0) =>
    new Mesh(shared(`k${r},${h},${seg}`, () => new ConeGeometry(r, h, seg)), mat(c, glow));

  function put<T extends Object3D>(parent: Object3D, obj: T, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0): T {
    obj.position.set(x, y, z);
    obj.rotation.set(rx, ry, rz);
    parent.add(obj);
    return obj;
  }

  function rod(parent: Object3D, a: Vector3, b: Vector3, r: number, c: string) {
    const d = new Vector3().subVectors(b, a);
    const m = cyl(r, r, d.length(), c, 6);
    m.position.copy(a).addScaledVector(d, 0.5);
    m.quaternion.setFromUnitVectors(UP, d.normalize());
    parent.add(m);
    return m;
  }

  /* ---------- Piezas reutilizables */
  function island(r: number, top: string, accent: string) {
    const g = new Group();
    put(g, cyl(r, r * 0.97, 0.7, top, 14), 0, -0.35, 0);
    put(g, cyl(r * 0.97, r * 0.8, 1.2, C.ladera, 14), 0, -1.3, 0);
    put(g, cone(r * 0.8, r * 1.1, C.roca, 14), 0, -1.9 - r * 0.55, 0, Math.PI, 0, 0);
    // Borde de neón con el color del capítulo
    put(g, new Mesh(geo(new TorusGeometry(r * 0.99, 0.05, 6, 72)), neon(accent)), 0, 0.01, 0, Math.PI / 2, 0, 0);
    for (let k = 0; k < 5; k++) {
      const a = rnd() * Math.PI * 2;
      put(g, ball(0.5 + rnd() * 0.5, C.roca, 0, 6, 4), Math.cos(a) * r * 0.55, -2.6 - rnd() * 1.5, Math.sin(a) * r * 0.55);
    }
    return g;
  }

  function person(body: string, hat?: string) {
    const p = new Group();
    put(p, cyl(0.2, 0.28, 0.75, body, 8), 0, 0.375, 0);
    put(p, ball(0.21, rnd() < 0.5 ? C.piel : C.pielOscura), 0, 0.97, 0);
    put(p, new Mesh(geo(new SphereGeometry(hat ? 0.25 : 0.225, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2)), mat(hat ?? C.roca)), 0, 1.0, 0);
    if (hat) put(p, cyl(0.3, 0.3, 0.04, hat, 12), 0, 1.0, 0);
    return p;
  }

  function palm(h: number) {
    const p = new Group();
    put(p, cyl(0.11, 0.17, h, C.tronco, 6), 0, h / 2, 0);
    for (let k = 0; k < 6; k++) {
      const piv = new Group();
      put(piv, box(1.5, 0.06, 0.42, k % 2 ? C.hoja : C.hojaClara), 0.72, 0, 0, 0, 0, -0.38);
      put(p, piv, 0, h, 0, 0, (k * Math.PI) / 3, 0);
    }
    put(p, ball(0.17, C.tronco, 0, 6, 5), 0, h, 0);
    return p;
  }

  function house(w: number, h: number, d: number, wall: string, roof: string) {
    const p = new Group();
    put(p, box(w, h, d, wall), 0, h / 2, 0);
    put(p, cone(Math.max(w, d) * 0.78, h * 0.55, roof, 4), 0, h * 1.275, 0, 0, Math.PI / 4, 0);
    put(p, box(w * 0.3, h * 0.3, 0.05, C.ambar, 1.1), -w * 0.18, h * 0.55, d / 2 + 0.02);
    if (rnd() > 0.35) put(p, box(w * 0.22, h * 0.3, 0.05, C.ambar, 1.1), w * 0.25, h * 0.55, d / 2 + 0.02);
    return p;
  }

  function cloud(s: number, color: string = C.nube) {
    const p = new Group();
    const parts: [number, number, number, number][] = [[0, 0, 0, 1], [0.9, -0.1, 0.1, 0.75], [-0.9, -0.15, 0, 0.7], [0.35, 0.45, 0, 0.65], [-0.4, 0.35, 0.1, 0.6]];
    parts.forEach(([x, y, z, r]) => put(p, ball(r * s, color, 0, 8, 6), x * s, y * s, z * s));
    return p;
  }

  function gear(r: number, c: string, teeth = 8) {
    const p = new Group();
    put(p, cyl(r, r, 0.3, c, 16), 0, 0, 0, Math.PI / 2, 0, 0);
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2;
      put(p, box(r * 0.35, r * 0.35, 0.3, c), Math.cos(a) * r, Math.sin(a) * r, 0, 0, 0, a);
    }
    put(p, cyl(r * 0.35, r * 0.35, 0.34, C.papel, 10), 0, 0, 0, Math.PI / 2, 0, 0);
    return p;
  }

  function magnifier(s: number) {
    const p = new Group();
    put(p, new Mesh(geo(new TorusGeometry(0.7 * s, 0.12 * s, 8, 20)), mat(C.coral)), 0, 0, 0);
    const glassMat = new MeshStandardMaterial({ color: C.menta, transparent: true, opacity: 0.28, roughness: 0.1, emissive: C.menta, emissiveIntensity: 0.25 });
    extraMats.push(glassMat);
    put(p, new Mesh(geo(new CylinderGeometry(0.68 * s, 0.68 * s, 0.04, 20)), glassMat), 0, 0, 0, Math.PI / 2, 0, 0);
    put(p, cyl(0.09 * s, 0.11 * s, 1.4 * s, C.maquina, 8), 0, -1.52 * s, 0);
    return p;
  }

  /** Panel de interfaz: gris = wireframe, a color = diseño final. */
  function panel(w: number, h: number, final: boolean) {
    const p = new Group();
    const z = 0.07;
    put(p, box(w, h, 0.1, final ? C.ink : C.grisOscuro, final ? 0.15 : 0), 0, 0, 0);
    put(p, box(w * 0.9, h * 0.12, 0.04, final ? C.violeta : C.gris, final ? 0.6 : 0), 0, h * 0.37, z);
    put(p, box(w * 0.42, h * 0.42, 0.04, final ? C.magenta : C.gris, final ? 0.5 : 0), -w * 0.22, h * 0.02, z);
    for (let k = 0; k < 3; k++) put(p, box(w * 0.38, h * 0.06, 0.04, final ? C.ladera : C.gris), w * 0.23, h * 0.15 - k * h * 0.13, z);
    put(p, box(w * 0.2, h * 0.1, 0.04, final ? C.menta : C.gris, final ? 0.6 : 0), w * 0.14, -h * 0.3, z);
    return p;
  }

  function lamp(parent: Object3D, x: number, z: number) {
    put(parent, cyl(0.05, 0.06, 1.5, C.gris, 6), x, 0.75, z);
    put(parent, ball(0.15, C.ambar, 2.2, 8, 6), x, 1.55, z);
  }

  /* ---------- Capítulo 1 · Origen: ladera de Medellín de noche, Metrocable y el estudio */
  function origen(accent: string): Piece {
    const g = island(7.2, C.cesped, accent);
    const ticks: Tick[] = [];
    const terr: [number, number, number, number, string][] = [
      [11, 1, 2.4, -3.2, '#3B3A7A'],
      [9, 2, 2.2, -4.4, '#34346F'],
      [6.5, 3, 1.8, -5.4, '#2D2D63'],
    ];
    terr.forEach(([w, h, d, z, c]) => put(g, box(w, h, d, c), 0, h / 2, z));
    const rows: [number, number, number[]][] = [
      [1, -2.7, [-4.3, -2.5, 2.4, 4.3]],
      [2, -3.95, [-3.3, -1.2, 1.1, 3.3]],
      [3, -5.4, [-2.1, 0, 2.1]],
    ];
    const roofs = [C.coral, C.ladera, '#7A2F5A'];
    let n = 0;
    rows.forEach(([y, z, xs]) =>
      xs.forEach((x) => {
        put(g, house(1.1 + rnd() * 0.5, 0.9 + rnd() * 0.6, 1.1, WALLS[n % WALLS.length], roofs[n % roofs.length]), x, y, z, 0, (rnd() - 0.5) * 0.2, 0);
        n++;
      }),
    );

    // El estudio: ventana encendida y una terraza con el escritorio
    const st = new Group();
    put(st, box(3.4, 2.3, 2.6, C.papel), 0, 1.15, 0);
    put(st, box(3.8, 0.3, 3.0, C.violeta), 0, 2.45, 0);
    put(st, box(1.9, 1.15, 0.06, C.ambar, 1.0), -0.45, 1.3, 1.31);
    put(st, box(0.62, 1.35, 0.06, C.coral), 1.15, 0.68, 1.31);
    put(g, st, 0, 0, 0.3);
    put(g, box(4.4, 0.16, 2.6, C.piso), 0, 0.08, 2.95);

    const desk = new Group();
    put(desk, box(1.7, 0.1, 0.8, C.tronco), 0, 0.8, 0);
    ([[-0.75, -0.32], [0.75, -0.32], [-0.75, 0.32], [0.75, 0.32]] as const).forEach(([x, z]) => put(desk, box(0.08, 0.78, 0.08, C.maquina), x, 0.39, z));
    put(desk, box(0.72, 0.04, 0.5, C.maquina), 0, 0.87, 0.02);
    const screen = new Group();
    put(screen, box(0.72, 0.46, 0.03, C.maquina), 0, 0.23, 0);
    put(screen, box(0.64, 0.38, 0.01, C.menta, 1.4), 0, 0.23, 0.02);
    put(desk, screen, 0, 0.89, -0.23, -0.18, 0, 0);
    put(g, desk, 0, 0.16, 3.0);
    put(g, cyl(0.28, 0.3, 0.45, C.coral, 10), 0, 0.385, 3.7);
    put(g, person(C.violeta), 0, 0.6, 3.7, 0, Math.PI, 0);

    ([[-4.9, 1.4, 2.8], [5.1, 1.0, 2.6], [-2.8, 4.7, 2.1], [4.2, 4.3, 2.2]] as const).forEach(([x, z, h]) => put(g, palm(h), x, 0, z, 0, rnd() * 6, 0));
    lamp(g, -2.2, 4.4);
    lamp(g, 2.6, 5.2);
    lamp(g, -5.6, -0.6);

    // Metrocable entre dos torres, con la cabina yendo y viniendo
    const A = new Vector3(-6.2, 5.2, 0.6);
    const B = new Vector3(6.1, 7.2, -0.4);
    put(g, box(0.3, 5.2, 0.3, C.ladera), A.x, 2.6, A.z);
    put(g, box(1.2, 0.16, 0.16, C.ladera), A.x, 5.2, A.z);
    put(g, box(0.3, 7.2, 0.3, C.ladera), B.x, 3.6, B.z);
    put(g, box(1.2, 0.16, 0.16, C.ladera), B.x, 7.2, B.z);
    rod(g, A, B, 0.03, C.gris);
    const gondola = new Group();
    put(gondola, cyl(0.03, 0.03, 0.8, C.gris, 5), 0, -0.4, 0);
    put(gondola, box(0.95, 0.8, 0.85, C.coral), 0, -1.15, 0);
    put(gondola, box(0.97, 0.26, 0.87, C.ambar, 1.2), 0, -1.0, 0);
    g.add(gondola);
    ticks.push((t) => gondola.position.lerpVectors(A, B, 0.5 + 0.5 * Math.sin(t * 0.22)));
    return { group: g, ticks };
  }

  /* ---------- Capítulo 2 · Estrategia: el taller con la pared de notas */
  function estrategia(accent: string): Piece {
    const g = island(7, C.isla, accent);
    put(g, box(9.5, 0.3, 7, C.piso), 0, 0.15, -0.2);
    put(g, box(9.5, 4, 0.35, C.muro), 0, 2.3, -3.55);
    put(g, box(0.35, 4, 6.6, C.muro2), -4.6, 2.3, -0.4);

    const noteColors = [C.coral, C.ambar, C.menta, '#A78BFF', C.magenta];
    const notes: Vector3[] = [];
    [3.45, 2.75, 2.05].forEach((y, r) =>
      [-3.2, -2, -0.8, 0.4, 1.6, 2.8].forEach((x, c) => {
        if (rnd() < 0.18) return;
        const m = put(g, box(0.62, 0.62, 0.06, noteColors[(r * 2 + c) % 5], 0.35), x + (rnd() - 0.5) * 0.2, y + (rnd() - 0.5) * 0.15, -3.33, 0, 0, (rnd() - 0.5) * 0.25);
        notes.push(m.position.clone());
      }),
    );
    const link = (a: Vector3, b: Vector3) => rod(g, new Vector3(a.x, a.y, -3.28), new Vector3(b.x, b.y, -3.28), 0.018, C.ink);
    for (let k = 0; k + 1 < notes.length; k += 2) link(notes[k], notes[k + 1]);
    if (notes.length > 6) {
      link(notes[0], notes[5]);
      link(notes[3], notes[notes.length - 1]);
    }

    // Tablero con un flujo dibujado
    put(g, box(0.06, 2, 3.4, C.papel), -4.39, 2.4, -0.7);
    const flow: [number, number, string][] = [[2.9, -1.8, C.violeta], [2.9, -0.7, C.coral], [2.9, 0.4, C.menta], [1.95, -1.25, C.indigo], [1.95, -0.15, C.ambar]];
    flow.forEach(([y, z, c]) => put(g, box(0.03, 0.38, 0.7, c), -4.35, y, z));
    rod(g, new Vector3(-4.34, 2.9, -1.45), new Vector3(-4.34, 2.9, -1.05), 0.02, C.maquina);
    rod(g, new Vector3(-4.34, 2.9, -0.35), new Vector3(-4.34, 2.9, 0.05), 0.02, C.maquina);
    rod(g, new Vector3(-4.34, 2.7, -1.6), new Vector3(-4.34, 2.15, -1.35), 0.02, C.maquina);

    // Mesa, tazas, tapete y el equipo frente a la pared
    put(g, cyl(2.2, 2.2, 0.03, '#4A3A8C', 18), 1.2, 0.315, 0.4);
    put(g, cyl(0.12, 0.16, 0.8, C.maquina, 8), 1.4, 0.7, 0.7);
    put(g, cyl(1.05, 1.05, 0.12, C.papel, 14), 1.4, 1.16, 0.7);
    put(g, cyl(0.13, 0.1, 0.24, C.coral, 8), 1.1, 1.34, 0.5);
    put(g, cyl(0.13, 0.1, 0.24, C.menta, 8), 1.75, 1.34, 0.95);
    put(g, box(0.5, 0.04, 0.38, C.violeta), 1.5, 1.24, 0.3, 0, 0.4, 0);
    put(g, person(C.violeta), -1.4, 0.3, -2.3, 0, Math.PI, 0);
    put(g, person(C.menta), 0.5, 0.3, -2.4, 0, Math.PI * 0.95, 0);
    put(g, person(C.coral), 2.4, 0.3, -1.3, 0, Math.PI * 0.8, 0);
    put(g, magnifier(1), 3.7, 2.55, -2.6, 0, -0.4, 0.22);
    put(g, cyl(0.34, 0.26, 0.6, C.coral, 10), 3.9, 0.6, 2.2);
    put(g, ball(0.55, C.hoja, 0, 8, 6), 3.9, 1.25, 2.2);
    put(g, ball(0.4, C.hojaClara, 0, 8, 6), 3.7, 1.65, 2.1);
    // Lámpara colgante sobre la mesa
    put(g, cyl(0.02, 0.02, 1.2, C.gris, 4), 1.4, 3.7, 0.7);
    put(g, cone(0.45, 0.4, C.maquina, 10), 1.4, 3.0, 0.7);
    put(g, ball(0.16, C.ambar, 2.4, 8, 6), 1.4, 2.82, 0.7);
    return { group: g, ticks: [] };
  }

  /* ---------- Capítulo 3 · Diseño: paneles que pasan de wireframe a diseño final */
  function diseno(accent: string): Piece {
    const g = island(7, C.isla, accent);
    const ticks: Tick[] = [];
    put(g, cyl(5.2, 5.4, 0.25, C.piso, 14), 0, 0.12, -0.3);

    const defs: [number, number, number, number, boolean][] = [
      [-3.9, 2.6, -1.3, 0.5, false],
      [-1.35, 3.2, -2.1, 0.16, false],
      [1.35, 3.2, -2.1, -0.16, true],
      [3.9, 2.6, -1.3, -0.5, true],
    ];
    const panels = defs.map(([x, y, z, ry, final], k) => ({ p: put(g, panel(2.4, 1.7, final), x, y, z, 0, ry, 0), y, k }));
    ticks.push((t) => panels.forEach((o) => (o.p.position.y = o.y + Math.sin(t * 0.9 + o.k * 1.3) * 0.12)));

    // Chispas que viajan del boceto al diseño final
    const arc = new QuadraticBezierCurve3(new Vector3(-1.35, 3.2, -2), new Vector3(0, 4.5, -1.6), new Vector3(1.35, 3.2, -2));
    const sparks = Array.from({ length: 5 }, () => put(g, new Mesh(geo(new SphereGeometry(0.08, 6, 5)), neon(C.magenta))));
    ticks.push((t) =>
      sparks.forEach((m, k) => {
        const u = (t * 0.25 + k / 5) % 1;
        arc.getPoint(u, m.position);
        m.scale.setScalar(Math.sin(u * Math.PI) + 0.01);
      }),
    );

    put(g, person(C.coral), 1.7, 0.25, 1.0, 0, Math.PI * 0.9, 0);
    const stylus = new Group();
    put(stylus, cyl(0.09, 0.09, 2.4, C.violeta, 8), 0, 1.2, 0);
    put(stylus, cone(0.09, 0.35, C.ink, 8), 0, 2.57, 0);
    put(stylus, cyl(0.1, 0.1, 0.3, C.menta, 8, 0.6), 0, 0.15, 0);
    put(g, stylus, 1.35, 0.55, 0.85, -0.55, 0, 0.25);

    const fan = new Group();
    [C.indigo, C.violeta, C.magenta, C.coral, C.ambar, C.menta].forEach((c, k) => {
      const piv = new Group();
      put(piv, box(0.55, 1.6, 0.05, c, 0.15), 0, 0.8, 0);
      put(fan, piv, 0, 0, k * 0.06, 0, 0, (k - 2.5) * 0.24);
    });
    put(g, fan, -3.4, 0.25, 2.1, 0, 0.35, 0);

    const ruler = new Group();
    put(ruler, box(2.6, 0.08, 0.36, C.ambar), 0, 0, 0);
    for (let k = 0; k < 9; k++) put(ruler, box(0.03, 0.1, k % 2 ? 0.12 : 0.2, C.maquina), -1.1 + k * 0.275, 0.01, -0.08);
    put(g, ruler, 3.0, 0.29, 2.6, 0, 0.45, 0);

    const pencil = new Group();
    put(pencil, cyl(0.16, 0.16, 2.2, C.coral, 6), 0, 0, 0);
    put(pencil, cone(0.16, 0.4, C.papel, 6), 0, 1.3, 0);
    put(pencil, cone(0.05, 0.12, C.maquina, 6), 0, 1.47, 0);
    put(g, pencil, -1.0, 0.42, 3.0, 0, 0.8, Math.PI / 2);
    return { group: g, ticks };
  }

  /* ---------- Capítulo 4 · Desarrollo: la fábrica que arma un sitio bloque a bloque */
  function desarrollo(accent: string): Piece {
    const g = island(7.2, C.isla, accent);
    const ticks: Tick[] = [];
    put(g, box(9, 0.6, 1.4, C.maquina), -0.5, 0.3, 1.9);
    put(g, box(9, 0.08, 1.2, C.roca), -0.5, 0.64, 1.9);

    const blockColors = [C.violeta, C.menta, C.magenta, C.ambar, C.coral];
    const blocks = Array.from({ length: 7 }, (_, k) => put(g, box(0.62, 0.62, 0.62, blockColors[k % blockColors.length], 0.45)));
    ticks.push((t) =>
      blocks.forEach((m, k) => {
        const u = (t * 0.07 + k / 7) % 1;
        m.position.set(-4.7 + u * 8.4, 0.99, 1.9);
        m.scale.setScalar(Math.max(0.001, Math.min(1, u * 10, (1 - u) * 10)));
        m.rotation.y = u * 1.5;
      }),
    );

    // El edificio con forma de ventana de navegador
    const bd = new Group();
    put(bd, box(3.4, 2.8, 2.6, C.papel), 0, 1.4, 0);
    put(bd, box(3.48, 0.5, 2.68, C.maquina), 0, 3.05, 0);
    [C.coral, C.ambar, C.menta].forEach((c, k) => put(bd, ball(0.1, c, 1.2, 8, 6), -1.3 + k * 0.32, 3.05, 1.36));
    [[C.violeta, C.menta, C.indigo], [C.coral, C.magenta, C.menta]].forEach((row, r) =>
      row.forEach((c, q) => put(bd, box(0.85, 0.62, 0.06, c, 0.5), -1.05 + q * 1.05, 0.75 + r * 1.0, 1.32)),
    );
    put(bd, box(0.62, 0.62, 0.62, C.violeta, 0.45), -0.9, 3.61, -0.4);
    put(bd, box(0.62, 0.62, 0.62, C.menta, 0.45), -0.25, 3.61, -0.4);
    put(g, bd, 2.6, 0, -1.6);

    const big = put(g, gear(0.85, C.violeta, 9), 4.45, 1.7, -1.4, 0, Math.PI / 2, 0);
    const small = put(g, gear(0.48, C.coral, 7), 4.45, 2.95, -0.55, 0, Math.PI / 2, 0);
    ticks.push((t) => {
      big.rotation.z = t * 0.6;
      small.rotation.z = -t * 0.6 * (9 / 7) + 0.2;
    });

    // Grúa
    put(g, box(0.32, 6, 0.32, C.ambar), -1.2, 3, -2.9);
    put(g, box(0.6, 0.5, 0.6, C.coral), -1.2, 5.8, -2.9);
    const arm = new Group();
    put(arm, box(5.2, 0.22, 0.22, C.ambar), 1.8, 0, 0);
    put(arm, box(0.7, 0.55, 0.45, C.maquina), -0.9, -0.1, 0);
    rod(arm, new Vector3(3.6, 0, 0), new Vector3(3.6, -1.7, 0), 0.025, C.gris);
    put(arm, box(0.6, 0.6, 0.6, C.menta, 0.45), 3.6, -2.0, 0);
    put(g, arm, -1.2, 6.1, -2.9);
    ticks.push((t) => (arm.rotation.y = 0.05 + Math.sin(t * 0.35) * 0.3));

    // Servidores con luces que parpadean
    const leds: MeshStandardMaterial[] = [];
    [-5.1, -4.0, -2.9].forEach((x) => {
      put(g, box(0.9, 2.2, 0.9, C.maquina), x, 1.1, -3.5);
      for (let r = 0; r < 4; r++) {
        const c = r % 2 ? C.menta : C.coral;
        const lm = new MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1.5, roughness: 0.5 });
        extraMats.push(lm);
        leds.push(lm);
        put(g, new Mesh(geo(new BoxGeometry(0.5, 0.08, 0.03)), lm), x, 0.55 + r * 0.42, -3.04);
      }
    });
    ticks.push((t) => leds.forEach((m, k) => (m.emissiveIntensity = Math.sin(t * 2.6 + k * 1.9) > 0 ? 1.8 : 0.15)));

    put(g, person(C.indigo, C.ambar), -2.7, 0, 0.2, 0, 0.5, 0);
    put(g, person(C.coral, C.ambar), 0.9, 0, 0.4, 0, -0.7, 0);
    ([[-5.5, 0.3, 0.6, C.violeta], [-5.0, 0.3, 0.2, C.menta], [-5.3, 0.9, 0.4, C.magenta]] as const).forEach(([x, y, z, c]) =>
      put(g, box(0.6, 0.6, 0.6, c, 0.3), x, y, z, 0, rnd(), 0),
    );
    return { group: g, ticks };
  }

  /* ---------- Capítulo 5 · Evolución: lanzamiento, velocidad y monitoreo */
  function evolucion(accent: string): Piece {
    const g = island(7.2, C.cesped, accent);
    const ticks: Tick[] = [];
    put(g, cyl(3.4, 4.8, 1.3, '#174B4A', 10), 0, 0.65, -0.4);
    put(g, cyl(1.7, 1.8, 0.3, C.maquina, 14), 0, 1.45, -0.4);
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      put(g, new Mesh(geo(new SphereGeometry(0.09, 6, 5)), neon(C.ambar)), Math.cos(a) * 1.55, 1.62, -0.4 + Math.sin(a) * 1.55);
    }

    const rocket = new Group();
    put(rocket, cyl(0.72, 0.8, 2.6, C.ink, 14), 0, 1.3, 0);
    put(rocket, cone(0.72, 1.3, C.coral, 14), 0, 3.25, 0);
    put(rocket, cyl(0.75, 0.75, 0.36, C.maquina, 14), 0, 2.2, 0);
    [C.coral, C.ambar, C.menta].forEach((c, k) => put(rocket, ball(0.07, c, 1.2, 6, 5), -0.2 + k * 0.2, 2.2, 0.76));
    put(rocket, new Mesh(geo(new TorusGeometry(0.28, 0.07, 6, 16)), mat(C.violeta)), 0, 1.25, 0.78);
    put(rocket, cyl(0.26, 0.26, 0.04, C.menta, 16, 1.2), 0, 1.25, 0.77, Math.PI / 2, 0, 0);
    for (let k = 0; k < 3; k++) {
      const piv = new Group();
      put(piv, box(0.12, 1, 0.75, C.violeta), 0, 0.45, 0.95);
      put(rocket, piv, 0, 0, 0, 0, (k * Math.PI * 2) / 3, 0);
    }
    const flame = new Group();
    put(flame, new Mesh(geo(new ConeGeometry(0.55, 1.5, 10)), neon(C.coral)), 0, -0.75, 0, Math.PI, 0, 0);
    put(flame, new Mesh(geo(new ConeGeometry(0.3, 1.0, 10)), neon(C.ambar)), 0, -0.5, 0, Math.PI, 0, 0);
    rocket.add(flame);
    put(g, rocket, 0, 2.9, -0.4);
    ticks.push((t) => {
      rocket.position.y = 2.9 + Math.sin(t * 0.8) * 0.3;
      rocket.rotation.y = Math.sin(t * 0.3) * 0.2;
      flame.scale.set(1, 0.85 + 0.3 * Math.abs(Math.sin(t * 12)), 1);
    });

    const puffs = ([[-1.6, 1.7, 0.1], [1.5, 1.7, -0.1], [0.2, 1.7, -2.3], [-1.0, 1.6, -2.0], [1.2, 1.65, -1.9]] as const).map(([x, y, z]) =>
      put(g, cloud(0.45, C.grisOscuro), x, y, z),
    );
    ticks.push((t) => puffs.forEach((c, k) => c.scale.setScalar(1 + Math.sin(t * 1.2 + k) * 0.08)));

    // Medidores en verde: rendimiento
    const gauge = (x: number, z: number, phase: number) => {
      const gg = new Group();
      put(gg, cyl(0.07, 0.07, 1.2, C.maquina, 6), 0, 0.6, 0);
      put(gg, cyl(0.75, 0.75, 0.12, C.ink, 20), 0, 1.6, 0, Math.PI / 2, 0, 0);
      put(gg, new Mesh(geo(new TorusGeometry(0.55, 0.07, 5, 18, Math.PI * 0.6)), neon(C.menta)), 0, 1.6, 0.08, 0, 0, Math.PI * 0.1);
      put(gg, new Mesh(geo(new TorusGeometry(0.55, 0.07, 5, 10, Math.PI * 0.25)), neon(C.coral)), 0, 1.6, 0.08, 0, 0, Math.PI * 0.7);
      const needle = new Group();
      put(needle, box(0.06, 0.5, 0.04, C.maquina), 0, 0.25, 0);
      put(gg, needle, 0, 1.6, 0.12);
      put(gg, ball(0.07, C.maquina, 0, 6, 5), 0, 1.6, 0.13);
      put(g, gg, x, 0, z, 0, x > 0 ? -0.3 : 0.3, 0);
      ticks.push((t) => (needle.rotation.z = -0.35 + Math.sin(t * 1.3 + phase) * 0.12));
    };
    gauge(-2.4, 3.6, 0);
    gauge(2.4, 3.6, 1.7);

    put(g, cyl(0.4, 0.5, 1, '#A78BFF', 8), -4.6, 0.5, 1.0);
    put(g, magnifier(0.7), -4.6, 2.55, 1.0, 0, 0.6, 0);

    const plats = ([[5.6, 4.4, -2.6], [-5.2, 5.4, -3.2]] as const).map(([x, y, z], k) => {
      const pg = new Group();
      pg.add(cloud(0.9));
      put(pg, box(0.6, 1, 0.6, C.maquina), 0, 0.95, 0);
      put(pg, box(0.4, 0.06, 0.02, C.menta, 1.8), 0, 1.1, 0.31);
      put(g, pg, x, y, z);
      return { pg, y, k };
    });
    ticks.push((t) => plats.forEach(({ pg, y, k }) => (pg.position.y = y + Math.sin(t * 0.7 + k * 2) * 0.25)));

    const tree = (x: number, z: number, s: number) => {
      put(g, cyl(0.12, 0.16, 1, C.tronco, 6), x, 0.5, z);
      put(g, ball(0.7 * s, C.hoja, 0, 8, 6), x, 1.3 * s + 0.3, z);
    };
    tree(5.2, 2.4, 1);
    tree(-5.0, -2.2, 1.1);
    tree(3.6, -4.6, 0.9);
    tree(-3.2, 4.6, 0.8);
    return { group: g, ticks };
  }

  /* ---------- Capítulo 6 · Tu proyecto: el portátil y el monograma ZK oficial */
  function proyecto(accent: string): Piece {
    const g = new Group();
    const ticks: Tick[] = [];
    // Plataforma flotante para cerrar la serie de islas
    put(g, cyl(5.4, 5.0, 0.4, C.ladera, 24), 0, -0.2, 0);
    put(g, cone(5.0, 4.5, C.roca, 24), 0, -2.65, 0, Math.PI, 0, 0);
    put(g, new Mesh(geo(new TorusGeometry(5.4, 0.05, 6, 96)), neon(accent)), 0, 0.01, 0, Math.PI / 2, 0, 0);

    const lap = new Group();
    put(lap, box(6.4, 0.32, 4.3, C.maquina), 0, 0, 0);
    for (let r = 0; r < 4; r++) for (let q = 0; q < 12; q++) put(lap, box(0.38, 0.06, 0.36, C.ladera), -2.53 + q * 0.46, 0.18, -1.5 + r * 0.46);
    put(lap, box(1.7, 0.04, 1.05, C.ladera), 0, 0.17, 1.2);
    const lid = new Group();
    put(lid, box(6.4, 4.3, 0.22, C.maquina), 0, 2.15, 0);
    put(lid, box(6.0, 3.9, 0.04, '#141A4A', 0.4), 0, 2.15, 0.12);
    const z = 0.16;
    put(lid, box(5.6, 0.38, 0.03, C.violeta, 0.9), 0, 3.75, z);
    put(lid, box(2.5, 1.7, 0.03, C.magenta, 0.7), -1.45, 2.55, z);
    ([[2.3, 3.25], [1.9, 2.85], [2.1, 2.45]] as const).forEach(([w, y]) => put(lid, box(w, 0.2, 0.03, C.papel, 0.5), 0.4 + w / 2, y, z));
    put(lid, box(1.15, 0.4, 0.03, C.menta, 1.0), 0.98, 1.85, z);
    [-1.9, 0, 1.9].forEach((x) => put(lid, box(1.65, 0.6, 0.03, C.grisOscuro, 0.6), x, 0.85, z));
    put(lap, lid, 0, 0.16, -2.1, -0.26, 0, 0);
    put(g, lap, 0, 0.6, 0);

    // Monograma ZK extruido, flotando sobre el portátil
    const shapes = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${MONOGRAM_PATH}"/></svg>`).paths.flatMap((p) => p.toShapes());
    const zk = geo(new ExtrudeGeometry(shapes, { depth: 60, bevelEnabled: true, bevelThickness: 4, bevelSize: 1.2, bevelSegments: 2, curveSegments: 24 }));
    zk.center();
    const dims = new Box3().setFromBufferAttribute(zk.attributes.position as never).getSize(new Vector3());
    const s = 3.6 / dims.x;
    const zkMat = new MeshStandardMaterial({ color: C.menta, roughness: 0.35, metalness: 0.15, emissive: C.menta, emissiveIntensity: 0.35 });
    extraMats.push(zkMat);
    const mono = new Mesh(zk, zkMat);
    mono.scale.set(s, -s, s); // el eje Y del SVG apunta hacia abajo
    const monoPivot = put(g, new Group(), 0, 7.2, -0.6);
    monoPivot.add(mono);
    ticks.push((t) => {
      monoPivot.rotation.y = Math.sin(t * 0.45) * 0.45;
      monoPivot.position.y = 7.2 + Math.sin(t * 0.8) * 0.18;
      lap.position.y = 0.6 + Math.sin(t * 0.7 + 1) * 0.08;
    });

    // Piezas que orbitan: engranaje, flecha de crecimiento, cohete, nube y un bloque
    const arrow = new Group();
    put(arrow, cyl(0.14, 0.14, 1.1, C.menta, 8), 0, 0, 0);
    put(arrow, cone(0.32, 0.55, C.menta, 8), 0, 0.82, 0);
    const mini = new Group();
    put(mini, cyl(0.28, 0.32, 1, C.ink, 10), 0, 0, 0);
    put(mini, cone(0.28, 0.5, C.coral, 10), 0, 0.75, 0);
    put(mini, new Mesh(geo(new ConeGeometry(0.22, 0.5, 8)), neon(C.ambar)), 0, -0.7, 0, Math.PI, 0, 0);
    const orbit: { o: Object3D; r: number; h: number; ph: number }[] = [
      { o: gear(0.55, C.violeta, 8), r: 6.2, h: 3.4, ph: 0 },
      { o: arrow, r: 6.6, h: 2.2, ph: 1.3 },
      { o: mini, r: 6.0, h: 4.6, ph: 2.6 },
      { o: cloud(0.45, C.grisOscuro), r: 6.8, h: 1.4, ph: 3.9 },
      { o: box(0.6, 0.6, 0.6, C.magenta, 0.45), r: 6.3, h: 5.2, ph: 5.1 },
    ];
    orbit.forEach(({ o }) => g.add(o));
    ticks.push((t) =>
      orbit.forEach(({ o, r, h, ph }, k) => {
        const a = t * 0.2 + ph;
        o.position.set(Math.cos(a) * r, h + Math.sin(t * 0.9 + k) * 0.3, Math.sin(a) * r * 0.7);
        o.rotation.y = t * 0.6 + k;
        o.rotation.z = Math.sin(t * 0.5 + k) * 0.3;
      }),
    );
    return { group: g, ticks };
  }

  /* ---------- Recorrido: dónde está cada isla y desde dónde la mira la cámara */
  const BUILDERS = [origen, estrategia, diseno, desarrollo, evolucion, proyecto];
  const SPOTS: { at: [number, number, number]; close: [number, number, number]; focus: [number, number, number] }[] = [
    { at: [0, 0, 0], close: [4.6, 5.4, 13], focus: [0, 1.4, 2.0] },
    { at: [28, -2, -24], close: [1.5, 4.6, 10.5], focus: [0, 2.0, -2.0] },
    { at: [2, 1, -50], close: [0, 4.2, 10.5], focus: [0, 2.6, -1.2] },
    { at: [-26, -1, -74], close: [3, 5.5, 13], focus: [0.5, 1.8, -0.5] },
    { at: [0, 0, -100], close: [2.5, 5.5, 14], focus: [0, 3.8, 0] },
    { at: [24, 3, -124], close: [0, 5.5, 17], focus: [0, 4.4, 0] },
  ];
  const count = Math.min(BUILDERS.length, SPOTS.length, Math.max(1, chapters.length || BUILDERS.length));
  const FAR = new Vector3(0, 16, 27);
  const v = (a: [number, number, number]) => new Vector3(a[0], a[1], a[2]);

  const keyPos: Vector3[] = [];
  const keyTgt: Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const at = v(SPOTS[i].at);
    const close = at.clone().add(v(SPOTS[i].close));
    const closeT = at.clone().add(v(SPOTS[i].focus));
    keyPos.push(at.clone().add(FAR), close);
    keyTgt.push(at.clone().add(new Vector3(0, 0.5, 0)), closeT);
    if (i + 1 < count) {
      const next = v(SPOTS[i + 1].at);
      // Entre islas la cámara sube por encima del hilo de datos y mira hacia la siguiente
      keyPos.push(close.clone().lerp(next.clone().add(FAR), 0.5).add(new Vector3(0, 9, 0)));
      keyTgt.push(closeT.clone().lerp(next, 0.6));
    }
  }
  const posCurve = new CatmullRomCurve3(keyPos, false, 'centripetal');
  const tgtCurve = new CatmullRomCurve3(keyTgt, false, 'centripetal');
  const lastKey = keyPos.length - 1;

  /* ---------- Montaje (en el primer cuadro, cuando ya existe el renderer) */
  const pieces: { group: Group; base: Vector3; ticks: Tick[]; fill: PointLight; fillIntensity: number }[] = [];
  const packets: { mesh: Mesh; curve: QuadraticBezierCurve3; offset: number }[] = [];
  const clouds: Group[] = [];
  let starGeo: BufferGeometry | null = null;
  let ready = false;

  function build(stage: Stage) {
    const { scene, camera } = stage;
    camera.far = 320;
    camera.updateProjectionMatrix();
    scene.fog = new Fog(C.noche, 38, 118);

    scene.add(new HemisphereLight('#7C79FF', C.noche, 1.5));
    scene.add(new AmbientLight('#ffffff', 0.25));
    const moon = new DirectionalLight('#CFD1FF', 1.7);
    moon.position.set(-10, 20, 12);
    scene.add(moon);

    for (let i = 0; i < count; i++) {
      const accent = BRAND_GRADIENT[i % BRAND_GRADIENT.length];
      const piece = BUILDERS[i](accent);
      const base = v(SPOTS[i].at);
      piece.group.position.copy(base);
      scene.add(piece.group);
      // Luz de relleno de cada isla, teñida con su color
      const fill = new PointLight(new Color(accent).lerp(new Color('#ffffff'), 0.55), 70, 26, 1.3);
      fill.position.copy(base).add(new Vector3(1.5, 8, 6));
      scene.add(fill);
      pieces.push({ group: piece.group, base, ticks: piece.ticks, fill, fillIntensity: fill.intensity });
    }

    // Hilo de datos entre islas: puntos con el gradiente oficial y paquetes que viajan
    const PER = 42;
    const dotGeo = geo(new SphereGeometry(0.075, 6, 4));
    const dotMat = new MeshBasicMaterial({ color: '#ffffff', toneMapped: false });
    extraMats.push(dotMat);
    const dots = new InstancedMesh(dotGeo, dotMat, Math.max(1, (count - 1) * PER));
    const m4 = new Matrix4();
    const col = new Color();
    let di = 0;
    for (let i = 0; i + 1 < count; i++) {
      const a = v(SPOTS[i].at);
      const b = v(SPOTS[i + 1].at);
      const dir = new Vector3(b.x - a.x, 0, b.z - a.z).normalize();
      const start = a.clone().addScaledVector(dir, 7.4).add(new Vector3(0, -0.6, 0));
      const end = b.clone().addScaledVector(dir, -7.4).add(new Vector3(0, -0.6, 0));
      const mid = start.clone().lerp(end, 0.5).add(new Vector3(0, 7, 0));
      const curve = new QuadraticBezierCurve3(start, mid, end);
      const c0 = new Color(BRAND_GRADIENT[i]);
      const c1 = new Color(BRAND_GRADIENT[(i + 1) % BRAND_GRADIENT.length]);
      for (let k = 0; k < PER; k++) {
        const u = k / (PER - 1);
        const p = curve.getPoint(u);
        m4.makeTranslation(p.x, p.y, p.z);
        dots.setMatrixAt(di, m4);
        dots.setColorAt(di, col.copy(c0).lerp(c1, u));
        di++;
      }
      for (let j = 0; j < 2; j++) {
        const pm = new Mesh(geo(new SphereGeometry(0.2, 8, 6)), neon(BRAND_GRADIENT[(i + 1) % BRAND_GRADIENT.length]));
        scene.add(pm);
        packets.push({ mesh: pm, curve, offset: j * 0.5 + i * 0.13 });
      }
    }
    dots.instanceMatrix.needsUpdate = true;
    if (dots.instanceColor) dots.instanceColor.needsUpdate = true;
    scene.add(dots);

    // Nubes a la deriva entre las islas
    for (let k = 0, tries = 0; k < 16 && tries < 200; tries++) {
      const p = new Vector3(-45 + rnd() * 100, -9 + rnd() * 20, 18 - rnd() * 160);
      if (SPOTS.slice(0, count).some((sp) => Math.hypot(p.x - sp.at[0], p.z - sp.at[2]) < 12)) continue;
      const c = cloud(0.8 + rnd() * 1.4, C.nube);
      c.position.copy(p);
      scene.add(c);
      clouds.push(c);
      k++;
    }

    // Estrellas
    const N = 900;
    const pos = new Float32Array(N * 3);
    for (let k = 0; k < N; k++) {
      const theta = rnd() * Math.PI * 2;
      const phi = Math.acos(1 - rnd() * 1.6);
      const r = 220 + rnd() * 60;
      pos[k * 3] = Math.sin(phi) * Math.cos(theta) * r;
      pos[k * 3 + 1] = Math.cos(phi) * r - 40;
      pos[k * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r - 60;
    }
    starGeo = new BufferGeometry();
    starGeo.setAttribute('position', new Float32BufferAttribute(pos, 3));
    const starMat = new PointsMaterial({ color: '#C9CCFF', size: 1.6, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.75 });
    extraMats.push(starMat);
    scene.add(new Points(starGeo, starMat));

    ready = true;
  }

  /* ---------- Cámara */
  const VISIBLE_RANGE = 125; // un poco más que el final de la niebla (118)
  let key: number | null = null;
  let drift = 0;
  const cp = new Vector3();
  const ct = new Vector3();
  const fwd = new Vector3();
  const right = new Vector3();

  return createStage(host, { ...opts, fov: 40, z: 20 }, {
    update(t, dt, stage) {
      if (!ready) build(stage);
      const { camera, pointer } = stage;

      const pos = chapters.length ? readStory(chapters) : { index: 0, s: 0 };
      const target = Math.min(lastKey, chapterKey(Math.min(pos.index, count - 1), pos.s, count));
      const targetDrift = holdDrift(pos.index, pos.s, count);
      const a = 1 - Math.pow(1 - 0.16, Math.max(dt, 0) * 60);
      if (key === null || opts.reduced) {
        key = target;
        drift = targetDrift;
      } else {
        key += (target - key) * a;
        drift += (targetDrift - drift) * a;
      }

      const u = Math.min(1, Math.max(0, key / Math.max(1, lastKey)));
      posCurve.getPoint(u, cp);
      tgtCurve.getPoint(u, ct);
      // Mientras se lee el capítulo la cámara se desliza un poco de lado; el puntero suma un leve paralaje
      fwd.subVectors(ct, cp).normalize();
      right.crossVectors(fwd, camera.up).normalize();
      cp.addScaledVector(right, drift * 1.1 + pointer.x * 0.5);
      cp.y += drift * 0.3 + pointer.y * 0.3;
      camera.position.copy(cp);
      camera.lookAt(ct);

      /* Más allá de la niebla no se ve nada: las islas lejanas no se dibujan ni se animan,
         y su luz se apaga (sin recompilar shaders). Normalmente quedan 2–3 islas activas. */
      pieces.forEach((p, i) => {
        const near = p.base.distanceTo(camera.position) < VISIBLE_RANGE;
        p.group.visible = near;
        p.fill.intensity = near ? p.fillIntensity : 0;
        if (!near) return;
        p.group.position.y = p.base.y + Math.sin(t * 0.5 + i * 1.7) * 0.22;
        p.ticks.forEach((f) => f(t));
      });
      packets.forEach((p) => {
        p.curve.getPoint(0.04 + ((t * 0.08 + p.offset) % 1) * 0.92, p.mesh.position);
        p.mesh.visible = p.mesh.position.distanceTo(camera.position) < VISIBLE_RANGE;
      });
      clouds.forEach((c, k) => {
        c.position.x += dt * (0.25 + (k % 3) * 0.1);
        if (c.position.x > 60) c.position.x = -50;
        c.visible = c.position.distanceTo(camera.position) < VISIBLE_RANGE;
      });
    },
    resize(stage) {
      const { camera, size } = stage;
      const aspect = size.w / size.h;
      camera.fov = aspect < 1 ? 55 : aspect < 1.3 ? 46 : 40;
      // En escritorio la tarjeta va a la izquierda: el centro de la escena se corre a la derecha
      if (size.w >= 861) camera.setViewOffset(size.w, size.h, -size.w * 0.15, 0, size.w, size.h);
      else camera.clearViewOffset();
      camera.updateProjectionMatrix();
    },
    dispose() {
      geos.forEach((g) => g.dispose());
      starGeo?.dispose();
      mats.forEach((m) => m.dispose());
      neons.forEach((m) => m.dispose());
      extraMats.forEach((m) => m.dispose());
    },
  });
};

export default world;

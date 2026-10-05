/* Escena «Red de nodos» — Servicios.
   Una constelación de nodos conectados (conexión, tecnología) con pulsos de datos
   que viajan por las conexiones. Rota con el puntero y se reorganiza con el scroll. */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  LineBasicMaterial,
  LineSegments,
  Points,
  ShaderMaterial,
  Vector3,
} from 'three';
import { createStage } from './base';
import type { SceneFactory } from './types';

const pointVertex = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float pulse = 0.75 + 0.25 * sin(uTime * 1.6 + aPhase);
    gl_PointSize = aSize * pulse * uPixelRatio * (10.0 / -mv.z);
    vColor = aColor;
    vAlpha = smoothstep(-14.0, -6.0, mv.z);
  }
`;
const pointFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.22, 0.0, d);
    float halo = smoothstep(0.5, 0.0, d) * 0.35;
    gl_FragColor = vec4(vColor, (core + halo) * vAlpha);
    #include <colorspace_fragment>
  }
`;

const network: SceneFactory = (host, opts) => {
  const small = window.innerWidth < 720;
  const N = small ? 90 : 160;
  const RADIUS = 4.2;
  const MAX_DIST = small ? 1.9 : 1.6;

  const menta = new Color('#89FACE');
  const violeta = new Color('#6902FC');
  const magenta = new Color('#FB1195');
  const indigo = new Color('#1E02FB');

  // Nodos en una esfera de Fibonacci con ruido, para que la red se vea orgánica
  const nodes: Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    const jitter = 0.78 + Math.random() * 0.34;
    nodes.push(new Vector3(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(RADIUS * jitter));
  }

  // Colores y tamaños
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const size = new Float32Array(N);
  const phase = new Float32Array(N);
  nodes.forEach((v, i) => {
    v.toArray(pos, i * 3);
    const t = (v.y / RADIUS + 1) / 2;
    const c = t > 0.5 ? violeta.clone().lerp(menta, (t - 0.5) * 2) : indigo.clone().lerp(violeta, t * 2);
    if (Math.random() < 0.08) c.copy(magenta);
    c.toArray(col, i * 3);
    size[i] = 2 + Math.random() * 4 + (Math.random() < 0.1 ? 5 : 0);
    phase[i] = Math.random() * Math.PI * 2;
  });

  // Conexiones
  const edges: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      if (nodes[i].distanceTo(nodes[j]) < MAX_DIST) edges.push([i, j]);
    }
  }
  const linePos = new Float32Array(edges.length * 6);
  const lineCol = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], k) => {
    nodes[a].toArray(linePos, k * 6);
    nodes[b].toArray(linePos, k * 6 + 3);
    col.slice(a * 3, a * 3 + 3).forEach((v, n) => (lineCol[k * 6 + n] = v * 0.55));
    col.slice(b * 3, b * 3 + 3).forEach((v, n) => (lineCol[k * 6 + 3 + n] = v * 0.55));
  });

  const lineGeo = new BufferGeometry();
  lineGeo.setAttribute('position', new BufferAttribute(linePos, 3));
  lineGeo.setAttribute('color', new BufferAttribute(lineCol, 3));
  const lineMat = new LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.55, blending: AdditiveBlending, depthWrite: false });
  const lines = new LineSegments(lineGeo, lineMat);

  const nodeGeo = new BufferGeometry();
  nodeGeo.setAttribute('position', new BufferAttribute(pos, 3));
  nodeGeo.setAttribute('aColor', new BufferAttribute(col, 3));
  nodeGeo.setAttribute('aSize', new BufferAttribute(size, 1));
  nodeGeo.setAttribute('aPhase', new BufferAttribute(phase, 1));
  const nodeMat = new ShaderMaterial({
    vertexShader: pointVertex,
    fragmentShader: pointFragment,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.75) } },
  });
  const points = new Points(nodeGeo, nodeMat);

  // Pulsos de datos viajando por las conexiones
  const PULSES = Math.min(small ? 40 : 80, edges.length);
  const pulses = Array.from({ length: PULSES }, () => ({
    edge: Math.floor(Math.random() * edges.length),
    t: Math.random(),
    speed: 0.25 + Math.random() * 0.5,
  }));
  const pulsePos = new Float32Array(PULSES * 3);
  const pulseCol = new Float32Array(PULSES * 3);
  const pulseSize = new Float32Array(PULSES).fill(5);
  const pulsePhase = new Float32Array(PULSES);
  for (let i = 0; i < PULSES; i++) menta.toArray(pulseCol, i * 3);
  const pulseGeo = new BufferGeometry();
  pulseGeo.setAttribute('position', new BufferAttribute(pulsePos, 3));
  pulseGeo.setAttribute('aColor', new BufferAttribute(pulseCol, 3));
  pulseGeo.setAttribute('aSize', new BufferAttribute(pulseSize, 1));
  pulseGeo.setAttribute('aPhase', new BufferAttribute(pulsePhase, 1));
  const pulsePoints = new Points(pulseGeo, nodeMat);
  pulsePoints.frustumCulled = false;

  const group = new Group();
  group.add(lines, points, pulsePoints);
  const tmp = new Vector3();

  return createStage(host, { ...opts, fov: 42, z: 12 }, {
    update(t, dt, stage) {
      if (!stage.scene.children.includes(group)) stage.scene.add(group);
      nodeMat.uniforms.uTime.value = t;

      for (let i = 0; i < PULSES; i++) {
        const p = pulses[i];
        p.t += dt * p.speed;
        if (p.t >= 1) {
          p.t = 0;
          p.edge = Math.floor(Math.random() * edges.length);
        }
        const [a, b] = edges[p.edge];
        tmp.lerpVectors(nodes[a], nodes[b], p.t).toArray(pulsePos, i * 3);
      }
      pulseGeo.attributes.position.needsUpdate = true;

      const pr = stage.progress.value;
      group.rotation.y = t * 0.06 + stage.pointer.x * 0.35 + pr * 1.2;
      group.rotation.x = -0.2 + stage.pointer.y * 0.2 + pr * 0.3;
      const s = 1 + pr * 0.35;
      group.scale.setScalar(s);
    },
    resize(stage) {
      const aspect = stage.size.w / stage.size.h;
      const centered = host.dataset.center !== undefined;
      group.position.x = centered ? 0 : aspect > 1.2 ? 3.6 : 0;
      group.position.y = centered ? 0 : aspect > 1.2 ? 0 : 1.5;
      if (centered) stage.camera.position.z = aspect < 1 ? 14 / aspect * 0.75 : 12;
      stage.camera.updateProjectionMatrix();
    },
    dispose() {
      lineGeo.dispose();
      nodeGeo.dispose();
      pulseGeo.dispose();
      lineMat.dispose();
      nodeMat.dispose();
    },
  });
};

export default network;

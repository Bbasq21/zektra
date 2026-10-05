/* Escena «Flujo de luz» — Inicio.
   Cintas de partículas que recorren el gradiente oficial (Índigo → Menta),
   el «flujo de ideas, datos y energía» del manual. Reaccionan al puntero y al scroll. */
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Group, Points, ShaderMaterial } from 'three';
import { BRAND_GRADIENT, createStage } from './base';
import type { SceneFactory } from './types';

const vertex = /* glsl */ `
  attribute float aU;
  attribute float aLane;
  attribute float aSeed;
  attribute float aOffset;
  uniform float uTime;
  uniform float uWidth;
  uniform float uProgress;
  uniform vec2 uPointer;
  uniform float uPixelRatio;
  uniform vec3 uColors[6];
  varying vec3 vColor;
  varying float vAlpha;

  vec3 gradient(float t) {
    t = clamp(t, 0.0, 1.0) * 5.0;
    float i = floor(t);
    float f = smoothstep(0.0, 1.0, fract(t));
    vec3 a = uColors[0]; vec3 b = uColors[1];
    if (i >= 1.0) { a = uColors[1]; b = uColors[2]; }
    if (i >= 2.0) { a = uColors[2]; b = uColors[3]; }
    if (i >= 3.0) { a = uColors[3]; b = uColors[4]; }
    if (i >= 4.0) { a = uColors[4]; b = uColors[5]; }
    if (i >= 5.0) { a = uColors[5]; b = uColors[5]; }
    return mix(a, b, f);
  }

  void main() {
    float speed = 0.018 + aSeed * 0.012;
    float u = fract(aU + uTime * speed);
    float x = (u - 0.5) * uWidth;
    float lane = aLane;
    float t = uTime;

    float y = sin(x * 0.32 + t * 0.35 + lane * 1.7) * 1.1
            + sin(x * 0.85 - t * 0.22 + lane * 2.3) * 0.35
            + (lane - 2.0) * 0.38;

    float breathe = 0.55 + 0.45 * sin(x * 0.55 + t * 0.6 + lane * 1.1);
    float spread = 0.42 + uProgress * 1.4;
    y += aOffset * spread * breathe;
    float z = (lane - 2.0) * 0.55 + aOffset * cos(x * 0.4 + t * 0.4) * 0.9;

    float px = uPointer.x * uWidth * 0.32;
    float influence = exp(-pow(x - px, 2.0) / 6.0);
    y += uPointer.y * 1.4 * influence;
    z += influence * 0.8;

    vec4 mv = modelViewMatrix * vec4(x, y, z, 1.0);
    gl_Position = projectionMatrix * mv;

    float edge = smoothstep(0.0, 0.12, u) * (1.0 - smoothstep(0.86, 1.0, u));
    vAlpha = edge * (0.35 + 0.65 * aSeed) * (1.0 - uProgress * 0.65);
    vColor = gradient(u + (aSeed - 0.5) * 0.08);
    gl_PointSize = (1.4 + aSeed * 2.6 + influence * 2.0) * uPixelRatio * (9.0 / -mv.z);
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * vAlpha);
    #include <colorspace_fragment>
  }
`;

const flow: SceneFactory = (host, opts) => {
  const small = window.innerWidth < 720;
  const LANES = 5;
  const PER_LANE = small ? 1400 : 3200;
  const count = LANES * PER_LANE;

  const geometry = new BufferGeometry();
  const position = new Float32Array(count * 3);
  const aU = new Float32Array(count);
  const aLane = new Float32Array(count);
  const aSeed = new Float32Array(count);
  const aOffset = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    aLane[i] = Math.floor(i / PER_LANE);
    aU[i] = Math.random();
    aSeed[i] = Math.random();
    const g = (Math.random() + Math.random() + Math.random()) / 3 - 0.5;
    aOffset[i] = g * 2;
  }
  geometry.setAttribute('position', new BufferAttribute(position, 3));
  geometry.setAttribute('aU', new BufferAttribute(aU, 1));
  geometry.setAttribute('aLane', new BufferAttribute(aLane, 1));
  geometry.setAttribute('aSeed', new BufferAttribute(aSeed, 1));
  geometry.setAttribute('aOffset', new BufferAttribute(aOffset, 1));

  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uWidth: { value: 22 },
      uProgress: { value: 0 },
      uPointer: { value: { x: 0, y: 0 } },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.75) },
      uColors: { value: BRAND_GRADIENT.map((c) => new Color(c)) },
    },
  });

  const points = new Points(geometry, material);
  points.frustumCulled = false;
  const group = new Group();
  group.add(points);
  group.rotation.z = 0.32;

  return createStage(host, { ...opts, fov: 40, z: 11 }, {
    update(t, _dt, stage) {
      if (!stage.scene.children.includes(group)) stage.scene.add(group);
      material.uniforms.uTime.value = t;
      material.uniforms.uProgress.value = stage.progress.value;
      material.uniforms.uPointer.value = { x: stage.pointer.x, y: stage.pointer.y };
      group.rotation.x = stage.pointer.y * 0.12;
      group.rotation.y = stage.pointer.x * 0.18 + stage.progress.value * 0.4;

    },
    resize(stage) {
      const aspect = stage.size.w / stage.size.h;
      const visH = 2 * stage.camera.position.z * Math.tan((stage.camera.fov * Math.PI) / 360);
      const visW = visH * aspect;
      const wide = aspect > 1.2;
      material.uniforms.uWidth.value = wide ? visW * 1.05 : visH * 1.1;
      group.position.x = wide ? visW * 0.1 : 0;
      group.position.y = 0;
      group.rotation.z = wide ? 0.32 : 1.1;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  });
};

export default flow;

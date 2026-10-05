/* Escena «Monograma ZK» — Nosotros.
   El trazo oficial del monograma extruido en 3D, en Menta, iluminado por luces
   con los colores de la paleta que orbitan a su alrededor. Sigue al puntero. */
import {
  AmbientLight,
  Box3,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  PMREMGenerator,
  PointLight,
  Vector3,
} from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { MONOGRAM_PATH } from '../../data/monogram';
import { createStage } from './base';
import type { SceneFactory } from './types';

const monogram: SceneFactory = (host, opts) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${MONOGRAM_PATH}"/></svg>`;
  const data = new SVGLoader().parse(svg);
  const shapes = data.paths.flatMap((p) => p.toShapes());

  const geometry = new ExtrudeGeometry(shapes, {
    depth: 60,
    bevelEnabled: true,
    bevelThickness: 4,
    bevelSize: 1.2,
    bevelSegments: 3,
    curveSegments: 48,
  });
  geometry.center();
  const box = new Box3().setFromBufferAttribute(geometry.attributes.position as never);
  const dims = box.getSize(new Vector3());
  const scale = 4.6 / dims.x;

  const material = new MeshPhysicalMaterial({
    color: new Color('#89FACE'),
    metalness: 0.25,
    roughness: 0.32,
    clearcoat: 0.5,
    clearcoatRoughness: 0.25,
    iridescence: 0.15,
    iridescenceIOR: 1.4,
    envMapIntensity: 0.18,
  });

  const mesh = new Mesh(geometry, material);
  mesh.scale.set(scale, -scale, scale); // el eje Y del SVG apunta hacia abajo

  const group = new Group();
  group.add(mesh);

  const lights = [
    { light: new PointLight('#6902FC', 120, 0, 1.6), r: 5.5, speed: 0.45, phase: 0, y: 2 },
    { light: new PointLight('#FB1195', 120, 0, 1.6), r: 6, speed: -0.35, phase: 2.1, y: -1.5 },
    { light: new PointLight('#FEB616', 60, 0, 1.6), r: 5, speed: 0.3, phase: 4.2, y: 0.5 },
    { light: new PointLight('#1E02FB', 120, 0, 1.6), r: 6.5, speed: -0.5, phase: 1.1, y: 3 },
  ];

  let envReady = false;
  let baseY = 0;

  return createStage(host, { ...opts, fov: 35, z: 13 }, {
    update(t, _dt, stage) {
      const { scene, renderer, pointer, progress } = stage;
      if (!envReady) {
        const pmrem = new PMREMGenerator(renderer);
        scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        pmrem.dispose();
        scene.add(group, new AmbientLight('#ffffff', 0.15));
        const key = new DirectionalLight('#ffffff', 0.55);
        key.position.set(-4, 6, 8);
        scene.add(key);
        lights.forEach((l) => scene.add(l.light));
        envReady = true;
      }

      lights.forEach((l) => {
        const a = t * l.speed + l.phase;
        l.light.position.set(Math.cos(a) * l.r, l.y + Math.sin(t * 0.5 + l.phase) * 0.8, Math.sin(a) * l.r * 0.5 - 1.5);
      });

      group.rotation.y = -0.35 + pointer.x * 0.5 + Math.sin(t * 0.4) * 0.08 + progress.value * 1.4;
      group.rotation.x = 0.12 - pointer.y * 0.35 + Math.cos(t * 0.35) * 0.05;
      group.position.y = baseY + Math.sin(t * 0.8) * 0.12 + progress.value * 1.2;
    },
    resize(stage) {
      const aspect = stage.size.w / stage.size.h;
      const visH = 2 * stage.camera.position.z * Math.tan((stage.camera.fov * Math.PI) / 360);
      const visW = visH * aspect;
      const wide = aspect > 1.2;
      group.position.x = wide ? visW * 0.25 : 0;
      group.scale.setScalar(wide ? 1 : 0.62);
      baseY = wide ? 0 : visH * 0.3;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  });
};

export default monogram;

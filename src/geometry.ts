import * as THREE from 'three';

const points = [
  [68.5, 0, 185.5],
  [1, 50, 252.5],
  [270.9, 25, 281.9],
  [345.5, 100, 212.8],
  [178, 50, 155.7],
  [240.3, 0, 72.3],
  [153.4, 25, 0.6],
  [52.6, 0, 53.3],
  [68.5, 0, 185.5]
];

const SCALING_MULTIPLIER = 1;

const vertices = points.map(([x, y, z]) => new THREE.Vector3(x, y, z));

export const path = new THREE.CatmullRomCurve3(vertices);

export const geometry = new THREE.TubeGeometry(path, 300, 4, 32, true);

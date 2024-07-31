import * as THREE from 'three';
import { Font } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

export default (
  font: Font,
  text: string,
  position: THREE.Vector3,
  {
    x: offsetX = 0,
    y: offsetY = 0,
    z: offsetZ = 0
  }: {
    x?: number;
    y?: number;
    z?: number;
  } = {}
) => {
  const geometry = new TextGeometry(text, {
    font: font,
    size: 0.5,
    height: 0.1
  });

  const material = new THREE.MeshPhongMaterial({
    color: 0xF3FFE2,
    specular: 0xffffff,
    shininess: 250,
    lightMap: null,
    lightMapIntensity: 1,
    bumpMap: null,
    bumpScale: 0.1,
    normalMap: null,
    displacementMap: null,
    displacementScale: 0.1,
    displacementBias: 0,
    specularMap: null
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = position.x + offsetX;
  mesh.position.y = position.y + offsetY;
  mesh.position.z = position.z + offsetZ;
  return mesh;
};

import * as THREE from 'three';

import metallic from 'url:./metallictest.jpg';
const textureLoader = new THREE.TextureLoader();

export const loadTexture = (textureURL: string): Promise<THREE.Texture> => {
  return new Promise((resolve) => {
    textureLoader.load(textureURL, (texture) => {
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(20, 20);
      resolve(texture);
    });
  });
};

const loadTextures = async (): Promise<THREE.Texture[]> => Promise.all([
  loadTexture(metallic),

]);

export default loadTextures;

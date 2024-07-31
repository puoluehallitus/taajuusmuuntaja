import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import loadFont from "./loadFont";
import loadMusic from "./loadMusic";
import loadTextures from "./loadTextures";
import { geometry, path } from "./geometry";
import getText from "./getText";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const textureLoader = new THREE.TextureLoader();

function createGear(radius: number, teeth: number, toothDepth: number) {
  const shape = new THREE.Shape();
  const angleStep = Math.PI / teeth;
  for (let i = 0; i < teeth * 2; i++) {
    const angle = i * angleStep;
    const r = i % 2 === 0 ? radius + toothDepth : radius;
    shape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  shape.closePath();

  const extrudeSettings = {
    steps: 1,
    depth: 2,
    bevelEnabled: true,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  return geometry;
}
const controls = new OrbitControls(camera, renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(50, 50, 50).normalize();
const light2 = new THREE.DirectionalLight(0xffffff, 5);
light2.position.set(-15, -50, -50);

scene.add(light);
scene.add(light2);
let velocity = 0;
const gravity = -0.02;
const bounceFactor = 0.7;
camera.position.z = 15;
camera.position.y = 10;

(async function () {
  document.body.appendChild(renderer.domElement);
  const textures = await loadTextures();
  const texture = textures[0]
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    metalness: 0.7,
    roughness: 0.2,
    color: 0x888888,
    envMapIntensity: 1.0,
  });
  const gear = new THREE.Mesh(createGear(5, 20, 1), material);
  scene.add(gear);
  camera.position.z = 20;
  const { listener, sound } = await loadMusic();
  camera.add(listener);
  gear.position.y = 20;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    gear.rotation.z += 0.01;
    // Update velocity and position
    velocity += gravity;
    gear.position.y += velocity;

    // Check for collision with the ground
    if (gear.position.y - 1 < 0) {
      gear.position.y = 1; // Reset position
      velocity = -velocity * bounceFactor; // Reverse and reduce velocity
    }

    controls.update();
    renderer.render(scene, camera);
  }

  // Start animation

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  renderer.domElement.addEventListener("click", () => {
    (window as any).electronAPI?.toggleFullscreen?.();
    if (!sound.isPlaying) {
      sound.play();
      animate();

    }

  });

  const maxTime = sound.buffer?.duration ?? 100;
  sound.onEnded = () => {};
})();

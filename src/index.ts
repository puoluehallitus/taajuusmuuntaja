import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

import loadFont from "./loadFont";
import loadMusic from "./loadMusic";
import loadTextures from "./loadTextures";
import { geometry, path } from "./geometry";
import getText from "./getText";
let clearit: any;
let percentage = 0;

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
const fired: Record<string, boolean> = {};
function fireOnce(id: string, callback: Function) {
  if (!fired[id]) {
    fired[id] = true;
    callback();
  }
}
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
  const loader = new FontLoader();
  let textMesh: THREE.Mesh;
  loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeometry = new TextGeometry('Puoluehallitus presents\n Taajuusmuunnin', {
        font: font,
        size: 1,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    });
    const textMaterial = new THREE.MeshPhongMaterial({ color: 0xddffff });
    textMesh = new THREE.Mesh(textGeometry, textMaterial);

});
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    gear.rotation.z += 0.01;
    // Update velocity and position
    velocity += gravity;
    gear.position.y += velocity;
            // Move the text
            if (textMesh) {
              textMesh.position.x -= 0.01;
              // Add bounds check to reset position
              if (textMesh.position.x > 5) {
                  textMesh.position.x = -5;
              }
          }
    // Check for collision with the ground
    if (gear.position.y - 1 < 0) {
      gear.position.y = 1; // Reset position
      velocity = -velocity * bounceFactor; // Reverse and reduce velocity
    }

    controls.update();
    renderer.render(scene, camera);
  }

  // Start animation
  const interval = () => setInterval(() => {
    const time = listener.context.currentTime;
    percentage = time / maxTime;
    const roundedPercentage = Math.round(percentage * 1000) / 10;

    if (roundedPercentage === 2) {
      fireOnce('text1', () => {
      scene.add(textMesh);
      textMesh.position.set(0,11, 0);
      });
    }

    if (roundedPercentage === 11.5) {
      fireOnce('text2_3', () => {
        scene.remove(textMesh);
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
          const textGeometry = new TextGeometry('Music by:\n    Puoluehallitus\n\nCode by: HandOfNod/Spot', {
              font: font,
              size: 1,
              height: 0.2,
              curveSegments: 12,
              bevelEnabled: true,
              bevelThickness: 0.03,
              bevelSize: 0.02,
              bevelOffset: 0,
              bevelSegments: 5
          });
          const textMaterial = new THREE.MeshPhongMaterial({ color: 0xddffff });
          textMesh = new THREE.Mesh(textGeometry, textMaterial);
          scene.add(textMesh);
          textMesh.position.set(0,11, 0);
      });

      });
    }

    if (roundedPercentage === 22) {
      fireOnce('creditsTexts', () => {
        console.log("Greetings\n      to... Jml, Accession, Byterapers ...especially\n     Nyyrikki ")
        scene.remove(textMesh);
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
          const textGeometry = new TextGeometry('Greetings\n      to... \nJml, Accession, Byterapers \n...especially: Nyyrikki ', {
              font: font,
              size: 1,
              height: 0.2,
              curveSegments: 12,
              bevelEnabled: true,
              bevelThickness: 0.03,
              bevelSize: 0.02,
              bevelOffset: 0,
              bevelSegments: 5
          });
          const textMaterial = new THREE.MeshPhongMaterial({ color: 0xddffff });
          textMesh = new THREE.Mesh(textGeometry, textMaterial);
          scene.add(textMesh);
          textMesh.position.set(0,11, 0);
      });
      });
    }

    if (roundedPercentage === 88) {
      fireOnce('endCredits', () => {
        console.log("test5")

      });
    }

    if (percentage > 0.9 && percentage <= 0.97) {

    }
  }, 10);

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", () => {
    resize();
  });

  renderer.domElement.addEventListener("click", () => {
    (window as any).electronAPI?.toggleFullscreen?.();
    if (!sound.isPlaying) {
      sound.play();
      animate();
      clearit= interval();

    }

  });

  document.onkeydown = (event) => {
    if (event.key === 'Escape') {
      (window as any).electronAPI?.exitFullscreen?.();
      resize();
    }

    if (event.key === 'Space') {
      if (sound.isPlaying) {
        sound.pause();
      } else {
        sound.play();
      }
    }
  };

  const maxTime = sound.buffer?.duration ?? 100;
  sound.onEnded = () => {
    clearInterval(clearit);
  };
})();

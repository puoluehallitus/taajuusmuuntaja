import * as THREE from 'three';

import songFileURL from 'url:./song.mp3';

const loadMusic = (): Promise<{ listener: THREE.AudioListener, sound: THREE.Audio }> => {
  return new Promise((resolve) => {
    const listener = new THREE.AudioListener();
    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(songFileURL, (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(false);
      sound.setVolume(0.5);
      resolve({ listener, sound });
    });
  });
}

export default loadMusic;
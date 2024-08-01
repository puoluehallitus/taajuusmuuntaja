import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import helvetikerRegular from 'url:./helvetiker-regular.json.raw';

const fontLoader = new FontLoader();

const loadFont = (fontURL: string): Promise<Font> => {
  return new Promise((resolve) => {
    fontLoader.load(fontURL, (font) => {
      resolve(font);
    });
  });
};

const loadFonts = (): Promise<Font[]> => Promise.all([
  loadFont(helvetikerRegular),
]);

export default loadFonts;
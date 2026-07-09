import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadJetBrainsMono } from '@remotion/google-fonts/JetBrainsMono';
import { continueRender, delayRender } from 'remotion';

let fontsHandle: ReturnType<typeof delayRender> | null = null;

export function loadFonts() {
  fontsHandle = delayRender('Loading fonts');

  const interInfo = loadInter('normal', { weights: ['400', '600', '700', '800'], subsets: ['latin'] });
  const monoInfo = loadJetBrainsMono('normal', { weights: ['400', '500'], subsets: ['latin'] });

  Promise.all([interInfo.waitUntilDone(), monoInfo.waitUntilDone()])
    .then(() => continueRender(fontsHandle!))
    .catch((err) => {
      console.error('Font load failed', err);
      continueRender(fontsHandle!);
    });
}

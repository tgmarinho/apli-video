import React from 'react';
import { Composition } from 'remotion';
import { MarketingVideo } from './compositions/MarketingVideo';
import { marketingVideoSchema } from './compositions/MarketingVideo/schema';
import { loadFonts } from './lib/fonts';

loadFonts();

// Sequences: 70+60+50+120+100+100+75+70+80 = 725
// Transitions: 8×18 = 144
// Net: 725 - 144 = 581 frames @ 30fps ≈ 19.4s
const TOTAL_FRAMES = 581;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="AmplifyATS"
      component={MarketingVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      schema={marketingVideoSchema}
      defaultProps={marketingVideoSchema.parse({})}
    />
  </>
);

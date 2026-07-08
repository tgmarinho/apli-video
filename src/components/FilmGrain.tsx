import React from 'react';
import { useCurrentFrame } from 'remotion';

interface Props {
  opacity?: number;
}

// Animated SVG feTurbulence grain — seed changes every 2 frames for flickering film look
export const FilmGrain: React.FC<Props> = ({ opacity = 0.07 }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) * 37; // deterministic but varying

  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity, mixBlendMode: 'overlay', pointerEvents: 'none' }}
    >
      <filter id={`grain-${seed}`}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.72"
          numOctaves="4"
          stitchTiles="stitch"
          seed={seed}
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
    </svg>
  );
};

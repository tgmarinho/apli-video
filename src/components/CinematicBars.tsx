import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface Props {
  enterFrames?: number;
  barHeight?: number;
}

export const CinematicBars: React.FC<Props> = ({ enterFrames = 18, barHeight = 72 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 40, stiffness: 200, mass: 1, overshootClamping: true }, from: 0, to: 1 });
  const offset = interpolate(p, [0, 1], [barHeight, 0]);

  return (
    <>
      <div style={{ position: 'absolute', top: -offset, left: 0, right: 0, height: barHeight, backgroundColor: '#000', zIndex: 100 }} />
      <div style={{ position: 'absolute', bottom: -offset, left: 0, right: 0, height: barHeight, backgroundColor: '#000', zIndex: 100 }} />
    </>
  );
};

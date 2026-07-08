import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface Props {
  startFrame?: number;
}

export const AgentTypingDots: React.FC<Props> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 28, stiffness: 280, mass: 1, overshootClamping: false },
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, opacity: appear }}>
      {[0, 1, 2].map((i) => {
        const bounce = spring({
          frame: Math.max(0, (frame - startFrame - i * 5) % 30),
          fps,
          config: { damping: 8, stiffness: 400, mass: 0.6, overshootClamping: false },
        });
        const y = interpolate(bounce, [0, 1], [0, -6]);

        return (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.5)',
              transform: `translateY(${y}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

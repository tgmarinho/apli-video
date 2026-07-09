import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface Props {
  text: string;
  delay?: number;
  style?: React.CSSProperties;
  mode?: 'word' | 'char' | 'line';
}

export const AnimatedText: React.FC<Props> = ({ text, delay = 0, style, mode = 'word' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tokens = mode === 'char' ? text.split('') : text.split(' ');

  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: mode === 'char' ? 0 : '0.25em', ...style }}>
      {tokens.map((token, i) => {
        const tokenDelay = delay + i * 3;
        const progress = spring({
          frame: Math.max(0, frame - tokenDelay),
          fps,
          config: { damping: 26, stiffness: 340, mass: 1 },
          from: 0,
          to: 1,
        });
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: progress,
              transform: `translateY(${interpolate(progress, [0, 1], [24, 0])}px)`,
            }}
          >
            {token}
            {mode === 'word' && i < tokens.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </span>
  );
};

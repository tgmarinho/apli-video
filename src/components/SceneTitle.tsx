import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, type } from '../lib/theme';

interface Props {
  act: string;
  title: string;
  dark?: boolean;
  delay?: number;
}

// Cinema-style chapter/act title — horizontal rule slides in, text fades up
export const SceneTitle: React.FC<Props> = ({ act, title, dark = false, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineP = interpolate(Math.max(0, frame - delay), [0, 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const textP = spring({ frame: Math.max(0, frame - delay - 10), fps, config: { damping: 36, stiffness: 220, mass: 1, overshootClamping: false } });

  const fg = dark ? brand.white : brand.black;
  const muted = dark ? brand.darkTextMuted : brand.textSubtle;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: 80,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {/* Horizontal rule */}
      <div
        style={{
          width: interpolate(lineP, [0, 1], [0, 160]),
          height: 1.5,
          backgroundColor: fg,
          opacity: 0.3,
        }}
      />
      {/* Act label */}
      <div style={{ opacity: textP, transform: `translateY(${interpolate(textP, [0, 1], [10, 0])}px)` }}>
        <div style={{ fontSize: 13, color: muted, ...type.label, marginBottom: 4 }}>{act}</div>
        <div style={{ fontSize: 20, color: fg, ...type.semibold }}>{title}</div>
      </div>
    </div>
  );
};

import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { brand, type } from '../lib/theme';

const CREDITS = [
  { role: 'Platform',   name: 'Amplify IT' },
  { role: 'Talent',     name: 'Brazilian Engineers' },
  { role: 'Powered by', name: 'Remotion' },
  { role: 'Website',    name: 'amplifyit.io' },
];

interface Props {
  startScroll?: number;
}

export const ClosingCredits: React.FC<Props> = ({ startScroll = 30 }) => {
  const frame = useCurrentFrame();
  const scrollY = interpolate(frame, [startScroll, startScroll + 90], [0, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 60,
        left: '50%',
        transform: `translateX(-50%) translateY(${-scrollY}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18,
        opacity: interpolate(frame, [startScroll, startScroll + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}
    >
      {CREDITS.map((c) => (
        <div key={c.role} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: brand.darkTextMuted, ...type.label, marginBottom: 2 }}>{c.role}</div>
          <div style={{ fontSize: 18, color: brand.white, ...type.semibold }}>{c.name}</div>
        </div>
      ))}
    </div>
  );
};

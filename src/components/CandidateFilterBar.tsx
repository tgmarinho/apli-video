import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, type } from '../lib/theme';

interface Props {
  filters: string[];
  startDelay?: number;
  label?: string;
}

export const CandidateFilterBar: React.FC<Props> = ({ filters, startDelay = 0, label = 'Active filters' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelP = spring({
    frame: Math.max(0, frame - startDelay),
    fps,
    config: { damping: 28, stiffness: 260, mass: 1, overshootClamping: false },
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 11, color: brand.textFaint, ...type.label, opacity: labelP, flexShrink: 0 }}>
        {label}
      </span>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {filters.map((f, i) => {
          const p = spring({
            frame: Math.max(0, frame - (startDelay + 4 + i * 6)),
            fps,
            config: { damping: 26, stiffness: 300, mass: 1, overshootClamping: false },
          });
          return (
            <span
              key={f}
              style={{
                fontSize: 12,
                color: brand.textMuted,
                backgroundColor: brand.white,
                border: `1px solid ${brand.borderMedium}`,
                borderRadius: 999,
                padding: '4px 12px',
                ...type.semibold,
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [6, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
              }}
            >
              {f}
            </span>
          );
        })}
      </div>
    </div>
  );
};

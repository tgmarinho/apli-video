import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, type } from '../lib/theme';
import { CandidateCardUI, CandidateData } from './CandidateCardUI';

interface Props {
  title: string;
  count: number;
  candidates: CandidateData[];
  startDelay?: number;
  accentColor?: string;
  dimmed?: boolean;
}

export const KanbanColumn: React.FC<Props> = ({
  title,
  count,
  candidates,
  startDelay = 0,
  accentColor = brand.textPrimary,
  dimmed = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerP = spring({
    frame: Math.max(0, frame - startDelay),
    fps,
    config: { damping: 30, stiffness: 260, mass: 1, overshootClamping: false },
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        opacity: dimmed ? headerP * 0.18 : headerP,
      }}
    >
      {/* Column header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          paddingBottom: 10,
          marginBottom: 8,
          borderBottom: `1px solid ${brand.borderSubtle}`,
        }}
      >
        <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: accentColor, opacity: dimmed ? 0.3 : 1, flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: brand.textPrimary, ...type.semibold }}>{title}</span>
        <span style={{ fontSize: 11, color: brand.textFaint, backgroundColor: 'rgba(0,0,0,0.04)', border: `1px solid rgba(0,0,0,0.07)`, borderRadius: 999, padding: '1px 7px', ...type.semibold, marginLeft: 1 }}>
          {count}
        </span>
      </div>

      {/* Cards */}
      <div
        style={{
          backgroundColor: 'rgba(0,0,0,0.015)',
          borderRadius: brand.radiusMd,
          border: `1px solid rgba(0,0,0,0.04)`,
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 7,
          minHeight: 160,
        }}
      >
        {candidates.map((c, i) => (
          <CandidateCardUI key={c.name} candidate={c} delay={startDelay + 12 + i * 10} />
        ))}
      </div>
    </div>
  );
};

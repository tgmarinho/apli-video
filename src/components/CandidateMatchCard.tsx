import React from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, getScoreColor, type } from '../lib/theme';

interface Props {
  id: string;
  name: string;
  role: string;
  company: string;
  score: number;
  why: string;
  delay?: number;
}

export const CandidateMatchCard: React.FC<Props> = ({
  id,
  name,
  role,
  company,
  score,
  why,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 22, stiffness: 280, mass: 1, overshootClamping: false },
  });

  const sc = getScoreColor(score);

  return (
    <div
      style={{
        backgroundColor: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: brand.radiusMd,
        padding: '12px 14px',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-12, 0])}px) scale(${interpolate(p, [0, 1], [0.97, 1])})`,
        marginBottom: 6,
      }}
    >
      {/* Avatar */}
      <Img
        src={staticFile(`avatars/avatar-${id}.svg`)}
        width={42}
        height={42}
        style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.12)', flexShrink: 0 }}
      />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 14, color: brand.slackText, ...type.semibold }}>{name}</span>
          <span
            style={{
              fontSize: 11,
              color: sc.text,
              backgroundColor: sc.bg,
              border: `1px solid ${sc.border}`,
              borderRadius: 999,
              padding: '1px 7px',
              fontFamily: 'Inter',
              fontWeight: 600,
            }}
          >
            {score}
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            <Img
              src={staticFile(`brand/companies/${company.toLowerCase().replace(/\s+/g, '')}.svg`)}
              height={13}
              style={{ objectFit: 'contain', filter: 'invert(1) brightness(0.6)' }}
            />
          </div>
        </div>
        <div style={{ fontSize: 12, color: brand.slackTextMuted, ...type.body, marginBottom: 4 }}>{role}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', ...type.body, fontStyle: 'italic' }}>"{why}"</div>
      </div>
    </div>
  );
};

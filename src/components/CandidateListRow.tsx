import React from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, getScoreColor, seniorityColor, type } from '../lib/theme';

export interface CandidateListData {
  id: string;
  rank: number;
  name: string;
  role: string;
  seniority: string;
  company: string;
  score: number;
  location: string;
  yoe: number;
  isTopMatch?: boolean;
}

interface Props {
  candidate: CandidateListData;
  delay?: number;
}

export const CandidateListRow: React.FC<Props> = ({ candidate, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 26, stiffness: 280, mass: 1, overshootClamping: false },
  });

  const scoreProgress = interpolate(frame, [delay + 10, delay + 45], [0, candidate.score], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sc = getScoreColor(candidate.score);
  const snCol = seniorityColor[candidate.seniority] ?? seniorityColor['MID'];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        backgroundColor: brand.white,
        border: `1px solid ${candidate.isTopMatch ? '#a7f3d0' : brand.borderSubtle}`,
        borderRadius: brand.radiusMd,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-12, 0])}px)`,
        boxShadow: candidate.isTopMatch ? '0 1px 4px rgba(16,185,129,0.08)' : '0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      {/* Rank */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          backgroundColor: candidate.isTopMatch ? '#ecfdf5' : 'rgba(0,0,0,0.03)',
          border: `1px solid ${candidate.isTopMatch ? '#a7f3d0' : 'rgba(0,0,0,0.06)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 12, color: candidate.isTopMatch ? '#065f46' : brand.textFaint, ...type.semibold }}>
          #{candidate.rank}
        </span>
      </div>

      {/* Avatar */}
      <Img
        src={staticFile(`avatars/avatar-${candidate.id}.svg`)}
        width={36}
        height={36}
        style={{ borderRadius: '50%', objectFit: 'cover', border: `1px solid ${brand.borderSubtle}`, flexShrink: 0 }}
      />

      {/* Name + role */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 14, color: brand.textPrimary, ...type.semibold, whiteSpace: 'nowrap' }}>{candidate.name}</span>
          {candidate.isTopMatch && (
            <span style={{ fontSize: 10, color: '#065f46', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 999, padding: '1px 7px', ...type.semibold }}>
              Top match
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: brand.textSubtle, ...type.body, marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>{candidate.role}</span>
          <span style={{ color: brand.textFaint }}>·</span>
          <Img
            src={staticFile(`brand/companies/${candidate.company.toLowerCase().replace(/\s+/g, '')}.svg`)}
            height={12}
            style={{ objectFit: 'contain', opacity: 0.55 }}
          />
          <span style={{ color: brand.textFaint }}>·</span>
          <span>{candidate.location}</span>
        </div>
      </div>

      {/* Seniority */}
      <span
        style={{
          fontSize: 11,
          color: snCol.text,
          backgroundColor: snCol.bg,
          border: `1px solid ${snCol.border}`,
          borderRadius: 999,
          padding: '2px 8px',
          fontFamily: 'Inter',
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {candidate.seniority}
      </span>

      {/* Score bar + number */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 130, flexShrink: 0 }}>
        <div style={{ flex: 1, height: 4, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${scoreProgress}%`, height: '100%', backgroundColor: sc.text, borderRadius: 999, opacity: 0.7 }} />
        </div>
        <span style={{ fontSize: 13, color: sc.text, backgroundColor: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 999, padding: '2px 8px', fontFamily: 'Inter', fontWeight: 700, flexShrink: 0 }}>
          {candidate.score}
        </span>
      </div>
    </div>
  );
};

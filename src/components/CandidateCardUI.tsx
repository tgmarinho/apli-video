import React from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, getScoreColor, seniorityColor, type } from '../lib/theme';

export interface CandidateData {
  name: string;
  role: string;
  seniority: 'JUNIOR' | 'MID' | 'SENIOR' | 'STAFF' | 'LEAD' | 'PRINCIPAL';
  yoe: number;
  mlScore: number;
  techStack: string[];
  location?: string;
  source?: string;
  hasInterview?: boolean;
  avatarSrc?: string;
}

interface Props {
  candidate: CandidateData;
  delay?: number;
  highlighted?: boolean;
}

function Avatar({ name, score, avatarSrc }: { name: string; score: number; avatarSrc?: string }) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const sc = getScoreColor(score);

  if (avatarSrc) {
    return (
      <Img
        src={staticFile(avatarSrc)}
        width={38}
        height={38}
        style={{ borderRadius: '50%', objectFit: 'cover', border: `1.5px solid ${sc.border}`, flexShrink: 0 }}
      />
    );
  }

  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${sc.bg}, rgba(255,255,255,0.9))`,
        border: `1.5px solid ${sc.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 13, color: sc.text, fontFamily: 'Inter', fontWeight: 600 }}>
        {initials}
      </span>
    </div>
  );
}

export const CandidateCardUI: React.FC<Props> = ({ candidate, delay = 0, highlighted = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 26, stiffness: 300, mass: 1, overshootClamping: false },
  });

  const scoreProgress = interpolate(frame, [delay + 8, delay + 40], [0, candidate.mlScore], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sc = getScoreColor(candidate.mlScore);
  const seniority = seniorityColor[candidate.seniority] ?? seniorityColor['MID'];

  return (
    <div
      style={{
        backgroundColor: brand.white,
        border: `1px solid ${highlighted ? brand.borderMedium : brand.borderSubtle}`,
        borderRadius: brand.radiusMd,
        padding: '12px 14px',
        boxShadow: highlighted
          ? '0 1px 4px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)'
          : '0 1px 2px rgba(0,0,0,0.03)',
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [14, 0])}px)`,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <Avatar name={candidate.name} score={candidate.mlScore} avatarSrc={candidate.avatarSrc} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, color: brand.textPrimary, ...type.semibold, marginBottom: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {candidate.name}
          </div>
          <div style={{ fontSize: 12, color: brand.textSubtle, ...type.body, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {candidate.role}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: seniority.text, backgroundColor: seniority.bg, border: `1px solid ${seniority.border}`, borderRadius: 999, padding: '1px 7px', fontFamily: 'Inter', fontWeight: 600 }}>
            {candidate.seniority}
          </span>
          <span style={{ fontSize: 10, color: brand.textFaint, ...type.body }}>{candidate.yoe}y</span>
        </div>
      </div>

      {/* Score bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{ flex: 1, height: 3, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${scoreProgress}%`, height: '100%', backgroundColor: sc.text, borderRadius: 999, opacity: 0.65 }} />
        </div>
        <span style={{ fontSize: 11, color: sc.text, backgroundColor: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 999, padding: '1px 6px', fontFamily: 'Inter', fontWeight: 600, flexShrink: 0 }}>
          {candidate.mlScore}
        </span>
      </div>

      {/* Tech stack */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
        {candidate.location && (
          <span style={{ fontSize: 10, color: brand.textMuted, backgroundColor: 'rgba(0,0,0,0.025)', border: `1px solid rgba(0,0,0,0.06)`, borderRadius: 4, padding: '1px 6px', ...type.body }}>
            {candidate.location}
          </span>
        )}
        {candidate.techStack.slice(0, 3).map((t) => (
          <span key={t} style={{ fontSize: 10, color: brand.textMuted, backgroundColor: 'rgba(0,0,0,0.025)', border: `1px solid rgba(0,0,0,0.06)`, borderRadius: 4, padding: '1px 6px', ...type.body }}>
            {t}
          </span>
        ))}
        {candidate.hasInterview && (
          <span style={{ fontSize: 10, color: '#1e40af', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 999, padding: '1px 7px', fontFamily: 'Inter', fontWeight: 600 }}>
            Interview ↗
          </span>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { AnimatedText } from '../../components/AnimatedText';
import { LogoFull } from '../../components/LogoMark';
import { colors, typography } from '../../lib/theme';
import { PlacementAnnouncementProps } from './schema';

export const PlacementAnnouncement: React.FC<PlacementAnnouncementProps> = ({
  candidateName,
  candidateRole,
  candidateAvatarUrl,
  orgName,
  orgLogoUrl,
  orgAccentColor,
  startDate,
  placementType,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = (delay: number) =>
    spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 24, stiffness: 300 } });

  // Connector line grows from center outward
  const lineProgress = interpolate(frame, [30, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #060612 0%, #0d0820 100%)`,
        fontFamily: 'Inter',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, ${orgAccentColor}18 0%, transparent 65%)`,
          opacity: interpolate(frame, [0, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      />

      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 60,
          right: 60,
          display: 'flex',
          justifyContent: 'center',
          opacity: s(0),
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: `${orgAccentColor}20`,
            border: `1px solid ${orgAccentColor}40`,
            borderRadius: 999,
            padding: '8px 24px',
          }}
        >
          <span style={{ color: orgAccentColor, fontSize: 13, letterSpacing: '0.1em', fontWeight: 700 }}>
            🎉 NEW PLACEMENT
          </span>
        </div>
      </div>

      {/* Candidate avatar + Org logo + connector */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          marginTop: -60,
        }}
      >
        {/* Candidate */}
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: '50%',
            border: `4px solid ${orgAccentColor}`,
            overflow: 'hidden',
            background: colors.gray800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateX(${interpolate(s(10), [0, 1], [-40, 0])}px) scale(${s(10)})`,
            opacity: s(10),
          }}
        >
          {candidateAvatarUrl ? (
            <Img src={candidateAvatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 60, color: colors.gray400 }}>
              {candidateName.split(' ').map((w) => w[0]).join('').slice(0, 2)}
            </span>
          )}
        </div>

        {/* Connector line */}
        <div
          style={{
            width: 120,
            height: 3,
            background: `linear-gradient(90deg, ${orgAccentColor}, ${colors.white})`,
            transformOrigin: 'left center',
            transform: `scaleX(${lineProgress})`,
            opacity: lineProgress,
          }}
        />
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: colors.white,
            opacity: lineProgress,
          }}
        />

        {/* Org logo */}
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: 28,
            border: `4px solid ${colors.gray600}`,
            overflow: 'hidden',
            background: colors.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            transform: `translateX(${interpolate(s(10), [0, 1], [40, 0])}px) scale(${s(10)})`,
            opacity: s(10),
          }}
        >
          {orgLogoUrl ? (
            <Img src={orgLogoUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <span style={{ fontSize: 40, fontWeight: 800, color: colors.black }}>{orgName[0]}</span>
          )}
        </div>
      </div>

      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          bottom: 260,
          left: 60,
          right: 60,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 42, color: colors.white, lineHeight: 1.2, ...typography.heading }}>
          <AnimatedText text={`We placed ${candidateName}`} delay={60} />
        </div>
        <div style={{ fontSize: 32, color: orgAccentColor, marginTop: 8, ...typography.heading }}>
          <AnimatedText text={`at ${orgName}`} delay={75} />
        </div>
      </div>

      {/* Meta */}
      <div
        style={{
          position: 'absolute',
          bottom: 160,
          left: 60,
          right: 60,
          textAlign: 'center',
          opacity: s(90),
        }}
      >
        <span style={{ color: colors.gray400, fontSize: 22, ...typography.body }}>
          {candidateRole} · {placementType} · Starting {startDate}
        </span>
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 60,
          right: 60,
          display: 'flex',
          justifyContent: 'center',
          opacity: s(100),
        }}
      >
        <LogoFull size={24} />
      </div>
    </AbsoluteFill>
  );
};

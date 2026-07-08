import React from 'react';
import { AbsoluteFill, Img, interpolate, Series, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { AnimatedText } from '../../components/AnimatedText';
import { Badge, SeniorityBadge } from '../../components/Badge';
import { CountUp } from '../../components/CountUp';
import { LogoFull } from '../../components/LogoMark';
import { ProgressBar } from '../../components/ProgressBar';
import { colors, typography } from '../../lib/theme';
import { CandidateCardProps } from './schema';

const SCENE = { intro: 40, profile: 100, stack: 160, score: 200, outro: 240 };

export const CandidateCard: React.FC<CandidateCardProps> = ({
  name,
  role,
  seniority,
  techStack,
  mlScore,
  yearsOfExperience,
  avatarUrl,
  accentColor,
  country,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = spring({ frame, fps, config: { damping: 40, stiffness: 200 }, from: 0, to: 1 });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(155deg, ${colors.black} 0%, #0f0a1e 60%, ${accentColor}22 100%)`,
        fontFamily: 'Inter',
        overflow: 'hidden',
      }}
    >
      {/* Glow orb */}
      <div
        style={{
          position: 'absolute',
          top: -200,
          right: -200,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}30 0%, transparent 70%)`,
          opacity: fadeIn,
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
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: fadeIn,
        }}
      >
        <LogoFull size={28} />
        <span style={{ color: colors.gray400, fontSize: 22, ...typography.body }}>{country}</span>
      </div>

      {/* Avatar */}
      <div
        style={{
          position: 'absolute',
          top: 160,
          left: '50%',
          transform: `translateX(-50%) scale(${interpolate(
            spring({ frame: Math.max(0, frame - SCENE.intro), fps, config: { damping: 22, stiffness: 280 } }),
            [0, 1], [0.6, 1]
          )})`,
          opacity: spring({ frame: Math.max(0, frame - SCENE.intro), fps, config: { damping: 40 } }),
        }}
      >
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            border: `4px solid ${accentColor}`,
            overflow: 'hidden',
            background: colors.gray800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {avatarUrl ? (
            <Img src={avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 80, color: colors.gray400 }}>
              {name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
            </span>
          )}
        </div>
      </div>

      {/* Name + Role */}
      <div
        style={{
          position: 'absolute',
          top: 400,
          left: 60,
          right: 60,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 52, color: colors.white, marginBottom: 12, ...typography.heading }}>
          <AnimatedText text={name} delay={SCENE.profile} />
        </div>
        <div style={{ fontSize: 28, color: accentColor, marginBottom: 8, ...typography.body }}>
          <AnimatedText text={role} delay={SCENE.profile + 8} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
          <SeniorityBadge seniority={seniority} delay={SCENE.profile + 16} />
          <Badge label={`${yearsOfExperience}y exp`} delay={SCENE.profile + 22} color={colors.green} />
        </div>
      </div>

      {/* Tech stack */}
      <div
        style={{
          position: 'absolute',
          top: 620,
          left: 60,
          right: 60,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          justifyContent: 'center',
        }}
      >
        {techStack.map((tech, i) => (
          <Badge key={tech} label={tech} delay={SCENE.stack + i * 8} color={colors.gray400} />
        ))}
      </div>

      {/* ML Score */}
      <div
        style={{
          position: 'absolute',
          bottom: 180,
          left: 60,
          right: 60,
          opacity: spring({ frame: Math.max(0, frame - SCENE.score), fps, config: { damping: 40 } }),
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <span style={{ color: colors.gray400, fontSize: 20, ...typography.body }}>Amplify Score</span>
          <span style={{ color: colors.white, fontSize: 36, ...typography.heading }}>
            <CountUp to={mlScore} startFrame={SCENE.score} endFrame={SCENE.score + 50} />
            <span style={{ color: accentColor }}>/100</span>
          </span>
        </div>
        <ProgressBar value={mlScore} startFrame={SCENE.score} endFrame={SCENE.score + 60} color={accentColor} height={10} />
      </div>

      {/* Footer CTA */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 60,
          right: 60,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: interpolate(frame, [SCENE.outro - 10, SCENE.outro + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      >
        <span style={{ color: colors.gray600, fontSize: 18, ...typography.body }}>amplifyit.io</span>
        <span style={{ color: accentColor, fontSize: 18, ...typography.body }}>Hire top Brazilian engineers →</span>
      </div>
    </AbsoluteFill>
  );
};

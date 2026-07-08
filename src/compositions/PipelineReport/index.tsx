import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CountUp } from '../../components/CountUp';
import { LogoFull } from '../../components/LogoMark';
import { colors, typography } from '../../lib/theme';
import { PipelineReportProps } from './schema';

export const PipelineReport: React.FC<PipelineReportProps> = ({
  weekOf,
  stages,
  totalCandidates,
  placements,
  rolesOpen,
  topCandidates,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerFade = spring({ frame, fps, config: { damping: 40, stiffness: 180 } });
  const maxCount = Math.max(...stages.map((s) => s.count));

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(160deg, #06060f 0%, #0d0d1a 100%)',
        fontFamily: 'Inter',
        padding: 80,
        display: 'flex',
        flexDirection: 'column',
        gap: 48,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: headerFade,
          transform: `translateY(${interpolate(headerFade, [0, 1], [-20, 0])}px)`,
        }}
      >
        <div>
          <div style={{ color: colors.gray400, fontSize: 16, letterSpacing: '0.1em', fontWeight: 600 }}>
            WEEKLY PIPELINE REPORT
          </div>
          <div style={{ color: colors.white, fontSize: 36, marginTop: 4, ...typography.heading }}>
            {weekOf}
          </div>
        </div>
        <LogoFull size={32} />
      </div>

      {/* KPI row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 32,
          opacity: spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 40, stiffness: 180 } }),
        }}
      >
        {[
          { label: 'Total Candidates', value: totalCandidates, color: colors.purple },
          { label: 'Placements', value: placements, color: colors.green },
          { label: 'Roles Open', value: rolesOpen, color: colors.amber },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              background: `${color}10`,
              border: `1px solid ${color}30`,
              borderRadius: 16,
              padding: '24px 28px',
            }}
          >
            <div style={{ color: colors.gray400, fontSize: 14, letterSpacing: '0.05em', fontWeight: 600 }}>
              {label.toUpperCase()}
            </div>
            <div style={{ color, fontSize: 52, marginTop: 8, ...typography.heading }}>
              <CountUp to={value} startFrame={20} endFrame={60} />
            </div>
          </div>
        ))}
      </div>

      {/* Funnel bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ color: colors.gray400, fontSize: 14, letterSpacing: '0.08em', fontWeight: 600, opacity: headerFade }}>
          PIPELINE FUNNEL
        </div>
        {stages.map((stage, i) => {
          const barDelay = 30 + i * 12;
          const barProgress = interpolate(frame, [barDelay, barDelay + 50], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const pct = (stage.count / maxCount) * 100;
          return (
            <div key={stage.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 120, color: colors.gray400, fontSize: 16, ...typography.body, textAlign: 'right' }}>
                {stage.label}
              </div>
              <div
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 8,
                  background: colors.gray800,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${pct * barProgress}%`,
                    background: `linear-gradient(90deg, ${stage.color}cc, ${stage.color})`,
                    borderRadius: 8,
                  }}
                />
              </div>
              <div style={{ width: 48, color: colors.white, fontSize: 22, fontWeight: 700, textAlign: 'right' }}>
                <CountUp to={stage.count} startFrame={barDelay} endFrame={barDelay + 50} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Top candidates */}
      <div>
        <div
          style={{
            color: colors.gray400,
            fontSize: 14,
            letterSpacing: '0.08em',
            fontWeight: 600,
            marginBottom: 16,
            opacity: headerFade,
          }}
        >
          TOP CANDIDATES THIS WEEK
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {topCandidates.map((c, i) => {
            const delay = 120 + i * 15;
            const p = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 26, stiffness: 280 } });
            return (
              <div
                key={c.name}
                style={{
                  flex: 1,
                  background: `${colors.purple}12`,
                  border: `1px solid ${colors.purple}25`,
                  borderRadius: 12,
                  padding: '20px 24px',
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [20, 0])}px)`,
                }}
              >
                <div style={{ color: colors.white, fontSize: 20, fontWeight: 700 }}>{c.name}</div>
                <div style={{ color: colors.gray400, fontSize: 15, marginTop: 4 }}>{c.role}</div>
                <div style={{ color: colors.purple, fontSize: 28, fontWeight: 800, marginTop: 12 }}>
                  <CountUp to={c.score} startFrame={delay} endFrame={delay + 40} />
                  <span style={{ fontSize: 16, fontWeight: 400, color: colors.gray600 }}>/100</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

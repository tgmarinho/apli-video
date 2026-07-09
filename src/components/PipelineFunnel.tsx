import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { brand, getPipelineBarGradient, type } from '../lib/theme';

const STAGES = [
  { label: 'New',          width: 100 },
  { label: 'Screening',    width: 86 },
  { label: 'Shortlisted',  width: 72 },
  { label: 'Presented',    width: 58 },
  { label: 'Interviewing', width: 44 },
  { label: 'Offered',      width: 30 },
  { label: 'Hired',        width: 18 },
];

interface Props {
  counts: number[];
  startFrame?: number;
}

export const PipelineFunnel: React.FC<Props> = ({ counts, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const totalInFunnel = counts.reduce((a, b) => a + b, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Column headers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 4 }}>
        <div style={{ width: 160, textAlign: 'right' }}>
          <span style={{ fontSize: 14, ...type.label, color: brand.textFaint }}>Stage</span>
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 14, ...type.label, color: brand.textFaint }}>Count</span>
        </div>
        <div style={{ width: 100, textAlign: 'right' }}>
          <span style={{ fontSize: 14, ...type.label, color: brand.textFaint }}>Reach</span>
        </div>
      </div>

      {STAGES.map((stage, index) => {
        const count = counts[index] ?? 0;
        const barDelay = startFrame + index * 10;
        const barProgress = interpolate(frame, [barDelay, barDelay + 45], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const cumulativeCount = counts.slice(index).reduce((a, b) => a + b, 0);
        const conversionRate = totalInFunnel > 0
          ? Math.round((cumulativeCount / totalInFunnel) * 100)
          : 0;

        return (
          <div key={stage.label} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 160, textAlign: 'right' }}>
              <span style={{ fontSize: 17, color: brand.textMuted, ...type.body }}>{stage.label}</span>
            </div>
            <div style={{ flex: 1, position: 'relative', height: 40 }}>
              {/* Track */}
              <div
                style={{
                  position: 'absolute',
                  left: 0, top: 0,
                  width: `${stage.width}%`,
                  height: '100%',
                  borderRadius: '0 8px 8px 0',
                  background: getPipelineBarGradient(index, count > 0),
                  transform: `scaleX(${barProgress})`,
                  transformOrigin: 'left center',
                }}
              />
              {/* Count inside bar */}
              <div
                style={{
                  position: 'absolute',
                  left: 0, top: 0,
                  width: `${stage.width * barProgress}%`,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 16,
                  overflow: 'hidden',
                }}
              >
                <span
                  style={{
                    fontSize: 18,
                    ...type.semibold,
                    color: count > 0 ? brand.white : 'rgba(0,0,0,0.30)',
                  }}
                >
                  {count}
                </span>
              </div>
            </div>
            <div style={{ width: 100, textAlign: 'right' }}>
              <span
                style={{
                  fontSize: 16,
                  ...type.semibold,
                  color: conversionRate > 0 ? brand.textMuted : brand.textFaint,
                }}
              >
                {conversionRate > 0 ? `${conversionRate}%` : '—'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

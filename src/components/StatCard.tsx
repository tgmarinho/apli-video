import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, type } from '../lib/theme';
import { CountUp } from './CountUp';

interface Props {
  label: string;
  value: number;
  suffix?: string;
  delta?: string;
  deltaUp?: boolean;
  delay?: number;
  isSuccess?: boolean;
  isError?: boolean;
}

export const StatCard: React.FC<Props> = ({
  label,
  value,
  suffix = '',
  delta,
  deltaUp = true,
  delay = 0,
  isSuccess,
  isError,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 32, stiffness: 280, mass: 1, overshootClamping: false },
  });

  const valueColor = isError ? '#dc2626' : brand.textPrimary;
  const labelColor = isError ? 'rgba(220,38,38,0.55)' : brand.textSubtle;
  const borderColor = isError
    ? 'rgba(254,202,202,0.8)'
    : isSuccess
    ? 'rgba(167,243,208,0.8)'
    : brand.borderSubtle;
  const deltaColor = deltaUp ? '#059669' : '#dc2626';

  return (
    <div
      style={{
        backgroundColor: brand.white,
        border: `1px solid ${borderColor}`,
        borderRadius: brand.radiusMd,
        padding: '14px 16px',
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [12, 0])}px) scale(${interpolate(p, [0, 1], [0.97, 1])})`,
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {(isSuccess || isError) && (
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 2,
            backgroundColor: isError ? '#fca5a5' : '#6ee7b7',
            opacity: 0.8,
          }}
        />
      )}
      <div style={{ fontSize: 11, color: labelColor, ...type.label }}>{label}</div>
      <div
        style={{
          fontSize: 28,
          color: valueColor,
          fontFamily: 'Inter',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1,
        }}
      >
        <CountUp to={value} startFrame={delay} endFrame={delay + 40} />
        {suffix}
      </div>
      {delta && (
        <div style={{ fontSize: 11, color: deltaColor, ...type.body, display: 'flex', alignItems: 'center', gap: 2 }}>
          <span>{deltaUp ? '↑' : '↓'}</span>
          {delta}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, seniorityColors, typography } from '../lib/theme';

interface BadgeProps {
  label: string;
  delay?: number;
  color?: string;
  bg?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  delay = 0,
  color = colors.purple,
  bg,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 22, stiffness: 300, mass: 1 },
    from: 0,
    to: 1,
  });

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 6,
        paddingBottom: 6,
        borderRadius: 999,
        backgroundColor: bg ?? `${color}18`,
        border: `1.5px solid ${color}40`,
        color,
        fontSize: 22,
        ...typography.body,
        fontWeight: 600,
        opacity: progress,
        transform: `scale(${interpolate(progress, [0, 1], [0.7, 1])})`,
        ...style,
      }}
    >
      {label}
    </span>
  );
};

export const SeniorityBadge: React.FC<{ seniority: string; delay?: number }> = ({ seniority, delay }) => (
  <Badge label={seniority} delay={delay} color={seniorityColors[seniority] ?? colors.gray600} />
);

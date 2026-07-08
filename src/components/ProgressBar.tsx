import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../lib/theme';

interface Props {
  value: number; // 0-100
  startFrame?: number;
  endFrame?: number;
  color?: string;
  trackColor?: string;
  height?: number;
  borderRadius?: number;
  style?: React.CSSProperties;
}

export const ProgressBar: React.FC<Props> = ({
  value,
  startFrame = 0,
  endFrame = 60,
  color = colors.purple,
  trackColor = colors.gray200,
  height = 8,
  borderRadius = 999,
  style,
}) => {
  const frame = useCurrentFrame();
  const animated = interpolate(frame, [startFrame, endFrame], [0, value], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: '100%',
        height,
        borderRadius,
        backgroundColor: trackColor,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${animated}%`,
          backgroundColor: color,
          borderRadius,
        }}
      />
    </div>
  );
};

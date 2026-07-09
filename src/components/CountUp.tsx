import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface Props {
  from?: number;
  to: number;
  startFrame?: number;
  endFrame?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  style?: React.CSSProperties;
}

export const CountUp: React.FC<Props> = ({
  from = 0,
  to,
  startFrame = 0,
  endFrame = 60,
  decimals = 0,
  suffix = '',
  prefix = '',
  style,
}) => {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [startFrame, endFrame], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <span style={style}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </span>
  );
};

import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';

interface Props {
  startFrame?: number;
  endFrame?: number;
  maxValue?: number;
  size?: number;
  accentColor?: string;
}

export const Speedometer: React.FC<Props> = ({
  startFrame = 0,
  endFrame = 50,
  maxValue = 200,
  size = 320,
  accentColor = '#FFD60A',
}) => {
  const frame = useCurrentFrame();

  const value = interpolate(frame, [startFrame, endFrame], [0, maxValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.2, 0, 0.8, 1),
  });

  const cx = size / 2;
  const cy = size / 2 + size * 0.08;
  const r = size * 0.38;

  // Arc: -200° to +20°, total 220°
  const startAngle = -200;
  const totalAngle = 220;
  const needleAngle = startAngle + (value / maxValue) * totalAngle;

  function polarToCartesian(angle: number, radius: number) {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  function describeArc(startDeg: number, endDeg: number, rad: number) {
    const s = polarToCartesian(startDeg, rad);
    const end = polarToCartesian(endDeg, rad);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${rad} ${rad} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  }

  const needle = polarToCartesian(needleAngle, r * 0.78);
  const needleBase1 = polarToCartesian(needleAngle + 90, 8);
  const needleBase2 = polarToCartesian(needleAngle - 90, 8);

  const appear = interpolate(frame, [startFrame, startFrame + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const tickAngles = [-200, -178, -156, -133, -111, -89, -67, -44, -22, 0, 20];

  return (
    <div style={{ width: size, height: size * 0.75, opacity: appear, position: 'relative' }}>
      <svg width={size} height={size * 0.75} viewBox={`0 0 ${size} ${size * 0.85}`}>
        {/* Outer background arc */}
        <path
          d={describeArc(-200, 20, r)}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={size * 0.055}
          strokeLinecap="round"
        />
        {/* Colored progress arc */}
        <path
          d={describeArc(-200, startAngle + (value / maxValue) * totalAngle, r)}
          fill="none"
          stroke={accentColor}
          strokeWidth={size * 0.055}
          strokeLinecap="round"
          opacity={0.9}
        />
        {/* Glow effect on progress arc */}
        <path
          d={describeArc(-200, startAngle + (value / maxValue) * totalAngle, r)}
          fill="none"
          stroke={accentColor}
          strokeWidth={size * 0.1}
          strokeLinecap="round"
          opacity={0.15}
        />

        {/* Tick marks */}
        {tickAngles.map((angle, i) => {
          const inner = polarToCartesian(angle, r * 0.88);
          const outer = polarToCartesian(angle, r * 0.98);
          const isMajor = i % 5 === 0;
          return (
            <line
              key={angle}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={isMajor ? 2 : 1}
            />
          );
        })}

        {/* Needle */}
        <polygon
          points={`${needle.x},${needle.y} ${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y}`}
          fill={accentColor}
          opacity={0.95}
        />
        {/* Needle center cap */}
        <circle cx={cx} cy={cy} r={12} fill={accentColor} opacity={0.9} />
        <circle cx={cx} cy={cy} r={5} fill="#000" />

        {/* Speed value */}
        <text
          x={cx}
          y={cy - r * 0.28}
          textAnchor="middle"
          fontSize={size * 0.16}
          fontWeight={700}
          fontFamily="Inter"
          fill="#fff"
        >
          {Math.round(value)}
        </text>
        <text
          x={cx}
          y={cy - r * 0.1}
          textAnchor="middle"
          fontSize={size * 0.055}
          fontFamily="Inter"
          fill="rgba(255,255,255,0.4)"
        >
          time-to-hire (days)
        </text>

        {/* Min/Max labels */}
        <text
          x={polarToCartesian(-200, r * 1.15).x}
          y={polarToCartesian(-200, r * 1.15).y + 4}
          textAnchor="middle"
          fontSize={size * 0.04}
          fontFamily="Inter"
          fill="rgba(255,255,255,0.3)"
        >
          0
        </text>
        <text
          x={polarToCartesian(20, r * 1.15).x}
          y={polarToCartesian(20, r * 1.15).y + 4}
          textAnchor="middle"
          fontSize={size * 0.04}
          fontFamily="Inter"
          fill="rgba(255,255,255,0.3)"
        >
          {maxValue}
        </text>
      </svg>
    </div>
  );
};

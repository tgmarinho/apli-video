import React from 'react';
import { useCurrentFrame } from 'remotion';
import { e, slide } from '../lib/easing';

interface Props {
  delay?: number;
  duration?: number;
  translateY?: number;
  translateX?: number;
  scale?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

// Universal entry animation — 12px translate + fade, Apple easing.
// Never bounces. Never overshoots.
export const FadeIn: React.FC<Props> = ({
  delay = 0,
  duration = 12,
  translateY = 12,
  translateX = 0,
  scale = false,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = e(frame, delay, duration);
  const ty = slide(frame, delay, duration, translateY, 0);
  const tx = slide(frame, delay, duration, translateX, 0);
  const sc = scale ? slide(frame, delay, duration, 0.96, 1) : 1;

  return (
    <div
      style={{
        opacity: p,
        transform: `translate(${tx}px, ${ty}px) scale(${sc})`,
        willChange: 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

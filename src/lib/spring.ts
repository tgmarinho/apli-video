import { spring, SpringConfig, useCurrentFrame, useVideoConfig } from 'remotion';

export const SPRING_SNAPPY: SpringConfig = { damping: 26, stiffness: 340, mass: 1, overshootClamping: false };
export const SPRING_GENTLE: SpringConfig = { damping: 40, stiffness: 200, mass: 1, overshootClamping: false };
export const SPRING_BOUNCY: SpringConfig = { damping: 14, stiffness: 260, mass: 1, overshootClamping: false };

export function useSpring(from: number, config: SpringConfig = SPRING_SNAPPY) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame, fps, config, from, to: 1 });
}

export function useDelayedSpring(delayFrames: number, config: SpringConfig = SPRING_SNAPPY) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: Math.max(0, frame - delayFrames), fps, config, from: 0, to: 1 });
}

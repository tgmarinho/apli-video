import { Easing, interpolate } from 'remotion';

// One easing curve for the entire video — Apple's ease-out-expo feel
export const APPLE_EASE = Easing.bezier(0.22, 1, 0.36, 1);

// Core helper: fade in a value from 0→1 over `duration` frames, starting at `delay`
export function e(frame: number, delay: number, duration: number): number {
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: APPLE_EASE,
  });
}

// Fade out a value from 1→0
export function eOut(frame: number, delay: number, duration: number): number {
  return 1 - e(frame, delay, duration);
}

// Translate value: start at `from`, end at `to`, using same easing
export function slide(frame: number, delay: number, duration: number, from: number, to: number): number {
  return interpolate(frame, [delay, delay + duration], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: APPLE_EASE,
  });
}

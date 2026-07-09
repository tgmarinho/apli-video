import React from 'react';
import { AbsoluteFill } from 'remotion';
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from '@remotion/transitions';

// Smooth premium fade — subtle scale 1.015→1 + opacity.
// Use this for ALL scene transitions: no harsh cuts, no wipes, no burns.
export const premiumFade = (): TransitionPresentation<Record<string, unknown>> => {
  const PremiumFade = ({
    children,
    presentationDirection,
    presentationProgress,
  }: TransitionPresentationComponentProps<Record<string, unknown>>) => {
    const p = presentationProgress;
    const isEntering = presentationDirection === 'entering';
    const opacity = isEntering ? p : 1 - p;
    const scale = isEntering ? (1.015 - 0.015 * p) : (1 - 0.015 * p);
    return (
      <AbsoluteFill
        style={{
          opacity,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </AbsoluteFill>
    );
  };
  return { component: PremiumFade, props: {} };
};

// Pure CSS film-burn flash — works without HTML-in-Canvas flag.
// Exiting scene dissolves to orange; entering scene emerges from orange.
export const burnFlash = (): TransitionPresentation<Record<string, unknown>> => {
  const BurnFlash = ({
    children,
    presentationDirection,
    presentationProgress,
  }: TransitionPresentationComponentProps<Record<string, unknown>>) => {
    const isEntering = presentationDirection === 'entering';
    const contentOpacity = isEntering ? presentationProgress : 1 - presentationProgress;
    const burnOpacity = isEntering ? 1 - presentationProgress : presentationProgress;

    return (
      <AbsoluteFill>
        <AbsoluteFill style={{ opacity: contentOpacity }}>{children}</AbsoluteFill>
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, #ff8800 0%, #cc4400 60%, #000 100%)',
            opacity: burnOpacity * 0.92,
            pointerEvents: 'none',
          }}
        />
      </AbsoluteFill>
    );
  };

  return { component: BurnFlash, props: {} };
};

// Soft white flash — good for the light-entering-darkness moment
export const whiteFlash = (): TransitionPresentation<Record<string, unknown>> => {
  const WhiteFlash = ({
    children,
    presentationDirection,
    presentationProgress,
  }: TransitionPresentationComponentProps<Record<string, unknown>>) => {
    const isEntering = presentationDirection === 'entering';
    const contentOpacity = isEntering ? presentationProgress : 1 - presentationProgress;
    const flashOpacity = isEntering ? 1 - presentationProgress : presentationProgress;

    return (
      <AbsoluteFill>
        <AbsoluteFill style={{ opacity: contentOpacity }}>{children}</AbsoluteFill>
        <AbsoluteFill style={{ backgroundColor: '#ffffff', opacity: flashOpacity * 0.95, pointerEvents: 'none' }} />
      </AbsoluteFill>
    );
  };

  return { component: WhiteFlash, props: {} };
};

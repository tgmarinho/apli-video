import React from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, type } from '../lib/theme';

interface Props {
  msgType: 'user' | 'agent';
  name: string;
  text?: string;
  delay?: number;
  children?: React.ReactNode;
}

export const ChatMessage: React.FC<Props> = ({ msgType, name, text, delay = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 28, stiffness: 260, mass: 1, overshootClamping: false },
  });

  const isAgent = msgType === 'agent';

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: '10px 20px',
        backgroundColor: isAgent ? brand.slackHighlight : 'transparent',
        borderRadius: isAgent ? 8 : 0,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [10, 0])}px)`,
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          backgroundColor: isAgent ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)',
          border: `1px solid rgba(255,255,255,0.1)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: 18,
        }}
      >
        {isAgent ? (
          <Img
            src={staticFile('brand/kochavit.png')}
            width={20}
            height={20}
            style={{ objectFit: 'contain', filter: 'invert(1) brightness(0.9)', borderRadius: 2 }}
          />
        ) : (
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter', fontWeight: 600 }}>VZ</span>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {/* Name + timestamp */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 14, color: brand.slackText, ...type.semibold }}>{name}</span>
          {isAgent && (
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, padding: '1px 5px', ...type.body }}>
              APP
            </span>
          )}
          <span style={{ fontSize: 11, color: brand.slackTextMuted, ...type.body }}>Today at 2:47 PM</span>
        </div>

        {/* Text */}
        {text && (
          <p style={{ fontSize: 15, color: brand.slackText, ...type.body, margin: 0, lineHeight: 1.6 }}>
            {text}
          </p>
        )}

        {/* Embedded content (candidate cards etc) */}
        {children}
      </div>
    </div>
  );
};

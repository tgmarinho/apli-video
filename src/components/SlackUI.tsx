import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, type } from '../lib/theme';

const CHANNELS = ['general', 'engineering', 'hiring', 'dev-tools', 'onboarding'];

function Sidebar() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = spring({
    frame,
    fps,
    config: { damping: 30, stiffness: 240, mass: 1, overshootClamping: false },
  });

  return (
    <div
      style={{
        width: 240,
        height: '100%',
        backgroundColor: brand.slackDark,
        borderRight: `1px solid ${brand.slackBorder}`,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        opacity: p,
      }}
    >
      {/* Workspace header */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: `1px solid ${brand.slackBorder}`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            backgroundColor: 'rgba(255,255,255,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 13, fontFamily: 'Inter', fontWeight: 800, color: '#000' }}>A</span>
        </div>
        <div>
          <div style={{ fontSize: 13, color: brand.slackText, ...type.semibold }}>Amplify IT</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#2ea043' }} />
            <span style={{ fontSize: 11, color: brand.slackTextMuted, ...type.body }}>Pro · 24 members</span>
          </div>
        </div>
      </div>

      {/* Channels */}
      <div style={{ padding: '12px 8px', flex: 1 }}>
        <div style={{ fontSize: 11, color: brand.slackTextMuted, ...type.label, padding: '0 8px 6px' }}>
          Channels
        </div>
        {CHANNELS.map((ch, i) => {
          const isActive = ch === 'hiring';
          const itemP = spring({
            frame: Math.max(0, frame - (3 + i * 4)),
            fps,
            config: { damping: 28, stiffness: 260, mass: 1, overshootClamping: false },
          });

          return (
            <div
              key={ch}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '5px 8px',
                borderRadius: 5,
                backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                opacity: itemP,
                transform: `translateX(${interpolate(itemP, [0, 1], [-6, 0])}px)`,
                marginBottom: 1,
              }}
            >
              <span style={{ fontSize: 14, color: brand.slackTextMuted }}>#</span>
              <span
                style={{
                  fontSize: 13,
                  color: isActive ? brand.slackText : brand.slackTextMuted,
                  ...(isActive ? type.semibold : type.body),
                }}
              >
                {ch}
              </span>
              {isActive && (
                <div style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.5)' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* User footer */}
      <div
        style={{
          padding: '10px 16px',
          borderTop: `1px solid ${brand.slackBorder}`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', ...type.semibold }}>VZ</span>
        </div>
        <span style={{ fontSize: 12, color: brand.slackTextMuted, ...type.body }}>vitor</span>
        <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#2ea043' }} />
      </div>
    </div>
  );
}

interface SlackUIProps {
  children: React.ReactNode;
}

export const SlackUI: React.FC<SlackUIProps> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainP = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: { damping: 30, stiffness: 240, mass: 1, overshootClamping: false },
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: brand.slackSurface,
        display: 'flex',
        fontFamily: 'Inter',
      }}
    >
      <Sidebar />

      {/* Main channel content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', opacity: mainP }}>
        {/* Channel header */}
        <div
          style={{
            height: 52,
            borderBottom: `1px solid ${brand.slackBorder}`,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 20,
            gap: 6,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 16, color: brand.slackTextMuted }}>#</span>
          <span style={{ fontSize: 16, color: brand.slackText, ...type.semibold }}>hiring</span>
          <div style={{ width: 1, height: 18, backgroundColor: brand.slackBorder, marginLeft: 8, marginRight: 8 }} />
          <span style={{ fontSize: 13, color: brand.slackTextMuted, ...type.body }}>
            Engineering team hiring board · managed by Amplify AI
          </span>
        </div>

        {/* Message thread */}
        <div
          style={{
            flex: 1,
            padding: '20px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            overflowY: 'hidden',
          }}
        >
          {children}
        </div>

        {/* Message input bar */}
        <div
          style={{
            margin: '0 20px 20px',
            border: `1px solid rgba(255,255,255,0.12)`,
            borderRadius: 8,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 14,
            gap: 8,
          }}
        >
          <span style={{ fontSize: 13, color: brand.slackTextMuted, ...type.body }}>
            Message #hiring
          </span>
        </div>
      </div>
    </div>
  );
};

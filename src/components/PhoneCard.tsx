import React from 'react';
import { useCurrentFrame } from 'remotion';
import { e, slide } from '../lib/easing';

interface Props {
  startFrame?: number;
  showAccepted?: boolean;
  showSlack?: boolean;
}

export const PhoneCard: React.FC<Props> = ({ startFrame = 0, showAccepted = false, showSlack = false }) => {
  const frame = useCurrentFrame();
  const phoneP = e(frame, startFrame, 14);
  const notifP = e(frame, startFrame + 16, 10);
  const slackP = e(frame, startFrame + 36, 10);

  const W = 280;
  const H = 480;

  return (
    <div
      style={{
        width: W,
        height: H,
        position: 'relative',
        opacity: phoneP,
        transform: `translateY(${slide(frame, startFrame, 14, 24, 0)}px) scale(${slide(frame, startFrame, 14, 0.96, 1)})`,
      }}
    >
      {/* Phone frame */}
      <div
        style={{
          width: W,
          height: H,
          borderRadius: 42,
          backgroundColor: '#1a1a1a',
          border: '2px solid rgba(255,255,255,0.12)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Status bar */}
        <div
          style={{
            height: 40,
            backgroundColor: '#111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 80,
              height: 20,
              backgroundColor: '#000',
              borderRadius: 10,
            }}
          />
        </div>

        {/* Screen content */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#0d0d0d',
            height: H - 40,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {/* Notification: Accepted */}
          <div
            style={{
              opacity: notifP,
              transform: `translateY(${slide(frame, startFrame + 16, 10, 10, 0)}px)`,
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 16,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: '#0a84ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              ✅
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: 'Inter', marginBottom: 2 }}>
                Amplify ATS
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter', lineHeight: 1.4 }}>
                <strong style={{ color: '#fff' }}>André Santos</strong> accepted your offer
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'Inter', marginTop: 4 }}>
                Senior Eng · Stripe · Starts July 1
              </div>
            </div>
          </div>

          {/* Slack notification */}
          <div
            style={{
              opacity: slackP,
              transform: `translateY(${slide(frame, startFrame + 36, 10, 10, 0)}px)`,
              backgroundColor: 'rgba(97,31,105,0.15)',
              border: '1px solid rgba(97,31,105,0.35)',
              borderRadius: 16,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: '#611f69',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 700,
                color: '#fff',
                fontFamily: 'Inter',
                flexShrink: 0,
              }}
            >
              S
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: 'Inter', marginBottom: 2 }}>
                #new-hires
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter', lineHeight: 1.4 }}>
                Welcome to the team, André! 🚀
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'Inter', marginTop: 4 }}>
                12 reactions · 4 replies
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

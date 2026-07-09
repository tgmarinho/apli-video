import React from 'react';
import { useCurrentFrame } from 'remotion';
import { e, slide } from '../lib/easing';

interface Action {
  icon: string;
  action: string;
  detail: string;
  delay: number;
}

const ACTIONS: Action[] = [
  { icon: '📄', action: 'Application received',      detail: 'Pedro Costa · Senior Backend Engineer', delay: 8  },
  { icon: '🔍', action: 'AI scans resume',            detail: '12 skills extracted in 0.3s',           delay: 18 },
  { icon: '🏆', action: 'Candidate ranked',           detail: '#3 of 47 · Amplify Score: 89/100',      delay: 28 },
  { icon: '📝', action: 'Summary written',            detail: '7y exp · Go · Postgres · LATAM',        delay: 36 },
  { icon: '📅', action: 'Interview booked',           detail: 'Mon Jun 30 · 10:00 AM BRT',             delay: 44 },
  { icon: '📋', action: 'Scorecard created',          detail: 'Sent to hiring manager',                delay: 52 },
  { icon: '✉️',  action: 'Follow-up email sent',      detail: '"Thanks for applying, Pedro…"',         delay: 60 },
  { icon: '🔗', action: 'CRM updated',                detail: 'Stage: Shortlisted · Owner: You',       delay: 68 },
];

export const DominoTimeline: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      {ACTIONS.map((item) => {
        const appear = e(frame, item.delay, 9);
        const check  = e(frame, item.delay + 7, 6);

        return (
          <div
            key={item.action}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              opacity: appear,
              transform: `translateX(${slide(frame, item.delay, 9, -16, 0)}px)`,
            }}
          >
            {/* Icon */}
            <div
              style={{
                fontSize: 18,
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(10,132,255,0.12)',
                borderRadius: 9,
                flexShrink: 0,
              }}
            >
              {item.icon}
            </div>

            {/* Text */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', fontFamily: 'Inter', lineHeight: 1.3 }}>
                {item.action}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)', fontFamily: 'Inter', marginTop: 1 }}>
                {item.detail}
              </div>
            </div>

            {/* Checkmark */}
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                backgroundColor: 'rgba(10,214,110,0.18)',
                border: '1.5px solid rgba(10,214,110,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                color: '#0ad66e',
                opacity: check,
                transform: `scale(${slide(frame, item.delay + 7, 6, 0.5, 1)})`,
                flexShrink: 0,
              }}
            >
              ✓
            </div>

            {/* Connector line to next item */}
            {ACTIONS.indexOf(item) < ACTIONS.length - 1 && (
              <div
                style={{
                  position: 'absolute',
                  left: 17,
                  width: 1.5,
                  height: 10,
                  backgroundColor: 'rgba(10,132,255,0.2)',
                  marginTop: 36,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { e, slide } from '../lib/easing';

interface Notification {
  app: string;
  color: string;
  icon: string;
  text: string;
  time: string;
}

interface Props {
  notification: Notification;
  delay: number;
  posX?: number;  // px offset from center for scattered feel
  posY?: number;
}

export const NotificationCard: React.FC<Props> = ({ notification, delay, posX = 0, posY = 0 }) => {
  const frame = useCurrentFrame();
  const p = e(frame, delay, 10);

  return (
    <div
      style={{
        position: 'absolute',
        left: `calc(50% + ${posX}px - 200px)`,
        top: `calc(50% + ${posY}px - 36px)`,
        width: 400,
        opacity: p,
        transform: `translateY(${slide(frame, delay, 10, 8, 0)}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 14,
        padding: '10px 14px',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* App icon */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          backgroundColor: notification.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 700,
          color: '#fff',
          flexShrink: 0,
          fontFamily: 'Inter',
        }}
      >
        {notification.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.9)', fontFamily: 'Inter' }}>
            {notification.app}
          </span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter' }}>
            {notification.time}
          </span>
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.55)',
            fontFamily: 'Inter',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {notification.text}
        </div>
      </div>
    </div>
  );
};

export const NOTIFICATIONS: Array<Notification & { posX: number; posY: number; delay: number }> = [
  { app: 'Slack',      color: '#611f69', icon: 'S',  text: 'New message in #engineering-hiring',   time: 'now', posX: -240, posY: -280, delay: 10 },
  { app: 'Gmail',      color: '#EA4335', icon: 'G',  text: 'Re: Interview feedback — Sarah M.',    time: '1m',  posX:  180, posY: -220, delay: 17 },
  { app: 'LinkedIn',   color: '#0077B5', icon: 'in', text: 'New application: Pedro Costa',         time: '2m',  posX: -300, posY: -120, delay: 24 },
  { app: 'Greenhouse', color: '#3DB44A', icon: 'G',  text: 'Interview scheduled: Mon 10:00 AM',    time: '3m',  posX:  220, posY: -80,  delay: 29 },
  { app: 'Calendly',   color: '#0069ff', icon: 'C',  text: 'Phone screen in 30 minutes',           time: '4m',  posX: -180, posY:  60,  delay: 33 },
  { app: 'Sheets',     color: '#0f9d58', icon: '📊', text: 'Row added: Candidates tracker',        time: '5m',  posX:  260, posY:  100, delay: 37 },
  { app: 'WhatsApp',   color: '#25D366', icon: 'W',  text: 'Candidate wants to reschedule…',       time: '6m',  posX: -260, posY:  220, delay: 40 },
  { app: 'PDF',        color: '#D93025', icon: '↓',  text: 'CV_Andre_Souza_Senior_2025.pdf',       time: '7m',  posX:  160, posY:  250, delay: 43 },
];

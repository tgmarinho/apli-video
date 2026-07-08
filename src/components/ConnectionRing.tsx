import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { e, slide } from '../lib/easing';
import { brand } from '../lib/theme';

interface AppNode {
  label: string;
  color: string;
  icon: string;
  angle: number; // degrees
  radius: number;
}

const APPS: AppNode[] = [
  { label: 'Gmail',    color: '#EA4335', icon: 'G',  angle: 270, radius: 310 },
  { label: 'Slack',    color: '#611f69', icon: 'S',  angle: 315, radius: 340 },
  { label: 'Calendar', color: '#0069ff', icon: '📅', angle: 0,   radius: 310 },
  { label: 'LinkedIn', color: '#0077B5', icon: 'in', angle: 45,  radius: 320 },
  { label: 'WhatsApp', color: '#25D366', icon: 'W',  angle: 90,  radius: 310 },
  { label: 'GitHub',   color: '#333',    icon: '<>',  angle: 135, radius: 330 },
  { label: 'Notion',   color: '#000',    icon: 'N',  angle: 180, radius: 310 },
  { label: 'Sheets',   color: '#0f9d58', icon: '📊', angle: 225, radius: 320 },
];

const CENTER = { x: 960, y: 540 };
const STAGGER = 7; // frames between each connection

function getNodePos(app: AppNode) {
  const rad = (app.angle * Math.PI) / 180;
  return { x: CENTER.x + Math.cos(rad) * app.radius, y: CENTER.y + Math.sin(rad) * app.radius };
}

interface Props {
  startFrame?: number;
}

export const ConnectionRing: React.FC<Props> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* SVG connection lines */}
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
        {APPS.map((app, i) => {
          const delay = startFrame + 20 + i * STAGGER;
          const p = e(frame, delay, 14);
          const pos = getNodePos(app);
          const curX = CENTER.x + (pos.x - CENTER.x) * p;
          const curY = CENTER.y + (pos.y - CENTER.y) * p;

          return (
            <g key={app.label}>
              <line
                x1={CENTER.x}
                y1={CENTER.y}
                x2={curX}
                y2={curY}
                stroke="rgba(10,132,255,0.35)"
                strokeWidth={1.5}
              />
              {/* Glow dot at connection tip */}
              {p > 0.1 && (
                <circle cx={curX} cy={curY} r={3 * p} fill="#0a84ff" opacity={0.7 * p} />
              )}
            </g>
          );
        })}
      </svg>

      {/* App nodes */}
      {APPS.map((app, i) => {
        const delay = startFrame + 20 + i * STAGGER + 10;
        const p = e(frame, delay, 10);
        const pos = getNodePos(app);

        return (
          <div
            key={app.label}
            style={{
              position: 'absolute',
              left: pos.x - 26,
              top: pos.y - 26,
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: app.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 700,
              color: '#fff',
              fontFamily: 'Inter',
              opacity: p,
              transform: `scale(${slide(frame, delay, 10, 0.7, 1)})`,
              boxShadow: `0 0 20px ${app.color}44`,
            }}
          >
            {app.icon}
          </div>
        );
      })}

      {/* App labels */}
      {APPS.map((app, i) => {
        const delay = startFrame + 28 + i * STAGGER;
        const p = e(frame, delay, 10);
        const pos = getNodePos(app);
        const isRight = pos.x > CENTER.x + 50;
        const isLeft = pos.x < CENTER.x - 50;
        const offsetX = isRight ? 34 : isLeft ? -34 : 0;
        const offsetY = pos.y < CENTER.y - 50 ? -34 : pos.y > CENTER.y + 50 ? 34 : 0;

        return (
          <div
            key={`label-${app.label}`}
            style={{
              position: 'absolute',
              left: pos.x + offsetX - 40,
              top: pos.y + offsetY - 10,
              width: 80,
              textAlign: 'center',
              fontSize: 11,
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'Inter',
              fontWeight: 500,
              opacity: p,
            }}
          >
            {app.label}
          </div>
        );
      })}

      {/* Center Amplify node */}
      <div
        style={{
          position: 'absolute',
          left: CENTER.x - 48,
          top: CENTER.y - 48,
          width: 96,
          height: 96,
          borderRadius: '50%',
          backgroundColor: 'rgba(10,132,255,0.12)',
          border: '1.5px solid rgba(10,132,255,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: e(frame, startFrame, 14),
          transform: `scale(${slide(frame, startFrame, 14, 0.8, 1)})`,
          boxShadow: '0 0 40px rgba(10,132,255,0.3)',
        }}
      >
        <Img
          src={staticFile('brand/kochavit.png')}
          width={44}
          height={44}
          style={{ objectFit: 'contain', filter: 'invert(1) brightness(2)' }}
        />
      </div>

      {/* Orbital glow ring around center */}
      <svg
        width="1920"
        height="1080"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={78}
          fill="none"
          stroke="rgba(10,132,255,0.2)"
          strokeWidth={1}
          opacity={e(frame, startFrame + 4, 12)}
        />
      </svg>
    </div>
  );
};

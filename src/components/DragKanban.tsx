import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, getScoreColor, seniorityColor, type } from '../lib/theme';
import { CandidateData } from './CandidateCardUI';
import { KanbanColumn } from './KanbanColumn';

// ─── Layout constants ─────────────────────────────────────────────────────────
// Sidebar: 200px, content padding: 28px → content starts at 228px
// 4 columns, gap 14px, content width = 1920-200-56 = 1664px
// Column width = (1664 - 3×14) / 4 = 405.5px ≈ 406px
//
// Column x positions (left edge, absolute screen):
//   Col 0 Applied:     228
//   Col 1 Shortlisted: 228 + (406+14)*1 = 648
//   Col 2 Interview:   228 + (406+14)*2 = 1068
//
// Cards sit inside an 8px-padded container → card left = col_x + 8
const CARD_START_X = 656;   // Shortlisted col x + 8px
const CARD_END_X   = 1076;  // Interview col x + 8px
const CARD_W       = 390;   // column width - 2×8px padding

// Vertical: TopBar(52) + paddingTop(22) + h1(~26) + subtitle(~17) + gap(14)
// + filter chips(~21) + gap(14) + col-header(~34) + card-container-padding(8)
const CARD_Y = 208;

// Duration of the full drag animation in frames
const DRAG_DURATION = 52;

interface Props {
  columns: {
    title: string;
    count: number;
    candidates: CandidateData[];
    accentColor?: string;
  }[];
  startDelay?: number;
  draggingCandidate: CandidateData;
  dragStartFrame?: number;
}

// ─── Flying card overlay ──────────────────────────────────────────────────────
function FloatingCard({ candidate, startFrame }: { candidate: CandidateData; startFrame: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Lift spring — starts immediately
  const liftP = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 22, stiffness: 300, mass: 1, overshootClamping: false },
  });

  // Move spring — slight delay after lift
  const moveP = spring({
    frame: Math.max(0, frame - (startFrame + 8)),
    fps,
    config: { damping: 18, stiffness: 160, mass: 1.2, overshootClamping: false },
  });

  // Drop spring — triggers near the end so card settles before column swap
  const dropP = spring({
    frame: Math.max(0, frame - (startFrame + DRAG_DURATION - 18)),
    fps,
    config: { damping: 28, stiffness: 260, mass: 1, overshootClamping: false },
  });

  // Only visible while in flight — disappears the exact frame the column card appears
  if (frame < startFrame || frame >= startFrame + DRAG_DURATION) return null;

  const x = CARD_START_X + moveP * (CARD_END_X - CARD_START_X);
  const scale = 1 + liftP * 0.03 - dropP * 0.03;
  const rotation = liftP * 2 - dropP * 2;
  const shadowBlur = liftP * 28 - dropP * 24;
  const shadowOpacity = liftP * 0.22 - dropP * 0.18;

  const sc = getScoreColor(candidate.mlScore);
  const sn = seniorityColor[candidate.seniority] ?? seniorityColor['MID'];
  const initials = candidate.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: CARD_Y,
        width: CARD_W,
        zIndex: 100,
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        transformOrigin: 'top left',
        boxShadow: `0 ${Math.max(0, shadowBlur)}px ${Math.max(0, shadowBlur * 2)}px rgba(0,0,0,${Math.max(0, shadowOpacity)})`,
        backgroundColor: brand.white,
        border: `1.5px solid ${brand.borderMedium}`,
        borderRadius: brand.radiusMd,
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
        cursor: 'grabbing',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${sc.border}`, flexShrink: 0 }}>
          {candidate.avatarSrc
            ? <Img src={staticFile(candidate.avatarSrc)} width={38} height={38} style={{ objectFit: 'cover' }} />
            : <div style={{ width: 38, height: 38, backgroundColor: sc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 13, color: sc.text, fontFamily: 'Inter', fontWeight: 600 }}>{initials}</span>
              </div>
          }
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, color: brand.textPrimary, ...type.semibold }}>{candidate.name}</div>
          <div style={{ fontSize: 12, color: brand.textSubtle, ...type.body }}>{candidate.role}</div>
        </div>
        <span style={{ fontSize: 11, color: sn.text, backgroundColor: sn.bg, border: `1px solid ${sn.border}`, borderRadius: 999, padding: '1px 7px', fontFamily: 'Inter', fontWeight: 600 }}>
          {candidate.seniority}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{ flex: 1, height: 3, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${candidate.mlScore}%`, height: '100%', backgroundColor: sc.text, borderRadius: 999, opacity: 0.65 }} />
        </div>
        <span style={{ fontSize: 11, color: sc.text, backgroundColor: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 999, padding: '1px 6px', fontFamily: 'Inter', fontWeight: 600 }}>
          {candidate.mlScore}
        </span>
      </div>
    </div>
  );
}

// ─── Highlight ring on Interview column after landing ─────────────────────────
function LandingHighlight({ active, delay }: { active: boolean; delay: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 20, stiffness: 400, mass: 0.8, overshootClamping: false } });
  const fade = interpolate(frame, [delay + 20, delay + 40], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  if (!active) return null;
  return (
    <div style={{
      position: 'absolute',
      top: CARD_Y - 6,
      left: CARD_END_X - 6,
      width: CARD_W + 12,
      height: 80,
      borderRadius: brand.radiusMd + 4,
      border: `2px solid rgba(59,130,246,${0.6 * fade})`,
      boxShadow: `0 0 20px rgba(59,130,246,${0.25 * fade})`,
      transform: `scale(${interpolate(p, [0, 1], [0.96, 1])})`,
      pointerEvents: 'none',
      zIndex: 99,
    }} />
  );
}

export const DragKanban: React.FC<Props> = ({
  columns,
  startDelay = 0,
  draggingCandidate,
  dragStartFrame = 40,
}) => {
  const frame = useCurrentFrame();

  // Card permanently leaves Shortlisted the moment drag starts
  const hasLiftedOff = frame >= dragStartFrame;
  // Card appears in Interview the exact frame the floating card disappears — no overlap
  const hasFullyLanded = frame >= dragStartFrame + DRAG_DURATION;

  const colsWithDragState = columns.map((col) => {
    if (col.title === 'Shortlisted' && hasLiftedOff) {
      // Permanently remove from source column
      return { ...col, candidates: col.candidates.slice(1) };
    }
    if (col.title === 'Interview' && hasFullyLanded) {
      // Swap floating card → real column card atomically
      return {
        ...col,
        count: col.count + 1,
        candidates: [draggingCandidate, ...col.candidates],
      };
    }
    return col;
  });

  // Interview column gets a blue glow ring when card lands
  const showLandingGlow = frame >= dragStartFrame + DRAG_DURATION && frame < dragStartFrame + DRAG_DURATION + 30;

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, flex: 1 }}>
        {colsWithDragState.map((col, i) => (
          <KanbanColumn
            key={col.title}
            title={col.title}
            count={col.count}
            candidates={col.candidates}
            startDelay={startDelay + i * 6}
            accentColor={col.accentColor}
          />
        ))}
      </div>

      {/* Blue landing glow ring on Interview column */}
      <LandingHighlight active={showLandingGlow} delay={dragStartFrame + DRAG_DURATION} />

      {/* Flying card — hides at the exact frame column card takes over */}
      <FloatingCard candidate={draggingCandidate} startFrame={dragStartFrame} />
    </>
  );
};

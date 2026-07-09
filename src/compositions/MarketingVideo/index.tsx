import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { AgentTypingDots } from '../../components/AgentTypingDots';
import { CandidateCardUI } from '../../components/CandidateCardUI';
import { CandidateFilterBar } from '../../components/CandidateFilterBar';
import { CandidateListRow } from '../../components/CandidateListRow';
import { CandidateMatchCard } from '../../components/CandidateMatchCard';
import { ChatMessage } from '../../components/ChatMessage';
import { CinematicBars } from '../../components/CinematicBars';
import { ClosingCredits } from '../../components/ClosingCredits';
import { DragKanban } from '../../components/DragKanban';
import { FilmGrain } from '../../components/FilmGrain';
import { PipelineFunnel } from '../../components/PipelineFunnel';
import { SceneTitle } from '../../components/SceneTitle';
import { SlackUI } from '../../components/SlackUI';
import { StatCard } from '../../components/StatCard';
import { TypingText } from '../../components/TypingText';
import { premiumFade } from '../../lib/transitions';
import { brand, type } from '../../lib/theme';
import { MarketingVideoProps } from './schema';

// ─── Timings ──────────────────────────────────────────────────────────────────
// Act I:    70f  Act II:   60f  Act III:  50f
// Act IV-a: 120f Act IV-b: 100f Act IV-c: 100f
// Act IV-d: 75f  Act V:    70f  Act VI:   80f
// Sequences: 70+60+50+120+100+100+75+70+80 = 725f
// Transitions: 8×18f = 144f  |  Net: 725 - 144 = 581f ≈ 19.4s @ 30fps

// ─── Candidate data ───────────────────────────────────────────────────────────
const CANDIDATES = [
  {
    id: 'andre',
    name: 'André Souza',
    role: 'Senior Full-Stack Engineer',
    seniority: 'SENIOR' as const,
    yoe: 7,
    mlScore: 94,
    techStack: ['TypeScript', 'React', 'Node.js'],
    location: 'São Paulo · UTC-3',
    company: 'Nubank',
    avatarSrc: 'avatars/avatar-andre.svg',
    why: 'TypeScript 7y · React/Node.js · C1 English · $92K',
    hasInterview: true,
  },
  {
    id: 'julia',
    name: 'Julia Mota',
    role: 'Tech Lead · Backend',
    seniority: 'LEAD' as const,
    yoe: 9,
    mlScore: 91,
    techStack: ['Go', 'Postgres', 'K8s'],
    location: 'Rio de Janeiro · UTC-3',
    company: 'iFood',
    avatarSrc: 'avatars/avatar-julia.svg',
    why: 'Go & Node.js · Led 6-person team · C2 English',
  },
  {
    id: 'matheus',
    name: 'Matheus Lima',
    role: 'Senior Backend Engineer',
    seniority: 'SENIOR' as const,
    yoe: 6,
    mlScore: 88,
    techStack: ['Node.js', 'AWS', 'Postgres'],
    location: 'Bogotá · UTC-5',
    company: 'Rappi',
    avatarSrc: 'avatars/avatar-matheus.svg',
    why: 'Node.js/Postgres · Available now · $87K',
  },
  {
    id: 'camila',
    name: 'Camila Pereira',
    role: 'Frontend Lead',
    seniority: 'SENIOR' as const,
    yoe: 6,
    mlScore: 85,
    techStack: ['React', 'Next.js', 'Tailwind'],
    location: 'Buenos Aires · UTC-3',
    company: 'Mercado Livre',
    avatarSrc: 'avatars/avatar-camila.svg',
    why: 'React expert · Design systems · B2 English',
  },
];

const PIPELINE_COUNTS = [124, 97, 62, 38, 21, 9, 4];

const STAT_CARDS = [
  { label: 'Active Candidates', value: 847, delta: '+34 this week', deltaUp: true },
  { label: 'Shortlisted',       value: 62,  delta: '+8 this week',  deltaUp: true, isSuccess: true },
  { label: 'In Pipeline',       value: 355 },
  { label: 'Interviews',        value: 21,  delta: '4 this week',   deltaUp: true },
  { label: 'Offers Out',        value: 12,  delta: '3 accepted',    deltaUp: true, isSuccess: true },
  { label: 'Placed Q3',         value: 8,   delta: 'on target',     deltaUp: true, isSuccess: true },
  { label: 'Disqualified',      value: 18,  delta: '-5 vs last wk', deltaUp: false, isError: true },
];

const KANBAN_COLUMNS = [
  { title: 'Applied',     count: 22, candidates: [],                   accentColor: 'rgba(0,0,0,0.25)' },
  { title: 'Shortlisted', count: 4,  candidates: CANDIDATES.slice(0,4), accentColor: '#10b981' },
  { title: 'Interview',   count: 1,  candidates: [CANDIDATES[1]],       accentColor: '#3b82f6' },
  { title: 'Offer',       count: 1,  candidates: [CANDIDATES[0]],       accentColor: '#f59e0b' },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────
// variant: 'soft' = smooth cross fade, 'hard' = punchy stab, 'epic' = bass slam
function TransitionWhoosh({ variant = 'soft', volume }: { variant?: 'soft' | 'hard' | 'epic'; volume?: number }) {
  const src = variant === 'hard' ? 'sounds/transition-hard.mp3'
            : variant === 'epic' ? 'sounds/sfx-ending-climax.mp3'
            : 'sounds/transition.mp3';
  const defaultVol = variant === 'epic' ? 0.55 : variant === 'hard' ? 0.45 : 0.30;
  return <Audio src={staticFile(src)} startFrom={0} volume={volume ?? defaultVol} />;
}

function useS(delay = 0, cfg = { damping: 24, stiffness: 300, mass: 1, overshootClamping: false as boolean }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: Math.max(0, frame - delay), fps, config: cfg });
}

function lerp(p: number, from: number, to: number) {
  return interpolate(p, [0, 1], [from, to]);
}

// ─── Shared shell ─────────────────────────────────────────────────────────────
const NAV_ITEMS = ['Dashboard', 'Candidates', 'Roles', 'Interviews', 'Placements', 'Analytics'];

function TopBar({ label = 'Dashboard' }: { label?: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 32, stiffness: 260, mass: 1, overshootClamping: false } });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 52,
        backgroundColor: brand.white,
        borderBottom: `1px solid ${brand.borderSubtle}`,
        display: 'flex',
        alignItems: 'center',
        zIndex: 20,
        opacity: p,
      }}
    >
      <div style={{ width: 200, height: '100%', display: 'flex', alignItems: 'center', paddingLeft: 20, gap: 9, borderRight: `1px solid ${brand.borderSubtle}`, flexShrink: 0 }}>
        <Img src={staticFile('brand/kochavit.png')} width={18} height={18} style={{ objectFit: 'contain' }} />
        <span style={{ fontSize: 14, color: brand.textPrimary, ...type.semibold }}>Amplify IT</span>
        <span style={{ fontSize: 10, color: brand.white, backgroundColor: brand.textPrimary, borderRadius: 4, padding: '1px 5px', ...type.semibold }}>ATS</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: 20, gap: 7 }}>
        <span style={{ fontSize: 12, color: brand.textFaint, ...type.body }}>Workspace</span>
        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.15)' }}>/</span>
        <span style={{ fontSize: 12, color: brand.textSubtle, ...type.semibold }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingRight: 20 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981' }} />
        <span style={{ fontSize: 12, color: brand.textSubtle, ...type.body }}>vitorzucher@amplifyit.io</span>
        <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)', border: `1px solid rgba(0,0,0,0.08)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 10, color: brand.textMuted, ...type.semibold }}>VZ</span>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ activeItem = 'Dashboard' }: { activeItem?: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ position: 'absolute', left: 0, top: 52, bottom: 0, width: 200, backgroundColor: brand.white, borderRight: `1px solid ${brand.borderSubtle}`, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 2, zIndex: 10 }}>
      {NAV_ITEMS.map((item, i) => {
        const isActive = item === activeItem;
        const p = spring({ frame: Math.max(0, frame - (3 + i * 4)), fps, config: { damping: 30, stiffness: 260, mass: 1, overshootClamping: false } });
        return (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px', borderRadius: brand.radiusSm, backgroundColor: isActive ? 'rgba(0,0,0,0.05)' : 'transparent', opacity: p, transform: `translateX(${lerp(p, -8, 0)}px)` }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: isActive ? brand.textPrimary : 'transparent', border: isActive ? 'none' : `1px solid rgba(0,0,0,0.15)`, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: isActive ? brand.textPrimary : brand.textSubtle, ...(isActive ? type.semibold : type.body) }}>{item}</span>
          </div>
        );
      })}
      <div style={{ marginTop: 'auto', padding: '10px 12px' }}>
        <div style={{ fontSize: 10, color: brand.textFaint, ...type.label, marginBottom: 3 }}>Workspace</div>
        <div style={{ fontSize: 12, color: brand.textMuted, ...type.semibold }}>Amplify IT · Pro</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACT I — THE COST CRISIS (70f)
// ═══════════════════════════════════════════════════════════════════════════════
function ActI() {
  const frame = useCurrentFrame();
  const l1 = useS(0);
  const l2 = useS(14);
  const l3 = useS(32);
  const l4 = useS(52);

  const salary = interpolate(frame, [14, 48], [120, 450], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tokens = interpolate(frame, [18, 52], [4, 47], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const growth = interpolate(frame, [22, 56], [1.0, 3.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', fontFamily: 'Inter', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 120px', gap: 0 }}>
      <FilmGrain opacity={0.07} />
      <CinematicBars enterFrames={8} />

      {/* Hook headline — slams in immediately */}
      <div style={{ opacity: l1, transform: `translateY(${lerp(l1, 24, 0)}px)`, marginBottom: 10 }}>
        <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.2)', ...type.label, marginBottom: 10 }}>
          SAN FRANCISCO · 2025
        </div>
        <div style={{
          fontSize: 72, color: brand.white,
          fontFamily: 'Inter', fontWeight: 900,
          letterSpacing: '-0.05em', lineHeight: 0.95,
        }}>
          $450K
        </div>
        <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter', fontWeight: 500, marginTop: 6, letterSpacing: '-0.02em' }}>
          per engineer. per year.
        </div>
      </div>

      {/* Counters */}
      <div style={{ display: 'flex', gap: 0, opacity: l2, transform: `translateY(${lerp(l2, 16, 0)}px)`, marginTop: 24, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20 }}>
        {[
          { label: 'SF AI Engineer OTE', prefix: '$', value: Math.round(salary), suffix: 'K', color: '#ef4444', sub: 'one engineer · one year' },
          { label: 'AI token bill this month', prefix: '$', value: Math.round(tokens), suffix: 'K', color: '#f97316', sub: 'your second payroll line' },
          { label: 'Salary growth since 2023', prefix: '', value: growth.toFixed(1), suffix: '×', color: '#fbbf24', sub: 'and still climbing' },
        ].map(({ label, prefix, value, suffix, color, sub }, i) => (
          <div key={label} style={{ flex: 1, padding: '14px 22px', borderLeft: i > 0 ? `1px solid rgba(255,255,255,0.07)` : 'none' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', ...type.label, marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
            <div style={{ fontSize: 48, color, fontFamily: 'Inter', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>
              {prefix}{value}{suffix}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', ...type.body, marginTop: 5 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Kicker line */}
      <div style={{ marginTop: 22, opacity: l4, transform: `translateY(${lerp(l4, 8, 0)}px)` }}>
        <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter', fontWeight: 400, letterSpacing: '-0.01em' }}>
          You don't have a budget problem.
          <span style={{ color: 'rgba(255,255,255,0.18)' }}> You have a geography problem.</span>
        </div>
      </div>

      <SceneTitle act="ACT I" title="The Market" dark />
    </AbsoluteFill>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACT II — THE HIRING HELL (60f)
// ═══════════════════════════════════════════════════════════════════════════════
function ActII() {
  const frame = useCurrentFrame();

  // Hard stab on enter, then typewriter lines building to a gut-punch finish
  const lines = [
    { text: '127 applications.',            start: 2,  big: false },
    { text: 'You opened 8.',                start: 13, big: false },
    { text: 'Month 4.',                     start: 24, big: false },
    { text: 'Role still open.',             start: 34, big: false },
    { text: 'They accepted\nanother offer.', start: 43, big: true  },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#050505', fontFamily: 'Inter', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 160px', gap: 8 }}>
      <FilmGrain opacity={0.08} />
      <CinematicBars enterFrames={6} />
      <TransitionWhoosh variant="hard" />
      {/* Typewriter tick on each line reveal */}
      {lines.map(({ start }, i) => frame >= start && frame < start + 3
        ? <Audio key={`tick-${i}`} src={staticFile('sounds/sfx-snap.mp3')} startFrom={0} volume={0.18} />
        : null
      )}

      {lines.map(({ text, start, big }, i) => {
        const op = interpolate(frame, [start, start + 7], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const isGutPunch = big;
        return (
          <div
            key={i}
            style={{
              fontSize: isGutPunch ? 52 : 32,
              color: isGutPunch ? brand.white : 'rgba(255,255,255,0.22)',
              fontFamily: 'Inter',
              fontWeight: isGutPunch ? 800 : 400,
              letterSpacing: isGutPunch ? '-0.03em' : '-0.01em',
              lineHeight: 1.15,
              opacity: op,
              transform: `translateX(${lerp(op, isGutPunch ? -12 : -8, 0)}px)`,
              whiteSpace: 'pre-line',
            }}
          >
            <TypingText
              text={text}
              startFrame={start}
              charsPerFrame={isGutPunch ? 2.5 : 2.2}
              showCursor={frame < start + text.length + 10}
            />
          </div>
        );
      })}

      <SceneTitle act="ACT II" title="The Pain" dark />
    </AbsoluteFill>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACT III — MEET AMPLIFY (50f)
// ═══════════════════════════════════════════════════════════════════════════════
function ActIII() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoP   = spring({ frame, fps, config: { damping: 24, stiffness: 260, mass: 1, overshootClamping: false } });
  const textP   = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 28, stiffness: 220, mass: 1, overshootClamping: false } });
  const tagP    = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 30, stiffness: 240, mass: 1, overshootClamping: false } });
  const flood   = interpolate(frame, [38, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', fontFamily: 'Inter', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <FilmGrain opacity={0.06} />
      <CinematicBars enterFrames={10} />
      <TransitionWhoosh variant="hard" />

      <div style={{ opacity: logoP, transform: `scale(${lerp(logoP, 0.6, 1)})` }}>
        <Img src={staticFile('brand/kochavit.png')} width={56} height={56} style={{ objectFit: 'contain', filter: 'invert(1)' }} />
      </div>

      <div style={{ textAlign: 'center', opacity: textP, transform: `translateY(${lerp(textP, 16, 0)}px)` }}>
        <div style={{ fontSize: 46, color: brand.white, ...type.heading, lineHeight: 1.1 }}>
          Meet Amplify.
        </div>
        <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.35)', marginTop: 8, ...type.body }}>
          AI-native hiring. LATAM talent. One platform.
        </div>
      </div>

      <div style={{ opacity: tagP, transform: `translateY(${lerp(tagP, 10, 0)}px)`, display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['Pre-vetted engineers', 'UTC-3 to UTC-6', '$60–120K USD'].map((tag) => (
          <span key={tag} style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999, padding: '5px 16px', ...type.body }}>
            {tag}
          </span>
        ))}
      </div>

      <div style={{ position: 'absolute', inset: 0, backgroundColor: brand.white, opacity: flood, pointerEvents: 'none' }} />
      <SceneTitle act="ACT III" title="The Solution" dark />
    </AbsoluteFill>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACT IV-a — AGENT CHAT (120f)
// ═══════════════════════════════════════════════════════════════════════════════
const USER_MSG = 'I need a Senior TypeScript engineer — React & Node.js, strong English, LATAM timezone, $90K budget. Available in 2 weeks.';
const AGENT_THINKING = 'Analyzing 847 candidates…';
const AGENT_RESPONSE = 'Found 3 exceptional matches for your requirements:';

function ActIVa() {
  const frame = useCurrentFrame();

  // Timing:
  // 0–10:  scene loads
  // 8–55:  user message types in
  // 55–72: agent typing dots
  // 70–78: agent "Analyzing..." types
  // 78–86: agent response line appears
  // 86–120: 3 candidate cards stagger in

  const showDots   = frame >= 55 && frame < 80;
  const showThink  = frame >= 68;
  const showResp   = frame >= 82;
  const showCards  = frame >= 88;

  return (
    <AbsoluteFill style={{ fontFamily: 'Inter' }}>
      <TransitionWhoosh variant="soft" />
      {/* Keyboard typing during user message */}
      <Audio src={staticFile('sounds/sfx-keyboard.mp3')} startFrom={0} volume={0.28} />
      {/* Agent thinking ambient when dots appear */}
      {frame >= 54 && frame < 82 && <Audio src={staticFile('sounds/sfx-agent-thinking.mp3')} startFrom={0} volume={0.22} />}
      {/* Snap per candidate card reveal */}
      {frame >= 88 && frame < 92 && <Audio src={staticFile('sounds/sfx-snap.mp3')} startFrom={0} volume={0.2} />}
      {frame >= 98 && frame < 102 && <Audio src={staticFile('sounds/sfx-snap.mp3')} startFrom={0} volume={0.2} />}
      {frame >= 108 && frame < 112 && <Audio src={staticFile('sounds/sfx-snap.mp3')} startFrom={0} volume={0.2} />}
      <SlackUI>
        {/* User message */}
        <ChatMessage msgType="user" name="Vitor Zucher" delay={6}>
          <span style={{ fontSize: 15, color: brand.slackText, ...type.body, lineHeight: 1.6 }}>
            <TypingText text={USER_MSG} startFrame={8} charsPerFrame={1.6} showCursor={frame < 60} />
          </span>
        </ChatMessage>

        {/* Agent typing indicator */}
        {showDots && (
          <ChatMessage msgType="agent" name="Amplify AI" delay={55}>
            <AgentTypingDots startFrame={57} />
          </ChatMessage>
        )}

        {/* Agent thinking message */}
        {showThink && (
          <ChatMessage msgType="agent" name="Amplify AI" delay={68}>
            <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', ...type.body, fontStyle: 'italic' }}>
              <TypingText text={AGENT_THINKING} startFrame={70} charsPerFrame={2.2} showCursor={frame < 84} />
            </span>
          </ChatMessage>
        )}

        {/* Agent response + candidate cards */}
        {showResp && (
          <ChatMessage msgType="agent" name="Amplify AI" delay={82}>
            <p style={{ fontSize: 15, color: brand.slackText, ...type.semibold, margin: '0 0 10px' }}>
              {AGENT_RESPONSE}
            </p>
            {showCards && CANDIDATES.slice(0, 3).map((c, i) => (
              <CandidateMatchCard
                key={c.id}
                id={c.id}
                name={c.name}
                role={c.role}
                company={c.company}
                score={c.mlScore}
                why={c.why}
                delay={88 + i * 10}
              />
            ))}
          </ChatMessage>
        )}
      </SlackUI>

      <SceneTitle act="ACT IV" title="The Agent" dark />
    </AbsoluteFill>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACT IV-b — CANDIDATE POOL (100f)
// ═══════════════════════════════════════════════════════════════════════════════
const FILTERS = ['TypeScript', 'Senior', 'English C1+', '$80–100K', 'UTC-3 to UTC-6'];

const LIST_CANDIDATES = CANDIDATES.map((c, i) => ({
  id: c.id,
  rank: i + 1,
  name: c.name,
  role: c.role,
  seniority: c.seniority,
  company: c.company,
  score: c.mlScore,
  location: c.location,
  yoe: c.yoe,
  isTopMatch: i === 0,
}));

function ActIVb() {
  const titleP = useS(4);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.bg, fontFamily: 'Inter' }}>
      <TopBar label="Candidates" />
      <Sidebar activeItem="Candidates" />
      <TransitionWhoosh />

      <div style={{ position: 'absolute', left: 200, top: 52, right: 0, bottom: 0, padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Header */}
        <div style={{ opacity: titleP, transform: `translateY(${lerp(titleP, 8, 0)}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
            <h1 style={{ fontSize: 20, color: brand.textPrimary, margin: 0, ...type.heading }}>
              Senior TypeScript Engineer · Remote · LATAM
            </h1>
            <span style={{ fontSize: 11, color: '#065f46', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 999, padding: '3px 10px', ...type.semibold }}>
              Auto-generated from chat ✓
            </span>
          </div>
          <p style={{ fontSize: 12, color: brand.textSubtle, margin: 0, ...type.body }}>
            22 applicants · AI-ranked by fit · Stripe Engineering Team · $90K budget
          </p>
        </div>

        {/* Filter bar */}
        <CandidateFilterBar filters={FILTERS} startDelay={6} label="Filters active" />

        {/* Candidate list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          {LIST_CANDIDATES.map((c, i) => (
            <CandidateListRow key={c.id} candidate={c} delay={14 + i * 10} />
          ))}
        </div>

        {/* Bottom hint */}
        <div style={{ fontSize: 12, color: brand.textFaint, ...type.body, textAlign: 'center' }}>
          847 candidates pre-vetted · Showing top 4 matches for this role
        </div>
      </div>

      <SceneTitle act="ACT IV" title="The Talent Pool" />
    </AbsoluteFill>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACT IV-c — KANBAN + DRAG (100f)
// ═══════════════════════════════════════════════════════════════════════════════
function ActIVc() {
  const headerP = useS(4);

  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: brand.bg, fontFamily: 'Inter' }}>
      <TopBar label="Pipeline" />
      <Sidebar activeItem="Candidates" />
      <TransitionWhoosh />
      {/* Card lift sound when drag starts at frame 40 */}
      {frame >= 40 && frame < 44 && <Audio src={staticFile('sounds/sfx-drag-lift.mp3')} startFrom={0} volume={0.45} />}
      {/* Card drop sound when it lands at frame 92 (40 + DRAG_DURATION 52) */}
      {frame >= 92 && frame < 96 && <Audio src={staticFile('sounds/sfx-card-drop.mp3')} startFrom={0} volume={0.55} />}
      {/* Snap confirmation as card settles */}
      {frame >= 93 && frame < 96 && <Audio src={staticFile('sounds/sfx-snap.mp3')} startFrom={0} volume={0.22} />}

      <div style={{ position: 'absolute', left: 200, top: 52, right: 0, bottom: 0, padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Header */}
        <div style={{ opacity: headerP, transform: `translateY(${lerp(headerP, 8, 0)}px)` }}>
          <h1 style={{ fontSize: 20, color: brand.textPrimary, margin: 0, ...type.heading }}>
            Stripe — Senior TypeScript Engineer
          </h1>
          <p style={{ fontSize: 12, color: brand.textSubtle, margin: '3px 0 0', ...type.body }}>
            22 applicants · Drag to advance · AI-assisted pipeline
          </p>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6 }}>
          {['Senior', 'TypeScript', 'LATAM', 'UTC-3 – UTC-6'].map((chip, i) => {
            const cp = useS(4 + i * 4);
            return (
              <span
                key={chip}
                style={{ fontSize: 11, color: brand.textMuted, backgroundColor: 'rgba(0,0,0,0.04)', border: `1px solid rgba(0,0,0,0.08)`, borderRadius: 999, padding: '3px 10px', ...type.semibold, opacity: cp, transform: `scale(${lerp(cp, 0.94, 1)})` }}
              >
                {chip}
              </span>
            );
          })}
        </div>

        {/* Kanban with drag animation */}
        <div style={{ flex: 1, position: 'relative' }}>
          <DragKanban
            columns={KANBAN_COLUMNS}
            startDelay={6}
            draggingCandidate={CANDIDATES[0]}
            dragStartFrame={40}
          />
        </div>
      </div>

      <SceneTitle act="ACT IV" title="The Pipeline" />
    </AbsoluteFill>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACT IV-d — DASHBOARD (75f)
// ═══════════════════════════════════════════════════════════════════════════════
function RoleRow({ data, delay }: { data: { company: string; role: string; apps: number; status: 'active' | 'screening' | 'paused' }; delay: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 28, stiffness: 260, mass: 1, overshootClamping: false } });
  const dotColor = data.status === 'active' ? '#10b981' : data.status === 'screening' ? '#f59e0b' : 'rgba(0,0,0,0.2)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${brand.borderSubtle}`, opacity: p, transform: `translateX(${lerp(p, 8, 0)}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: 'rgba(0,0,0,0.03)', border: `1px solid rgba(0,0,0,0.06)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 5, flexShrink: 0 }}>
          <Img
            src={staticFile(`brand/companies/${data.company.toLowerCase().replace(/\s+/g, '')}.svg`)}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <div>
          <div style={{ fontSize: 13, color: brand.textPrimary, ...type.semibold }}>{data.company}</div>
          <div style={{ fontSize: 11, color: brand.textSubtle, ...type.body, marginTop: 1 }}>{data.role}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, color: brand.textFaint, ...type.body }}>{data.apps} apps</span>
        <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: dotColor }} />
      </div>
    </div>
  );
}

const OPEN_ROLES = [
  { company: 'Stripe',        role: 'Senior TypeScript Engineer', apps: 22, status: 'active' as const },
  { company: 'Nubank',        role: 'ML Engineer · LATAM',        apps: 15, status: 'screening' as const },
  { company: 'Mercado Livre', role: 'Staff DevOps Engineer',      apps: 8,  status: 'active' as const },
  { company: 'Clip',          role: 'Full-Stack Lead',            apps: 31, status: 'active' as const },
  { company: 'Kavak',         role: 'Principal Backend Eng.',     apps: 6,  status: 'paused' as const },
];

function ActIVd() {
  const titleP = useS(3);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.bg, fontFamily: 'Inter' }}>
      <TopBar label="Dashboard" />
      <Sidebar activeItem="Dashboard" />
      <TransitionWhoosh />

      <div style={{ position: 'absolute', left: 200, top: 52, right: 0, bottom: 0, padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ opacity: titleP, transform: `translateY(${lerp(titleP, 8, 0)}px)` }}>
          <h1 style={{ fontSize: 20, color: brand.textPrimary, margin: 0, ...type.heading }}>Talent Pipeline</h1>
          <p style={{ fontSize: 12, color: brand.textSubtle, margin: '3px 0 0', ...type.body }}>
            847 active · 23 open roles · Q3 on track · Updated now
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
          {STAT_CARDS.map((s, i) => (
            <StatCard key={s.label} label={s.label} value={s.value} delta={s.delta} deltaUp={s.deltaUp} delay={4 + i * 4} isSuccess={s.isSuccess} isError={s.isError} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 14, flex: 1, minHeight: 0 }}>
          <div style={{ flex: 1.6, backgroundColor: brand.white, border: `1px solid ${brand.borderSubtle}`, borderRadius: brand.radiusLg, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: 13, color: brand.textPrimary, margin: 0, ...type.semibold }}>Hiring Funnel</h2>
                <p style={{ fontSize: 11, color: brand.textSubtle, margin: '2px 0 0', ...type.body }}>Application → Hire · All roles · Q3 2025</p>
              </div>
              <span style={{ fontSize: 11, color: brand.textFaint, ...type.body }}>8 hires placed this quarter →</span>
            </div>
            <PipelineFunnel counts={PIPELINE_COUNTS} startFrame={14} />
          </div>

          <div style={{ flex: 1, backgroundColor: brand.white, border: `1px solid ${brand.borderSubtle}`, borderRadius: brand.radiusLg, padding: '16px 20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h2 style={{ fontSize: 13, color: brand.textPrimary, margin: 0, ...type.semibold }}>Open Roles</h2>
              <span style={{ fontSize: 11, color: brand.textFaint, ...type.body }}>23 active</span>
            </div>
            {OPEN_ROLES.map((r, i) => (
              <RoleRow key={r.company} data={r} delay={18 + i * 6} />
            ))}
          </div>
        </div>
      </div>

      <SceneTitle act="ACT IV" title="The Dashboard" />
    </AbsoluteFill>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACT V — THE WIN (70f)
// ═══════════════════════════════════════════════════════════════════════════════
function ActV() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeP  = spring({ frame, fps, config: { damping: 24, stiffness: 300, mass: 1, overshootClamping: false } });
  const connP   = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 24, stiffness: 300, mass: 1, overshootClamping: false } });
  const lineW   = interpolate(frame, [10, 36], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rightP  = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 24, stiffness: 300, mass: 1, overshootClamping: false } });
  const copyP   = spring({ frame: Math.max(0, frame - 28), fps, config: { damping: 28, stiffness: 240, mass: 1, overshootClamping: false } });
  const timeP   = spring({ frame: Math.max(0, frame - 40), fps, config: { damping: 28, stiffness: 240, mass: 1, overshootClamping: false } });
  const statP   = spring({ frame: Math.max(0, frame - 52), fps, config: { damping: 28, stiffness: 240, mass: 1, overshootClamping: false } });

  const acceptedScale = interpolate(frame, [32, 38], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const acceptedBounce = spring({ frame: Math.max(0, frame - 34), fps, config: { damping: 18, stiffness: 400, mass: 0.8, overshootClamping: false } });

  return (
    <AbsoluteFill style={{ backgroundColor: brand.bg, fontFamily: 'Inter', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '0 120px' }}>
      <TransitionWhoosh />
      <Audio src={staticFile('sounds/sfx-success-epic.mp3')} startFrom={0} volume={0.55} />

      {/* Placed badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 999, padding: '6px 18px', opacity: badgeP, transform: `scale(${lerp(badgeP, 0.85, 1)})` }}>
        <span style={{ fontSize: 14 }}>🎉</span>
        <span style={{ fontSize: 12, ...type.label, color: '#065f46' }}>Placement Confirmed</span>
      </div>

      {/* Candidate ──── Company */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: connP, transform: `translateX(${lerp(connP, -20, 0)}px)` }}>
          <Img src={staticFile('avatars/avatar-andre.svg')} width={80} height={80} style={{ borderRadius: '50%', objectFit: 'cover', border: '3px solid #a7f3d0' }} />
          <span style={{ fontSize: 14, color: brand.textPrimary, ...type.semibold }}>André Souza</span>
          <span style={{ fontSize: 12, color: brand.textSubtle, ...type.body }}>Senior Full-Stack · São Paulo</span>
        </div>

        <div style={{ width: 160, display: 'flex', alignItems: 'center', position: 'relative', margin: '0 16px' }}>
          <div style={{ height: 1.5, flex: 1, background: 'linear-gradient(90deg, #a7f3d0, rgba(0,0,0,0.15))', transformOrigin: 'left center', transform: `scaleX(${lineW})`, opacity: lineW }} />
          <div style={{ position: 'absolute', left: `${lineW * 70}%`, top: -10, opacity: lineW }}>
            <div style={{ fontSize: 18, transform: `scale(${acceptedBounce})` }}>✓</div>
          </div>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: brand.textMuted, opacity: lineW, flexShrink: 0 }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: rightP, transform: `translateX(${lerp(rightP, 20, 0)}px)` }}>
          <div style={{ width: 80, height: 80, borderRadius: 16, backgroundColor: brand.white, border: `2px solid ${brand.borderMedium}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', padding: 14 }}>
            <Img src={staticFile('brand/companies/stripe.svg')} style={{ width: '100%', objectFit: 'contain' }} />
          </div>
          <span style={{ fontSize: 14, color: brand.textPrimary, ...type.semibold }}>Stripe</span>
          <div style={{ fontSize: 12, color: '#065f46', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 999, padding: '2px 10px', transform: `scale(${acceptedBounce * 1.02})`, ...type.semibold }}>
            Offer Accepted ✓
          </div>
        </div>
      </div>

      {/* Copy */}
      <div style={{ textAlign: 'center', opacity: copyP, transform: `translateY(${lerp(copyP, 10, 0)}px)` }}>
        <div style={{ fontSize: 32, color: brand.textPrimary, ...type.heading }}>
          André Souza is now at Stripe.
        </div>
        <div style={{ fontSize: 14, color: brand.textSubtle, marginTop: 4, ...type.body }}>
          Senior Full-Stack Engineer · Remote LATAM · Starting July 2025
        </div>
      </div>

      {/* Timeline */}
      <div style={{ opacity: timeP, transform: `translateY(${lerp(timeP, 8, 0)}px)`, display: 'flex', alignItems: 'center', gap: 0 }}>
        {[
          { day: 'Day 1', event: 'First chat', color: brand.textFaint },
          { day: 'Day 5', event: 'Interview',  color: brand.textFaint },
          { day: 'Day 12', event: 'Signed',    color: '#059669' },
        ].map(({ day, event, color }, i) => (
          <React.Fragment key={day}>
            {i > 0 && <div style={{ width: 48, height: 1, backgroundColor: brand.borderMedium, flexShrink: 0 }} />}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, border: `1.5px solid ${color}` }} />
              <div style={{ fontSize: 12, color, ...type.semibold }}>{day}</div>
              <div style={{ fontSize: 11, color: brand.textFaint, ...type.body }}>{event}</div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Big stat */}
      <div style={{ opacity: statP, transform: `scale(${lerp(statP, 0.94, 1)})`, textAlign: 'center' }}>
        <div style={{ fontSize: 48, color: brand.textPrimary, fontFamily: 'Inter', fontWeight: 800, letterSpacing: '-0.04em' }}>4× faster.</div>
        <div style={{ fontSize: 14, color: brand.textSubtle, ...type.body }}>Than traditional engineering recruiting</div>
      </div>

      <SceneTitle act="ACT V" title="The Victory" />
    </AbsoluteFill>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACT VI — CLIMAX CTA (80f)
// Phase 1 (0–35f): Contrast reveal — "$450K crossed out" vs "$92K LATAM"
// Phase 2 (35–80f): Brand slam — logo + headline + button + trust bar
// ═══════════════════════════════════════════════════════════════════════════════
function ActVI({ cta, ctaLabel }: { cta: string; ctaLabel: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 springs
  const p1a = spring({ frame, fps, config: { damping: 20, stiffness: 320, mass: 1, overshootClamping: false } });
  const p1b = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 20, stiffness: 320, mass: 1, overshootClamping: false } });
  const p1c = spring({ frame: Math.max(0, frame - 14), fps, config: { damping: 22, stiffness: 280, mass: 1, overshootClamping: false } });
  const crossP = interpolate(frame, [18, 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const phase2 = interpolate(frame, [32, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Phase 2 springs
  const logoP  = spring({ frame: Math.max(0, frame - 35), fps, config: { damping: 22, stiffness: 380, mass: 0.8, overshootClamping: false } });
  const headP  = spring({ frame: Math.max(0, frame - 40), fps, config: { damping: 24, stiffness: 300, mass: 1, overshootClamping: false } });
  const btnP   = spring({ frame: Math.max(0, frame - 50), fps, config: { damping: 20, stiffness: 360, mass: 0.9, overshootClamping: false } });
  const trustP = spring({ frame: Math.max(0, frame - 62), fps, config: { damping: 26, stiffness: 260, mass: 1, overshootClamping: false } });

  // Button pulse after it lands
  const btnPulse = interpolate(Math.sin((frame - 55) * 0.2), [-1, 1], [1.0, 1.02], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', fontFamily: 'Inter', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
      <FilmGrain opacity={0.06} />
      <CinematicBars enterFrames={6} />
      <TransitionWhoosh variant="epic" />

      {/* Dot grid bg */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)`, backgroundSize: '40px 40px', opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />

      {/* ─ PHASE 1: CONTRAST REVEAL ─ */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: interpolate(frame, [28, 36], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>

        <div style={{ opacity: p1a, transform: `translateY(${lerp(p1a, -20, 0)}px)`, textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', ...type.label, letterSpacing: '0.12em', marginBottom: 8 }}>SAN FRANCISCO ENGINEER · OTE</div>
          <div style={{ fontSize: 88, fontFamily: 'Inter', fontWeight: 900, letterSpacing: '-0.05em', color: 'rgba(255,255,255,0.25)', lineHeight: 1, position: 'relative', display: 'inline-block' }}>
            $450K
            {/* Red strikethrough */}
            <div style={{ position: 'absolute', top: '50%', left: -4, right: -4, height: 5, backgroundColor: '#ef4444', transform: `scaleX(${crossP})`, transformOrigin: 'left center', borderRadius: 2 }} />
          </div>
        </div>

        <div style={{ opacity: p1b, transform: `translateY(${lerp(p1b, 16, 0)}px)`, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', ...type.label, letterSpacing: '0.12em', marginBottom: 8 }}>LATAM ENGINEER · AMPLIFY</div>
          <div style={{ fontSize: 88, fontFamily: 'Inter', fontWeight: 900, letterSpacing: '-0.05em', color: brand.white, lineHeight: 1 }}>
            $92K
          </div>
        </div>

        <div style={{ opacity: p1c, transform: `translateY(${lerp(p1c, 10, 0)}px)`, marginTop: 10 }}>
          <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter', fontWeight: 400, letterSpacing: '-0.01em', textAlign: 'center' }}>
            Same skills. UTC-3. Hired in
            <span style={{ color: brand.white, fontWeight: 700 }}> 12 days.</span>
          </div>
        </div>
      </div>

      {/* ─ PHASE 2: BRAND SLAM ─ */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, opacity: phase2, pointerEvents: phase2 < 0.1 ? 'none' : 'auto' }}>

        <div style={{ transform: `scale(${lerp(logoP, 0.5, 1)})`, opacity: logoP }}>
          <Img src={staticFile('brand/kochavit.png')} width={52} height={52} style={{ objectFit: 'contain', filter: 'invert(1)' }} />
        </div>

        <div style={{ textAlign: 'center', opacity: headP, transform: `translateY(${lerp(headP, 20, 0)}px)` }}>
          <div style={{ fontSize: 64, color: brand.white, fontFamily: 'Inter', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.95 }}>
            We fixed it.
          </div>
          <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.28)', fontFamily: 'Inter', fontWeight: 400, marginTop: 10, letterSpacing: '-0.01em' }}>
            The best engineers aren't in SF.
            <span style={{ color: 'rgba(255,255,255,0.55)' }}> They're in LATAM.</span>
          </div>
        </div>

        <div style={{ opacity: btnP, transform: `translateY(${lerp(btnP, 16, 0)}px) scale(${frame > 55 ? btnPulse : lerp(btnP, 0.94, 1)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ backgroundColor: brand.white, color: brand.black, fontSize: 18, fontFamily: 'Inter', fontWeight: 700, borderRadius: 999, padding: '15px 52px', boxShadow: '0 0 40px rgba(255,255,255,0.15)', letterSpacing: '-0.01em' }}>
            {ctaLabel}
          </div>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', fontFamily: 'Inter', fontWeight: 400 }}>{cta}</span>
        </div>

        <div style={{ opacity: trustP, transform: `translateY(${lerp(trustP, 8, 0)}px)`, display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)', ...type.label, letterSpacing: '0.1em' }}>TRUSTED BY</span>
          {['Stripe', 'Nubank', 'Mercado Livre', 'Kavak', 'Clip', 'iFood'].map((co) => (
            <Img
              key={co}
              src={staticFile(`brand/companies/${co.toLowerCase().replace(/\s+/g, '')}.svg`)}
              height={14}
              style={{ objectFit: 'contain', filter: 'invert(1)', opacity: 0.22 }}
            />
          ))}
        </div>
      </div>

      <ClosingCredits startScroll={70} />
    </AbsoluteFill>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT — 725 - 144 = 581f ≈ 19.4s @ 30fps
// ═══════════════════════════════════════════════════════════════════════════════
const TRANS = 18;

export const MarketingVideo: React.FC<MarketingVideoProps> = ({ tagline: _t, cta, ctaLabel }) => (
  <AbsoluteFill style={{ fontFamily: 'Inter' }}>
    <Audio src={staticFile('sounds/bg-music.mp3')} volume={0.18} loop />

    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={70}><ActI /></TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming({ durationInFrames: TRANS })} presentation={premiumFade()} />

      <TransitionSeries.Sequence durationInFrames={60}><ActII /></TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming({ durationInFrames: TRANS })} presentation={premiumFade()} />

      <TransitionSeries.Sequence durationInFrames={50}><ActIII /></TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming({ durationInFrames: TRANS })} presentation={premiumFade()} />

      <TransitionSeries.Sequence durationInFrames={120}><ActIVa /></TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming({ durationInFrames: TRANS })} presentation={premiumFade()} />

      <TransitionSeries.Sequence durationInFrames={100}><ActIVb /></TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming({ durationInFrames: TRANS })} presentation={premiumFade()} />

      <TransitionSeries.Sequence durationInFrames={100}><ActIVc /></TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming({ durationInFrames: TRANS })} presentation={premiumFade()} />

      <TransitionSeries.Sequence durationInFrames={75}><ActIVd /></TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming({ durationInFrames: TRANS })} presentation={premiumFade()} />

      <TransitionSeries.Sequence durationInFrames={70}><ActV /></TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming({ durationInFrames: TRANS })} presentation={premiumFade()} />

      <TransitionSeries.Sequence durationInFrames={80}><ActVI cta={cta} ctaLabel={ctaLabel} /></TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);

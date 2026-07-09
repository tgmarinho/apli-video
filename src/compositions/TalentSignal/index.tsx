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
import { FilmGrain } from '../../components/FilmGrain';
import { TypingText } from '../../components/TypingText';
import { premiumFade } from '../../lib/transitions';
import { brand, type } from '../../lib/theme';
import { TalentSignalProps } from './schema';

const TRANSITION_FRAMES = 18;

const candidates = [
  {
    name: 'Andre Souza',
    role: 'Senior Full-Stack',
    company: 'Nubank',
    avatar: 'avatars/avatar-andre.svg',
    location: 'Sao Paulo',
    timezone: 'UTC-3',
    score: 96,
    salary: '$92K',
    tags: ['TypeScript', 'React', 'Node.js', 'C1 English'],
    intro: 'Warm intro: ex-Nubank fintech scale, available in two weeks.',
  },
  {
    name: 'Julia Mota',
    role: 'Tech Lead Backend',
    company: 'iFood',
    avatar: 'avatars/avatar-julia.svg',
    location: 'Rio de Janeiro',
    timezone: 'UTC-3',
    score: 93,
    salary: '$108K',
    tags: ['Go', 'Postgres', 'K8s', 'C2 English'],
    intro: 'Warm intro: led a six-person backend team through peak traffic.',
  },
  {
    name: 'Matheus Lima',
    role: 'Senior Backend',
    company: 'Rappi',
    avatar: 'avatars/avatar-matheus.svg',
    location: 'Bogota',
    timezone: 'UTC-5',
    score: 90,
    salary: '$87K',
    tags: ['Node.js', 'AWS', 'Postgres', 'Available now'],
    intro: 'Warm intro: marketplace systems, strong ownership, ready now.',
  },
];

const countries = [
  { name: 'Brazil', x: 58, y: 56, delay: 12, count: 431 },
  { name: 'Argentina', x: 52, y: 76, delay: 24, count: 136 },
  { name: 'Colombia', x: 39, y: 38, delay: 36, count: 118 },
  { name: 'Mexico', x: 24, y: 20, delay: 48, count: 162 },
];

function useSceneSpring(delay = 0, stiffness = 260, damping = 28) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { stiffness, damping, mass: 1, overshootClamping: false },
  });
}

function lerp(p: number, from: number, to: number) {
  return interpolate(p, [0, 1], [from, to]);
}

function Shell({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: dark ? '#050505' : '#f7f8f4',
        color: dark ? brand.white : brand.black,
        fontFamily: 'Inter',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: dark
            ? 'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
          opacity: 0.7,
        }}
      />
      <FilmGrain opacity={dark ? 0.07 : 0.035} />
      {children}
    </AbsoluteFill>
  );
}

function TopBrand({ dark = false }: { dark?: boolean }) {
  const p = useSceneSpring(4);
  return (
    <div
      style={{
        position: 'absolute',
        top: 34,
        left: 48,
        right: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        opacity: p,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Img
          src={staticFile('brand/kochavit.png')}
          width={24}
          height={24}
          style={{ objectFit: 'contain', filter: dark ? 'invert(1)' : 'none' }}
        />
        <span style={{ fontSize: 16, color: dark ? brand.white : brand.black, ...type.semibold }}>
          Amplify IT
        </span>
      </div>
      <div
        style={{
          fontSize: 11,
          color: dark ? 'rgba(255,255,255,0.54)' : 'rgba(0,0,0,0.48)',
          ...type.label,
          letterSpacing: '0.08em',
        }}
      >
        AI-native ATS for LATAM engineering talent
      </div>
    </div>
  );
}

function SceneLabel({ index, title, dark = false }: { index: string; title: string; dark?: boolean }) {
  const p = useSceneSpring(8);
  return (
    <div
      style={{
        position: 'absolute',
        left: 48,
        bottom: 34,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        opacity: p,
      }}
    >
      <span
        style={{
          fontSize: 10,
          color: dark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.36)',
          ...type.label,
        }}
      >
        {index}
      </span>
      <div
        style={{
          width: 68,
          height: 1,
          backgroundColor: dark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.14)',
        }}
      />
      <span
        style={{
          fontSize: 11,
          color: dark ? 'rgba(255,255,255,0.46)' : 'rgba(0,0,0,0.48)',
          ...type.semibold,
        }}
      >
        {title}
      </span>
    </div>
  );
}

function ResumeStack() {
  const frame = useCurrentFrame();
  const rows = Array.from({ length: 34 });
  return (
    <div style={{ position: 'relative', width: 560, height: 420 }}>
      {rows.map((_, i) => {
        const p = interpolate(frame, [i * 1.2, 32 + i * 0.8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const x = (i % 7) * 46;
        const y = Math.floor(i / 7) * 72;
        const rot = ((i % 5) - 2) * 1.4;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 30 + x,
              top: 20 + y,
              width: 138,
              height: 90,
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.11)',
              opacity: p * 0.75,
              transform: `translateY(${lerp(p, 24, 0)}px) rotate(${rot}deg)`,
              boxShadow: '0 18px 50px rgba(0,0,0,0.34)',
              padding: 12,
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.14)', marginBottom: 10 }} />
            <div style={{ height: 6, width: '78%', backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 99, marginBottom: 6 }} />
            <div style={{ height: 6, width: '48%', backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: 99 }} />
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          inset: -30,
          background: 'radial-gradient(circle at center, transparent 30%, #050505 74%)',
        }}
      />
    </div>
  );
}

function ActNoise() {
  const frame = useCurrentFrame();
  const titleP = useSceneSpring(6, 320, 26);
  const subP = useSceneSpring(24);
  const cardP = useSceneSpring(42);
  const count = Math.round(interpolate(frame, [12, 58], [28, 847], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));

  return (
    <Shell dark>
      <TopBrand dark />
      <Audio src={staticFile('sounds/intro-boom.mp3')} volume={0.28} />
      <div style={{ position: 'absolute', inset: '110px 86px 80px', display: 'grid', gridTemplateColumns: '1fr 0.8fr', alignItems: 'center', gap: 40 }}>
        <div>
          <div
            style={{
              fontSize: 82,
              lineHeight: 0.96,
              color: brand.white,
              fontWeight: 900,
              letterSpacing: 0,
              opacity: titleP,
              transform: `translateY(${lerp(titleP, 28, 0)}px)`,
            }}
          >
            Hiring is not a resume problem.
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 31,
              lineHeight: 1.22,
              color: 'rgba(255,255,255,0.58)',
              ...type.body,
              opacity: subP,
              transform: `translateY(${lerp(subP, 18, 0)}px)`,
            }}
          >
            It is a signal problem.
          </div>
          <div
            style={{
              marginTop: 34,
              width: 490,
              backgroundColor: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 18,
              padding: '20px 22px',
              opacity: cardP,
              transform: `translateY(${lerp(cardP, 18, 0)}px)`,
            }}
          >
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.36)', ...type.label }}>Traditional ATS</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 8 }}>
              <span style={{ fontSize: 52, color: '#fb7185', fontWeight: 900, letterSpacing: 0 }}>{count}</span>
              <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.52)', ...type.body }}>profiles in, no ranking out</span>
            </div>
          </div>
        </div>
        <ResumeStack />
      </div>
      <SceneLabel index="01" title="The noise" dark />
    </Shell>
  );
}

function BriefCard() {
  const frame = useCurrentFrame();
  const p = useSceneSpring(8);
  const parserP = useSceneSpring(56);
  const brief = 'Find me a senior TypeScript engineer in LATAM. React, Node.js, strong English, $90K budget, available in two weeks.';
  const chips = ['Senior', 'TypeScript', 'React', 'Node.js', 'C1 English', '$90K', 'UTC-3 to UTC-6'];

  return (
    <div
      style={{
        backgroundColor: '#111',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 24,
        padding: 22,
        boxShadow: '0 28px 90px rgba(0,0,0,0.34)',
        opacity: p,
        transform: `translateY(${lerp(p, 20, 0)}px)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.52)', ...type.semibold }}>Hiring manager brief</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#ef4444', '#f59e0b', '#10b981'].map((color) => (
            <span key={color} style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: color, display: 'block' }} />
          ))}
        </div>
      </div>
      <div style={{ minHeight: 112, color: 'rgba(255,255,255,0.88)', fontSize: 26, lineHeight: 1.36, ...type.body }}>
        <TypingText text={brief} startFrame={12} charsPerFrame={1.75} showCursor={frame < 74} />
      </div>
      <div
        style={{
          marginTop: 20,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: 18,
          opacity: parserP,
          transform: `translateY(${lerp(parserP, 12, 0)}px)`,
        }}
      >
        <div style={{ fontSize: 11, color: '#67e8f9', ...type.label, marginBottom: 12 }}>Amplify AI parses the ask</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {chips.map((chip, i) => {
            const chipP = interpolate(frame, [60 + i * 4, 68 + i * 4], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <span
                key={chip}
                style={{
                  fontSize: 13,
                  color: brand.white,
                  border: '1px solid rgba(103,232,249,0.35)',
                  backgroundColor: 'rgba(103,232,249,0.08)',
                  borderRadius: 999,
                  padding: '7px 12px',
                  ...type.semibold,
                  opacity: chipP,
                  transform: `scale(${lerp(chipP, 0.92, 1)})`,
                }}
              >
                {chip}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ActBrief() {
  const headlineP = useSceneSpring(12);
  return (
    <Shell dark>
      <TopBrand dark />
      <Audio src={staticFile('sounds/sfx-keyboard.mp3')} volume={0.24} />
      <div style={{ position: 'absolute', inset: '112px 86px 74px', display: 'grid', gridTemplateColumns: '0.86fr 1.14fr', gap: 44, alignItems: 'center' }}>
        <div
          style={{
            opacity: headlineP,
            transform: `translateY(${lerp(headlineP, 18, 0)}px)`,
          }}
        >
          <div style={{ fontSize: 15, color: '#67e8f9', ...type.label, marginBottom: 16 }}>Natural language in</div>
          <div style={{ fontSize: 58, color: brand.white, lineHeight: 1.02, fontWeight: 900, letterSpacing: 0 }}>
            Describe the engineer. Amplify builds the search.
          </div>
          <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, margin: '22px 0 0', ...type.body }}>
            No Boolean strings. No spreadsheet archaeology. The agent turns a hiring conversation into ranked candidates and warm intros.
          </p>
        </div>
        <BriefCard />
      </div>
      <SceneLabel index="02" title="The agent" dark />
    </Shell>
  );
}

function CountryNode({ item }: { item: (typeof countries)[number] }) {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [item.delay, item.delay + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pulse = interpolate(Math.sin((frame - item.delay) * 0.18), [-1, 1], [0.55, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: `${item.x}%`,
        top: `${item.y}%`,
        opacity: p,
        transform: `translate(-50%, -50%) scale(${lerp(p, 0.72, 1)})`,
      }}
    >
      <div style={{ position: 'absolute', left: -28, top: -28, width: 56, height: 56, borderRadius: '50%', border: '1px solid rgba(16,185,129,0.34)', transform: `scale(${pulse})` }} />
      <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 24px rgba(16,185,129,0.85)' }} />
      <div
        style={{
          position: 'absolute',
          left: 22,
          top: -17,
          whiteSpace: 'nowrap',
          backgroundColor: brand.white,
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 10,
          padding: '8px 10px',
          boxShadow: '0 12px 34px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ fontSize: 12, color: brand.black, ...type.semibold }}>{item.name}</div>
        <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.48)', ...type.body }}>{item.count} vetted engineers</div>
      </div>
    </div>
  );
}

function ActMap() {
  const frame = useCurrentFrame();
  const titleP = useSceneSpring(4);
  const mapP = useSceneSpring(16);
  const bandP = useSceneSpring(58);
  const salaryP = useSceneSpring(72);
  const pathProgress = interpolate(frame, [20, 82], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Shell>
      <TopBrand />
      <Audio src={staticFile('sounds/reveal-shimmer.mp3')} volume={0.18} />
      <div style={{ position: 'absolute', inset: '106px 74px 76px', display: 'grid', gridTemplateColumns: '1fr 0.85fr', gap: 48, alignItems: 'center' }}>
        <div style={{ position: 'relative', height: 600, opacity: mapP, transform: `scale(${lerp(mapP, 0.96, 1)})` }}>
          <svg viewBox="0 0 780 600" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <path
              d="M175 118 C260 172 310 204 382 230 C462 258 486 316 468 380 C448 454 406 510 430 564"
              fill="none"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="32"
              strokeLinecap="round"
            />
            <path
              d="M175 118 C260 172 310 204 382 230 C462 258 486 316 468 380 C448 454 406 510 430 564"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeDasharray={`${pathProgress * 740} 740`}
              strokeLinecap="round"
            />
            <path
              d="M204 128 C302 130 428 178 512 286 C590 390 534 514 448 564"
              fill="none"
              stroke="rgba(6,182,212,0.52)"
              strokeWidth="2"
              strokeDasharray={`${pathProgress * 820} 820`}
              strokeLinecap="round"
            />
          </svg>
          {countries.map((item) => (
            <CountryNode key={item.name} item={item} />
          ))}
          <div
            style={{
              position: 'absolute',
              left: '18%',
              right: '16%',
              top: '47%',
              height: 76,
              borderRadius: 18,
              backgroundColor: 'rgba(103,232,249,0.12)',
              border: '1px solid rgba(6,182,212,0.18)',
              opacity: bandP,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#075985',
              fontSize: 17,
              ...type.semibold,
            }}
          >
            UTC-3 to UTC-6 overlaps with US teams
          </div>
        </div>
        <div style={{ opacity: titleP, transform: `translateY(${lerp(titleP, 18, 0)}px)` }}>
          <div style={{ fontSize: 15, color: '#047857', ...type.label, marginBottom: 16 }}>Talent pool LATAM</div>
          <div style={{ fontSize: 63, color: brand.black, lineHeight: 1.02, fontWeight: 900, letterSpacing: 0 }}>
            Top engineers are already in your timezone.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 30, opacity: salaryP }}>
            {[
              { label: 'SF engineer', value: '$300K-$450K', color: '#e11d48' },
              { label: 'LATAM engineer', value: '$60K-$120K', color: '#047857' },
              { label: 'Pre-vetted pool', value: '847', color: brand.black },
              { label: 'Close time', value: '12 days', color: '#0369a1' },
            ].map((item) => (
              <div key={item.label} style={{ backgroundColor: brand.white, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: 18 }}>
                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.44)', ...type.label }}>{item.label}</div>
                <div style={{ fontSize: 28, color: item.color, fontWeight: 900, letterSpacing: 0, marginTop: 6 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SceneLabel index="03" title="The geography advantage" />
    </Shell>
  );
}

function ScoreRing({ score }: { score: number }) {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [18, 64], [0, score], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const circumference = 2 * Math.PI * 35;
  return (
    <div style={{ position: 'relative', width: 86, height: 86 }}>
      <svg viewBox="0 0 86 86" style={{ width: 86, height: 86, transform: 'rotate(-90deg)' }}>
        <circle cx="43" cy="43" r="35" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="8" />
        <circle
          cx="43"
          cy="43"
          r="35"
          fill="none"
          stroke="#10b981"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - p / 100)}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: brand.black, fontWeight: 900 }}>
        {Math.round(p)}
      </div>
    </div>
  );
}

function CandidatePanel({ candidate, index }: { candidate: (typeof candidates)[number]; index: number }) {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [18 + index * 14, 36 + index * 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        backgroundColor: brand.white,
        border: index === 0 ? '2px solid #10b981' : '1px solid rgba(0,0,0,0.08)',
        borderRadius: 22,
        padding: 20,
        display: 'grid',
        gridTemplateColumns: '76px 1fr auto',
        gap: 16,
        alignItems: 'center',
        opacity: p,
        transform: `translateX(${lerp(p, 24, 0)}px) scale(${lerp(p, 0.97, 1)})`,
        boxShadow: index === 0 ? '0 20px 60px rgba(16,185,129,0.16)' : '0 14px 44px rgba(0,0,0,0.06)',
      }}
    >
      <Img src={staticFile(candidate.avatar)} width={76} height={76} style={{ borderRadius: 20, objectFit: 'cover' }} />
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22, color: brand.black, ...type.semibold }}>{candidate.name}</span>
          <Img
            src={staticFile(`brand/companies/${candidate.company.toLowerCase().replace(/\s+/g, '')}.svg`)}
            height={17}
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.5)', ...type.body, marginTop: 3 }}>
          {candidate.role} · {candidate.location} · {candidate.timezone} · {candidate.salary}
        </div>
        <div style={{ display: 'flex', gap: 7, marginTop: 11, flexWrap: 'wrap' }}>
          {candidate.tags.slice(0, 4).map((tag) => (
            <span key={tag} style={{ fontSize: 11, color: '#064e3b', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 999, padding: '4px 8px', ...type.semibold }}>
              {tag}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.44)', ...type.body, marginTop: 11 }}>{candidate.intro}</div>
      </div>
      <ScoreRing score={candidate.score} />
    </div>
  );
}

function ActShortlist() {
  const frame = useCurrentFrame();
  const titleP = useSceneSpring(4);
  return (
    <Shell>
      <TopBrand />
      <Audio src={staticFile('sounds/sfx-reveal.mp3')} volume={0.19} />
      {[30, 45, 60].map((start) => frame >= start && frame < start + 5 ? (
        <Audio key={start} src={staticFile('sounds/sfx-snap.mp3')} volume={0.18} />
      ) : null)}
      <div style={{ position: 'absolute', inset: '106px 84px 78px', display: 'grid', gridTemplateColumns: '0.62fr 1fr', gap: 42, alignItems: 'center' }}>
        <div style={{ opacity: titleP, transform: `translateY(${lerp(titleP, 16, 0)}px)` }}>
          <div style={{ fontSize: 15, color: '#047857', ...type.label, marginBottom: 16 }}>Ranked shortlist</div>
          <div style={{ fontSize: 62, color: brand.black, lineHeight: 1.03, fontWeight: 900, letterSpacing: 0 }}>
            Three best matches. Each with a reason to say yes.
          </div>
          <p style={{ fontSize: 19, color: 'rgba(0,0,0,0.54)', lineHeight: 1.45, marginTop: 22, ...type.body }}>
            Amplify scores for fit, timezone, English, compensation and availability, then writes the warm intro.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {candidates.map((candidate, index) => (
            <CandidatePanel key={candidate.name} candidate={candidate} index={index} />
          ))}
        </div>
      </div>
      <SceneLabel index="04" title="The shortlist" />
    </Shell>
  );
}

function PipelineCard({ label, x, y, delay, accent }: { label: string; x: number; y: number; delay: number; accent: string }) {
  const p = useSceneSpring(delay, 280, 26);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 220,
        backgroundColor: brand.white,
        border: '1px solid rgba(0,0,0,0.08)',
        borderLeft: `6px solid ${accent}`,
        borderRadius: 16,
        padding: 16,
        boxShadow: '0 18px 48px rgba(0,0,0,0.09)',
        opacity: p,
        transform: `translateY(${lerp(p, 24, 0)}px)`,
      }}
    >
      <div style={{ fontSize: 13, color: brand.black, ...type.semibold }}>{label}</div>
      <div style={{ height: 6, width: '75%', borderRadius: 99, backgroundColor: 'rgba(0,0,0,0.09)', marginTop: 12 }} />
      <div style={{ height: 6, width: '44%', borderRadius: 99, backgroundColor: 'rgba(0,0,0,0.06)', marginTop: 7 }} />
    </div>
  );
}

function MovingCandidate() {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [22, 82], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const x = interpolate(p, [0, 0.33, 0.66, 1], [70, 325, 580, 835]);
  const y = interpolate(p, [0, 0.33, 0.66, 1], [280, 210, 270, 190]);
  const lift = interpolate(Math.sin(p * Math.PI), [0, 1], [0, -34]);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + lift,
        width: 238,
        backgroundColor: '#111',
        color: brand.white,
        borderRadius: 18,
        padding: 16,
        boxShadow: '0 30px 80px rgba(0,0,0,0.28)',
        border: '1px solid rgba(255,255,255,0.1)',
        transform: `rotate(${interpolate(Math.sin(frame * 0.08), [-1, 1], [-1.4, 1.4])}deg)`,
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Img src={staticFile('avatars/avatar-andre.svg')} width={42} height={42} style={{ borderRadius: 12 }} />
        <div>
          <div style={{ fontSize: 14, ...type.semibold }}>Andre Souza</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', ...type.body }}>96 match · intro ready</div>
        </div>
      </div>
    </div>
  );
}

function ActPipeline() {
  const frame = useCurrentFrame();
  const titleP = useSceneSpring(4);
  const stages = ['Shortlist', 'Warm intro', 'Interview', 'Offer'];
  return (
    <Shell>
      <TopBrand />
      {frame >= 20 && frame < 25 && <Audio src={staticFile('sounds/sfx-drag-lift.mp3')} volume={0.34} />}
      {frame >= 80 && frame < 86 && <Audio src={staticFile('sounds/sfx-card-drop.mp3')} volume={0.42} />}
      <div style={{ position: 'absolute', inset: '104px 74px 76px' }}>
        <div style={{ opacity: titleP, transform: `translateY(${lerp(titleP, 14, 0)}px)`, marginBottom: 26 }}>
          <div style={{ fontSize: 15, color: '#0369a1', ...type.label, marginBottom: 10 }}>Visual pipeline</div>
          <div style={{ fontSize: 52, color: brand.black, lineHeight: 1.05, fontWeight: 900, letterSpacing: 0 }}>
            Move from shortlist to signed without leaving the ATS.
          </div>
        </div>
        <div style={{ position: 'relative', height: 458, backgroundColor: 'rgba(255,255,255,0.72)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 28, padding: 24, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
            {stages.map((stage, index) => (
              <div key={stage} style={{ height: 410, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.035)', border: '1px solid rgba(0,0,0,0.055)', padding: 16 }}>
                <div style={{ fontSize: 13, color: brand.black, ...type.semibold }}>{stage}</div>
                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', ...type.body, marginTop: 3 }}>{index === 3 ? '1 ready' : `${index + 2} candidates`}</div>
              </div>
            ))}
          </div>
          <PipelineCard label="Julia Mota" x={86} y={142} delay={16} accent="#10b981" />
          <PipelineCard label="Matheus Lima" x={342} y={262} delay={22} accent="#06b6d4" />
          <PipelineCard label="Camila Pereira" x={600} y={150} delay={28} accent="#f59e0b" />
          <MovingCandidate />
        </div>
      </div>
      <SceneLabel index="05" title="The pipeline" />
    </Shell>
  );
}

function LogoWall() {
  const companies = ['stripe', 'nubank', 'ifood', 'rappi', 'mercadolivre', 'kavak'];
  const frame = useCurrentFrame();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, opacity: interpolate(frame, [60, 84], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
      {companies.map((company) => (
        <Img
          key={company}
          src={staticFile(`brand/companies/${company}.svg`)}
          height={18}
          style={{ objectFit: 'contain', filter: 'invert(1)', opacity: 0.42 }}
        />
      ))}
    </div>
  );
}

function ActOutcome({ cta, ctaLabel }: TalentSignalProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoP = useSceneSpring(4, 340, 22);
  const titleP = useSceneSpring(18, 300, 26);
  const metricP = useSceneSpring(40);
  const buttonP = spring({ frame: Math.max(0, frame - 62), fps, config: { stiffness: 280, damping: 20, mass: 1, overshootClamping: false } });
  const pulse = interpolate(Math.sin((frame - 70) * 0.16), [-1, 1], [1, 1.025], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Shell dark>
      <Audio src={staticFile('sounds/sfx-ending-climax.mp3')} volume={0.46} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
        <div style={{ opacity: logoP, transform: `scale(${lerp(logoP, 0.55, 1)})`, marginBottom: 24 }}>
          <Img src={staticFile('brand/kochavit.png')} width={64} height={64} style={{ objectFit: 'contain', filter: 'invert(1)' }} />
        </div>
        <div
          style={{
            width: 980,
            fontSize: 74,
            lineHeight: 0.99,
            color: brand.white,
            fontWeight: 900,
            letterSpacing: 0,
            opacity: titleP,
            transform: `translateY(${lerp(titleP, 22, 0)}px)`,
          }}
        >
          Stop sorting resumes. Start hiring signal.
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 14,
            width: 760,
            marginTop: 34,
            opacity: metricP,
            transform: `translateY(${lerp(metricP, 18, 0)}px)`,
          }}
        >
          {[
            ['12 days', 'brief to signed'],
            ['$60K-$120K', 'LATAM salary range'],
            ['3 intros', 'from one chat'],
          ].map(([value, label]) => (
            <div key={value} style={{ border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 18, padding: '18px 16px' }}>
              <div style={{ fontSize: 31, color: '#86efac', fontWeight: 900, letterSpacing: 0 }}>{value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.43)', ...type.label, marginTop: 5 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 34, opacity: buttonP, transform: `translateY(${lerp(buttonP, 18, 0)}px) scale(${buttonP > 0.9 ? pulse : lerp(buttonP, 0.94, 1)})` }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: brand.white, color: brand.black, borderRadius: 999, padding: '18px 46px', fontSize: 18, ...type.semibold, boxShadow: '0 0 44px rgba(255,255,255,0.17)' }}>
            {ctaLabel}
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.46)', ...type.body, marginTop: 12 }}>{cta}</div>
        </div>
        <div style={{ marginTop: 32 }}>
          <LogoWall />
        </div>
      </div>
      <SceneLabel index="06" title="The close" dark />
    </Shell>
  );
}

export function TalentSignalVideo(props: TalentSignalProps) {
  return (
  <AbsoluteFill style={{ fontFamily: 'Inter' }}>
    <Audio src={staticFile('sounds/music-main.mp3')} volume={0.12} loop />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={88}>
        <ActNoise />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} presentation={premiumFade()} />
      <TransitionSeries.Sequence durationInFrames={110}>
        <ActBrief />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} presentation={premiumFade()} />
      <TransitionSeries.Sequence durationInFrames={105}>
        <ActMap />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} presentation={premiumFade()} />
      <TransitionSeries.Sequence durationInFrames={115}>
        <ActShortlist />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} presentation={premiumFade()} />
      <TransitionSeries.Sequence durationInFrames={105}>
        <ActPipeline />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} presentation={premiumFade()} />
      <TransitionSeries.Sequence durationInFrames={105}>
        <ActOutcome {...props} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
  );
}

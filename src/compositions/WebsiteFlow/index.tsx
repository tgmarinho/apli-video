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
import { WebsiteFlowProps } from './schema';

const TRANS = 16;

const colors = {
  black: '#000',
  white: '#fff',
  bg: '#fff',
  gray50: '#fafafa',
  gray100: '#f5f5f5',
  gray200: '#e5e5e5',
  gray300: '#d4d4d4',
  gray500: '#737373',
  gray600: '#525252',
  gray700: '#404040',
  gray900: '#171717',
  green: '#16a34a',
  blue: '#2563eb',
  violet: '#7c3aed',
  amber: '#d97706',
  red: '#dc2626',
};

const realityStats = [
  { value: '80%', label: 'AI PoCs fail in production', tone: colors.red },
  { value: '48h', label: 'First FDE profiles delivered', tone: colors.black },
  { value: '<2wk', label: 'Embedded and running', tone: colors.green },
  { value: 'SOC 2', label: 'Audit-ready by design', tone: colors.blue },
  { value: '0', label: 'Security incidents', tone: colors.violet },
];

const pillars = [
  {
    title: 'Production Reliability',
    subtitle: 'Enterprise-grade infrastructure',
    bullets: ['Automated retry logic', 'Human-in-the-loop checkpoints', 'Complete observability'],
    tone: colors.blue,
  },
  {
    title: 'Security Architecture',
    subtitle: 'Defense-in-depth model',
    bullets: ['Prompt injection defenses', 'Least-privilege access', 'Secure secrets management'],
    tone: colors.black,
  },
  {
    title: 'Compliance Framework',
    subtitle: 'Audit-ready from day one',
    bullets: ['GDPR / CCPA compliant', 'SOC 2 / ISO 27001 ready', 'Complete action logging'],
    tone: colors.green,
  },
];

const fdeActions = [
  'Builds custom AI agents',
  'Embeds with your team',
  'Ensures security and compliance',
  'Owns production deployment',
];

const platforms = [
  { name: 'OpenClaw', tag: 'Enterprise', detail: 'Audit trails by default', tone: colors.black },
  { name: 'LangFlow', tag: 'Low-code', detail: 'Visual agent builder', tone: colors.violet },
  { name: 'n8n', tag: 'Automation', detail: '500+ integrations', tone: colors.amber },
  { name: 'LangChain', tag: 'Full control', detail: 'Custom MCP and RAG', tone: colors.blue },
];

const dagNodes = [
  { name: 'Slack', x: 88, y: 232, tone: colors.green },
  { name: 'AI Agent', x: 380, y: 232, tone: colors.black },
  { name: 'Salesforce', x: 660, y: 92, tone: colors.blue },
  { name: 'Gmail', x: 690, y: 186, tone: colors.red },
  { name: 'Notion', x: 690, y: 280, tone: colors.black },
  { name: 'Jira', x: 662, y: 374, tone: colors.blue },
  { name: 'GitHub', x: 380, y: 430, tone: colors.gray700 },
];

function useS(delay = 0, stiffness = 280, damping = 28) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { stiffness, damping, mass: 1, overshootClamping: false },
  });
}

function map(p: number, from: number, to: number) {
  return interpolate(p, [0, 1], [from, to]);
}

function text(weight: number, size: number, color: string): React.CSSProperties {
  return {
    fontFamily: 'Geist, Inter, system-ui, sans-serif',
    fontWeight: weight,
    fontSize: size,
    color,
    letterSpacing: 0,
  };
}

function mono(size: number, color: string, weight = 600): React.CSSProperties {
  return {
    fontFamily: 'Geist Mono, JetBrains Mono, ui-monospace, monospace',
    fontSize: size,
    fontWeight: weight,
    color,
    letterSpacing: 0,
  };
}

function FontFace() {
  return (
    <style>
      {`
        @font-face {
          font-family: Geist;
          font-style: normal;
          font-weight: 100 900;
          font-display: swap;
          src: url("${staticFile('fonts/geist-latin.woff2')}") format("woff2");
        }
        @font-face {
          font-family: Geist Mono;
          font-style: normal;
          font-weight: 100 900;
          font-display: swap;
          src: url("${staticFile('fonts/geist-mono-latin.woff2')}") format("woff2");
        }
      `}
    </style>
  );
}

function Page({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: dark ? colors.black : colors.bg,
        color: dark ? colors.white : colors.black,
        fontFamily: 'Geist, Inter, system-ui, sans-serif',
        overflow: 'hidden',
      }}
    >
      <FontFace />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: dark
            ? 'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          opacity: dark ? 0.55 : 0.85,
        }}
      />
      <FilmGrain opacity={dark ? 0.06 : 0.02} />
      {children}
    </AbsoluteFill>
  );
}

function Nav({ dark = false }: { dark?: boolean }) {
  const p = useS(2);
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 78,
        borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : colors.gray100}`,
        backgroundColor: dark ? 'rgba(0,0,0,0.82)' : 'rgba(255,255,255,0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 64px',
        opacity: p,
        zIndex: 20,
      }}
    >
      <Img
        src={staticFile('brand/logo.png')}
        width={120}
        style={{ objectFit: 'contain', filter: dark ? 'invert(1)' : 'none' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {['Clients', 'Ref', 'FDEs', 'Blog', 'Careers'].map((item) => (
          <div key={item} style={text(500, 14, dark ? 'rgba(255,255,255,0.72)' : colors.gray700)}>
            {item}
          </div>
        ))}
        <div
          style={{
            ...text(600, 14, dark ? colors.black : colors.white),
            backgroundColor: dark ? colors.white : colors.black,
            borderRadius: 999,
            padding: '10px 18px',
          }}
        >
          Deploy Secure AI Agents
        </div>
      </div>
    </div>
  );
}

function SectionTag({ label, dark = false }: { label: string; dark?: boolean }) {
  const p = useS(8);
  return (
    <div
      style={{
        position: 'absolute',
        left: 64,
        bottom: 34,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        opacity: p,
      }}
    >
      <div style={{ width: 78, height: 1, backgroundColor: dark ? 'rgba(255,255,255,0.16)' : colors.gray200 }} />
      <div style={mono(11, dark ? 'rgba(255,255,255,0.42)' : colors.gray500, 600)}>{label}</div>
    </div>
  );
}

function MethodologyLogos() {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {['OpenAI', 'Anthropic', 'Palantir'].map((name, index) => {
        const p = interpolate(frame, [8 + index * 6, 22 + index * 6], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={name}
            style={{
              ...text(700, 13, colors.black),
              backgroundColor: colors.white,
              border: `1px solid ${colors.gray200}`,
              borderRadius: 10,
              padding: '8px 12px',
              opacity: p,
              transform: `translateY(${map(p, 10, 0)}px)`,
              boxShadow: '0 10px 28px rgba(0,0,0,0.05)',
            }}
          >
            {name}
          </div>
        );
      })}
    </div>
  );
}

function AgentTerminal() {
  const frame = useCurrentFrame();
  const p = useS(24);
  const lines = [
    'check policy: SOC2 controls',
    'scan tools: least privilege',
    'validate output schema',
    'deploy agent: production ready',
  ];
  return (
    <div
      style={{
        width: 600,
        height: 460,
        borderRadius: 24,
        backgroundColor: colors.gray900,
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 28px 90px rgba(0,0,0,0.22)',
        overflow: 'hidden',
        opacity: p,
        transform: `translateY(${map(p, 28, 0)}px) rotate(${map(p, 2, 0)}deg)`,
      }}
    >
      <div style={{ height: 48, borderBottom: '1px solid rgba(255,255,255,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px' }}>
        <div style={{ display: 'flex', gap: 7 }}>
          {['#ef4444', '#f59e0b', '#22c55e'].map((color) => (
            <span key={color} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color }} />
          ))}
        </div>
        <div style={mono(11, 'rgba(255,255,255,0.42)')}>fde-agent / audit-run</div>
      </div>
      <div style={{ padding: 24 }}>
        <div style={mono(12, 'rgba(255,255,255,0.42)')}>WORKFLOW DAG</div>
        <div style={{ ...text(900, 58, colors.white), lineHeight: 1, marginTop: 18 }}>7 Nodes</div>
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 13 }}>
          {lines.map((line, index) => {
            const lineP = interpolate(frame, [42 + index * 12, 52 + index * 12], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={line}
                style={{
                  ...mono(15, 'rgba(255,255,255,0.78)', 500),
                  opacity: lineP,
                  transform: `translateX(${map(lineP, -14, 0)}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <span style={{ color: '#86efac' }}>14:02:{11 + index}</span>
                <span>{line}</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 34, height: 8, width: 420, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              borderRadius: 999,
              width: `${interpolate(frame, [76, 102], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}%`,
              backgroundColor: '#86efac',
            }}
          />
        </div>
      </div>
    </div>
  );
}

function HeroScene() {
  const frame = useCurrentFrame();
  const title = useS(8, 320, 24);
  const copy = useS(28);
  const buttons = useS(54);

  return (
    <Page>
      <Nav />
      <Audio src={staticFile('sounds/intro-boom.mp3')} volume={0.23} />
      <div style={{ position: 'absolute', inset: '118px 76px 72px', display: 'grid', gridTemplateColumns: '1fr 0.72fr', alignItems: 'center', gap: 42 }}>
        <div>
          <div style={{ ...text(500, 15, colors.gray600), marginBottom: 18 }}>
            Methodology inspired by FDE programs at
          </div>
          <MethodologyLogos />
          <div
            style={{
              ...text(900, 72, colors.black),
              lineHeight: 1.03,
              marginTop: 36,
              maxWidth: 910,
              opacity: title,
              transform: `translateY(${map(title, 28, 0)}px)`,
            }}
          >
            Custom AI Agents for Enterprise. Built Safely. Deployed Securely.
          </div>
          <div
            style={{
              ...text(450, 24, colors.gray600),
              lineHeight: 1.5,
              marginTop: 26,
              minHeight: 74,
              width: 830,
              opacity: copy,
            }}
          >
            <TypingText
              text="Forward Deployed Engineers embed with your team to build production-grade AI agents with security and compliance from day one."
              startFrame={32}
              charsPerFrame={1.7}
              showCursor={frame < 98}
            />
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 30, opacity: buttons, transform: `translateY(${map(buttons, 18, 0)}px)` }}>
            <div style={{ ...text(700, 16, colors.white), backgroundColor: colors.black, borderRadius: 999, padding: '15px 24px' }}>
              Deploy Secure AI Agents
            </div>
            <div style={{ ...text(650, 16, colors.black), backgroundColor: colors.white, border: `1px solid ${colors.gray200}`, borderRadius: 999, padding: '15px 24px' }}>
              I am an engineer
            </div>
          </div>
        </div>
        <AgentTerminal />
      </div>
      <SectionTag label="FDE hero" />
    </Page>
  );
}

function StatCard({ stat, index }: { stat: (typeof realityStats)[number]; index: number }) {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [12 + index * 7, 28 + index * 7], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        backgroundColor: colors.white,
        border: `1px solid ${colors.gray200}`,
        borderRadius: 18,
        padding: '22px 18px',
        opacity: p,
        transform: `translateY(${map(p, 24, 0)}px)`,
        boxShadow: '0 18px 52px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ ...text(900, 46, stat.tone), lineHeight: 1 }}>{stat.value}</div>
      <div style={{ ...text(560, 14, colors.gray600), lineHeight: 1.32, marginTop: 12 }}>{stat.label}</div>
    </div>
  );
}

function PillarSummary({ pillar, index }: { pillar: (typeof pillars)[number]; index: number }) {
  const p = useS(58 + index * 7);
  return (
    <div
      style={{
        backgroundColor: colors.gray50,
        border: `1px solid ${colors.gray200}`,
        borderRadius: 20,
        padding: 20,
        opacity: p,
        transform: `translateY(${map(p, 18, 0)}px)`,
      }}
    >
      <div style={{ width: 38, height: 4, backgroundColor: pillar.tone, borderRadius: 999, marginBottom: 14 }} />
      <div style={text(780, 20, colors.black)}>{pillar.title}</div>
      <div style={{ ...text(560, 14, colors.gray600), marginTop: 4 }}>{pillar.subtitle}</div>
    </div>
  );
}

function RealityScene() {
  const title = useS(5);
  return (
    <Page>
      <Nav />
      <Audio src={staticFile('sounds/reveal-shimmer.mp3')} volume={0.16} />
      <div style={{ position: 'absolute', inset: '122px 76px 74px' }}>
        <div style={{ opacity: title, transform: `translateY(${map(title, 18, 0)}px)` }}>
          <div style={{ ...text(720, 15, colors.gray500), textTransform: 'uppercase', marginBottom: 13 }}>
            The reality of enterprise AI
          </div>
          <div style={{ ...text(900, 64, colors.black), lineHeight: 1.05, maxWidth: 940 }}>
            Most AI demos never become production systems.
          </div>
          <div style={{ ...text(450, 22, colors.gray600), marginTop: 20, maxWidth: 840, lineHeight: 1.45 }}>
            Enterprise agents need security, compliance and reliability before the first workflow touches customer data.
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginTop: 50 }}>
          {realityStats.map((stat, index) => (
            <StatCard key={stat.value} stat={stat} index={index} />
          ))}
        </div>
        <div style={{ marginTop: 42, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {pillars.map((pillar, index) => (
            <PillarSummary key={pillar.title} pillar={pillar} index={index} />
          ))}
        </div>
      </div>
      <SectionTag label="Enterprise proof" />
    </Page>
  );
}

function PillarPanel({ pillar, index }: { pillar: (typeof pillars)[number]; index: number }) {
  const p = useS(20 + index * 12, 300, 26);
  return (
    <div
      style={{
        backgroundColor: colors.white,
        border: `1px solid ${colors.gray200}`,
        borderRadius: 24,
        padding: 24,
        minHeight: 298,
        boxShadow: '0 22px 70px rgba(0,0,0,0.06)',
        opacity: p,
        transform: `translateY(${map(p, 28, 0)}px)`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={mono(12, colors.gray500)}>0{index + 1}</div>
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: pillar.tone }} />
      </div>
      <div style={{ ...text(820, 28, colors.black), marginTop: 26, lineHeight: 1.1 }}>{pillar.title}</div>
      <div style={{ ...text(520, 15, colors.gray600), marginTop: 8 }}>{pillar.subtitle}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22 }}>
        {pillar.bullets.map((bullet) => (
          <div key={bullet} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: pillar.tone, flexShrink: 0 }} />
            <div style={text(560, 14, colors.gray700)}>{bullet}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PillarsScene() {
  const title = useS(5);
  return (
    <Page>
      <Nav />
      <Audio src={staticFile('sounds/transition.mp3')} volume={0.13} />
      <div style={{ position: 'absolute', inset: '126px 76px 74px' }}>
        <div style={{ textAlign: 'center', opacity: title, transform: `translateY(${map(title, 18, 0)}px)` }}>
          <div style={{ ...text(720, 15, colors.gray500), textTransform: 'uppercase', marginBottom: 12 }}>
            The enterprise challenge
          </div>
          <div style={{ ...text(900, 60, colors.black), lineHeight: 1.04 }}>
            Production-ready AI agents require three things.
          </div>
          <div style={{ ...text(450, 22, colors.gray600), marginTop: 18 }}>
            Security, compliance, and reliability built in from day one.
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginTop: 54 }}>
          {pillars.map((pillar, index) => (
            <PillarPanel key={pillar.title} pillar={pillar} index={index} />
          ))}
        </div>
      </div>
      <SectionTag label="Production requirements" />
    </Page>
  );
}

function FdeActionCard({ action, index }: { action: string; index: number }) {
  const p = useS(20 + index * 9);
  return (
    <div
      style={{
        minHeight: 144,
        border: '1px solid rgba(255,255,255,0.12)',
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 20,
        padding: 20,
        opacity: p,
        transform: `translateY(${map(p, 22, 0)}px)`,
      }}
    >
      <div style={{ ...mono(12, 'rgba(255,255,255,0.36)'), marginBottom: 28 }}>0{index + 1}</div>
      <div style={{ ...text(760, 22, colors.white), lineHeight: 1.2 }}>{action}</div>
    </div>
  );
}

function FdeRoleScene() {
  const title = useS(5);
  const quote = useS(32);
  return (
    <Page dark>
      <Nav dark />
      <Audio src={staticFile('sounds/sfx-reveal.mp3')} volume={0.18} />
      <div style={{ position: 'absolute', inset: '122px 76px 74px', display: 'grid', gridTemplateColumns: '0.86fr 1fr', gap: 46, alignItems: 'center' }}>
        <div style={{ opacity: title, transform: `translateY(${map(title, 18, 0)}px)` }}>
          <div style={{ ...text(720, 15, 'rgba(255,255,255,0.45)'), textTransform: 'uppercase', marginBottom: 14 }}>
            The role
          </div>
          <div style={{ ...text(900, 72, colors.white), lineHeight: 1.02 }}>
            Forward Deployed Engineer.
          </div>
          <div style={{ ...text(450, 20, 'rgba(255,255,255,0.56)'), marginTop: 24, lineHeight: 1.52 }}>
            A senior engineer who embeds with customers to build custom AI solutions that actually work in production.
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
            {['7-14 YOE', 'UTC-3', 'ET+2'].map((tag) => (
              <div key={tag} style={{ ...mono(12, 'rgba(255,255,255,0.74)'), border: '1px solid rgba(255,255,255,0.14)', borderRadius: 999, padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                {tag}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {fdeActions.map((action, index) => (
            <FdeActionCard key={action} action={action} index={index} />
          ))}
          <div
            style={{
              gridColumn: '1 / span 2',
              border: '1px solid rgba(255,255,255,0.12)',
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderRadius: 20,
              padding: 22,
              opacity: quote,
              transform: `translateY(${map(quote, 18, 0)}px)`,
            }}
          >
            <div style={{ ...text(620, 20, 'rgba(255,255,255,0.82)'), lineHeight: 1.46 }}>
              "For deeply technical products, it is the engineers that are the magic."
            </div>
            <div style={{ ...mono(12, 'rgba(255,255,255,0.38)'), marginTop: 12 }}>Marty Cagan, SVPG</div>
          </div>
        </div>
      </div>
      <SectionTag label="Embedded ownership" dark />
    </Page>
  );
}

function DagNode({ node, index }: { node: (typeof dagNodes)[number]; index: number }) {
  const p = useS(18 + index * 7, 320, 24);
  return (
    <div
      style={{
        position: 'absolute',
        left: node.x,
        top: node.y,
        width: node.name === 'AI Agent' ? 168 : 138,
        height: node.name === 'AI Agent' ? 86 : 66,
        borderRadius: 18,
        backgroundColor: node.name === 'AI Agent' ? colors.black : colors.white,
        border: `1px solid ${node.name === 'AI Agent' ? 'rgba(255,255,255,0.1)' : colors.gray200}`,
        boxShadow: '0 20px 58px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: p,
        transform: `translate(-50%, -50%) scale(${map(p, 0.86, 1)})`,
      }}
    >
      <div style={text(760, node.name === 'AI Agent' ? 20 : 16, node.name === 'AI Agent' ? colors.white : colors.black)}>
        {node.name}
      </div>
      <div style={{ position: 'absolute', left: 10, top: 10, width: 7, height: 7, borderRadius: '50%', backgroundColor: node.tone }} />
    </div>
  );
}

function DagLines() {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [18, 74], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <svg viewBox="0 0 780 500" style={{ position: 'absolute', inset: 0, width: 780, height: 500 }}>
      {[
        'M88 232 C180 232 260 232 380 232',
        'M380 232 C500 130 540 92 660 92',
        'M380 232 C510 190 560 186 690 186',
        'M380 232 C510 262 560 280 690 280',
        'M380 232 C500 330 540 374 662 374',
        'M380 232 C380 330 380 365 380 430',
      ].map((d, index) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={index === 0 ? colors.black : colors.gray300}
          strokeWidth={index === 0 ? 3 : 2}
          strokeDasharray={`${p * 520} 520`}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function PlatformCard({ platform, index }: { platform: (typeof platforms)[number]; index: number }) {
  const p = useS(34 + index * 8);
  return (
    <div
      style={{
        border: `1px solid ${colors.gray200}`,
        backgroundColor: colors.gray50,
        borderRadius: 16,
        padding: 15,
        opacity: p,
        transform: `translateY(${map(p, 14, 0)}px)`,
      }}
    >
      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: platform.tone, marginBottom: 10 }} />
      <div style={text(760, 17, colors.black)}>{platform.name}</div>
      <div style={{ ...mono(11, colors.gray500), marginTop: 5 }}>{platform.tag}</div>
    </div>
  );
}

function PlatformsScene() {
  const title = useS(5);
  return (
    <Page>
      <Nav />
      <Audio src={staticFile('sounds/sfx-agent-thinking.mp3')} volume={0.15} />
      <div style={{ position: 'absolute', inset: '120px 76px 74px', display: 'grid', gridTemplateColumns: '0.72fr 1fr', gap: 42, alignItems: 'center' }}>
        <div style={{ opacity: title, transform: `translateY(${map(title, 18, 0)}px)` }}>
          <div style={{ ...text(720, 15, colors.gray500), textTransform: 'uppercase', marginBottom: 12 }}>
            Custom solutions
          </div>
          <div style={{ ...text(900, 56, colors.black), lineHeight: 1.05 }}>
            One FDE. Every agent platform.
          </div>
          <div style={{ ...text(450, 20, colors.gray600), marginTop: 20, lineHeight: 1.48 }}>
            Stack-agnostic engineers choose or adapt to what your team already uses, then harden it for enterprise production.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 30 }}>
            {platforms.map((platform, index) => (
              <PlatformCard key={platform.name} platform={platform} index={index} />
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', width: 780, height: 500 }}>
          <DagLines />
          {dagNodes.map((node, index) => (
            <DagNode key={node.name} node={node} index={index} />
          ))}
        </div>
      </div>
      <SectionTag label="Agent workflow" />
    </Page>
  );
}

function CloseScene({ cta, ctaLabel }: WebsiteFlowProps) {
  const frame = useCurrentFrame();
  const logo = useS(4, 330, 22);
  const head = useS(18, 300, 25);
  const metrics = useS(42);
  const button = useS(62, 300, 22);
  const pulse = interpolate(Math.sin((frame - 70) * 0.18), [-1, 1], [1, 1.025], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Page dark>
      <Audio src={staticFile('sounds/sfx-ending-climax.mp3')} volume={0.42} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
        <FontFace />
        <div style={{ opacity: logo, transform: `scale(${map(logo, 0.55, 1)})`, marginBottom: 26 }}>
          <Img src={staticFile('brand/kochavit.png')} width={66} height={66} style={{ objectFit: 'contain', filter: 'invert(1)' }} />
        </div>
        <div style={{ ...text(900, 76, colors.white), lineHeight: 1.0, width: 1080, opacity: head, transform: `translateY(${map(head, 24, 0)}px)` }}>
          Build production-ready AI agents for enterprise.
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 32, opacity: metrics, transform: `translateY(${map(metrics, 18, 0)}px)` }}>
          {['First profiles in 48-72h', 'GDPR / SOC 2 ready', 'Single USD invoice'].map((item) => (
            <div key={item} style={{ ...text(620, 15, 'rgba(255,255,255,0.78)'), border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 999, padding: '12px 16px' }}>
              {item}
            </div>
          ))}
        </div>
        <div style={{ opacity: button, transform: `translateY(${map(button, 18, 0)}px) scale(${button > 0.9 ? pulse : map(button, 0.94, 1)})`, marginTop: 34 }}>
          <div style={{ ...text(760, 19, colors.black), display: 'inline-flex', backgroundColor: colors.white, borderRadius: 999, padding: '18px 46px', boxShadow: '0 0 48px rgba(255,255,255,0.16)' }}>
            {ctaLabel}
          </div>
          <div style={{ ...text(460, 14, 'rgba(255,255,255,0.46)'), marginTop: 13 }}>{cta}</div>
        </div>
      </div>
      <SectionTag label="Deploy secure AI agents" dark />
    </Page>
  );
}

export function WebsiteFlowVideo(props: WebsiteFlowProps) {
  return (
  <AbsoluteFill style={{ fontFamily: 'Geist, Inter, system-ui, sans-serif' }}>
    <FontFace />
    <Audio src={staticFile('sounds/music-main.mp3')} volume={0.1} loop />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={112}>
        <HeroScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming({ durationInFrames: TRANS })} presentation={premiumFade()} />
      <TransitionSeries.Sequence durationInFrames={96}>
        <RealityScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming({ durationInFrames: TRANS })} presentation={premiumFade()} />
      <TransitionSeries.Sequence durationInFrames={98}>
        <PillarsScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming({ durationInFrames: TRANS })} presentation={premiumFade()} />
      <TransitionSeries.Sequence durationInFrames={104}>
        <FdeRoleScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming({ durationInFrames: TRANS })} presentation={premiumFade()} />
      <TransitionSeries.Sequence durationInFrames={104}>
        <PlatformsScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming({ durationInFrames: TRANS })} presentation={premiumFade()} />
      <TransitionSeries.Sequence durationInFrames={104}>
        <CloseScene {...props} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
  );
}

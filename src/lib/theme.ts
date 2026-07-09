// Amplify brand system — mirrors web/src/app/globals.css + real ATS component classes

export const brand = {
  // Core B&W
  white: '#ffffff',
  black: '#000000',
  // Light surfaces
  bg: '#ffffff',
  surface: '#f8f8f8',
  borderSubtle: 'rgba(0,0,0,0.05)',
  borderMedium: 'rgba(0,0,0,0.10)',
  borderStrong: 'rgba(0,0,0,0.20)',
  // Text hierarchy
  textPrimary: '#000000',
  textMuted: 'rgba(0,0,0,0.50)',
  textSubtle: 'rgba(0,0,0,0.40)',
  textFaint: 'rgba(0,0,0,0.20)',
  // Dark surfaces (intro/outro scenes)
  darkBg: '#000000',
  darkSurface: '#0a0a0a',
  darkBorder: 'rgba(255,255,255,0.08)',
  darkTextMuted: 'rgba(255,255,255,0.40)',
  darkTextSubtle: 'rgba(255,255,255,0.60)',
  // Radius — matches --radius: 12px in globals.css
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  // Slack-inspired dark UI surfaces (used in AgentChat scene)
  slackDark: '#1a1a1a',
  slackSurface: '#222222',
  slackHighlight: '#2d2d2d',
  slackBorder: 'rgba(255,255,255,0.07)',
  slackText: 'rgba(255,255,255,0.88)',
  slackTextMuted: 'rgba(255,255,255,0.45)',
} as const;

// Semantic score colors — exact from web/src/components/candidates/utils.ts getScoreColor()
export const scoreColor = {
  high:   { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' }, // emerald
  good:   { bg: '#f0fdf4', text: '#15803d', border: '#86efac' }, // green
  medium: { bg: '#fffbeb', text: '#92400e', border: '#fcd34d' }, // amber
  low:    { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' }, // red
  none:   { bg: '#f9fafb', text: '#9ca3af', border: '#e5e7eb' }, // gray
} as const;

export function getScoreColor(score: number | null | undefined) {
  if (score == null) return scoreColor.none;
  if (score >= 80) return scoreColor.high;
  if (score >= 60) return scoreColor.good;
  if (score >= 40) return scoreColor.medium;
  return scoreColor.low;
}

export const seniorityColor: Record<string, { bg: string; text: string; border: string }> = {
  JUNIOR:    { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
  MID:       { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  SENIOR:    { bg: '#f5f3ff', text: '#4c1d95', border: '#ddd6fe' },
  STAFF:     { bg: '#fffbeb', text: '#92400e', border: '#fcd34d' },
  LEAD:      { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
  PRINCIPAL: { bg: '#fdf4ff', text: '#86198f', border: '#f0abfc' },
};

// Pipeline bar gradient — matches the exact linear-gradient in admin/page.tsx
export function getPipelineBarGradient(index: number, hasData: boolean): string {
  if (!hasData) return 'linear-gradient(90deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.04) 100%)';
  const from = Math.max(0.15, 0.85 - index * 0.08);
  const to = Math.max(0.10, 0.70 - index * 0.08);
  return `linear-gradient(90deg, rgba(0,0,0,${from.toFixed(2)}) 0%, rgba(0,0,0,${to.toFixed(2)}) 100%)`;
}

// Typography — Inter mirrors Geist (both neo-grotesque)
export const type = {
  display:  { fontFamily: 'Inter', fontWeight: 800, letterSpacing: '-0.035em' },
  heading:  { fontFamily: 'Inter', fontWeight: 700, letterSpacing: '-0.025em' },
  semibold: { fontFamily: 'Inter', fontWeight: 600, letterSpacing: '-0.015em' },
  body:     { fontFamily: 'Inter', fontWeight: 400, letterSpacing: '-0.010em' },
  label:    { fontFamily: 'Inter', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' as const },
  mono:     { fontFamily: 'JetBrains Mono', fontWeight: 500, letterSpacing: '0em' },
} as const;

// Keep old exports for backwards compat with existing components
export const colors = {
  black: '#000000',
  white: '#ffffff',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray400: '#9CA3AF',
  gray600: '#4B5563',
  gray800: '#1F2937',
  gray900: '#111827',
  green: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
  purple: '#7C3AED',
} as const;

export const typography = {
  display: type.display,
  heading: type.heading,
  body: type.body,
  mono: type.mono,
} as const;

export const seniorityColors: Record<string, string> = {
  JUNIOR: seniorityColor.JUNIOR?.text ?? '#065f46',
  MID: seniorityColor.MID?.text ?? '#1e40af',
  SENIOR: seniorityColor.SENIOR?.text ?? '#4c1d95',
  STAFF: seniorityColor.STAFF?.text ?? '#92400e',
  LEAD: seniorityColor.LEAD?.text ?? '#991b1b',
  PRINCIPAL: seniorityColor.PRINCIPAL?.text ?? '#86198f',
};

// CEMEX Official Brand Tokens — 2023 Rebrand (Extended v2)
export const brand = {
  // ── Core Brand Colors ────────────────────────────────────────────────────
  red:        '#DF343D',
  redDark:    '#B82830',
  redLight:   '#F5E6E7',
  navy:       '#293064',
  navyDark:   '#1C2245',
  navyDeep:   '#141833',
  navyLight:  '#E8E9F0',
  white:      '#FFFFFF',

  // ── Neutral Scale ────────────────────────────────────────────────────────
  gray50:  '#F8F9FA',
  gray100: '#F1F3F5',
  gray200: '#E9ECEF',
  gray300: '#DEE2E6',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',

  // ── Semantic Surface Colors ──────────────────────────────────────────────
  surface:         '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted:    '#F8F9FA',
  surfaceSubtle:   '#F1F3F5',
  border:          '#E2E8F0',
  borderLight:     '#F1F3F5',
  borderFocus:     '#293064',

  // ── Status Colors ────────────────────────────────────────────────────────
  success:      '#16A34A',
  successLight: '#F0FDF4',
  successText:  '#15803D',
  warning:      '#D97706',
  warningLight: '#FEF3C7',
  warningText:  '#92400E',
  info:         '#0284C7',
  infoLight:    '#F0F9FF',
  infoText:     '#0369A1',

  // ── Gradient Definitions ─────────────────────────────────────────────────
  gradientHeader:       'linear-gradient(160deg, #293064 0%, #1C2245 100%)',
  gradientHeaderAccent: 'linear-gradient(160deg, #2d3570 0%, #1C2245 60%, #141833 100%)',
  gradientProgress:     'linear-gradient(90deg, #293064 0%, #DF343D 100%)',
  gradientCardAccent:   'linear-gradient(135deg, #DF343D 0%, #B82830 100%)',
  gradientOrgCard:      'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 100%)',

  // ── Shadow Scale ─────────────────────────────────────────────────────────
  shadowNone:  'none',
  shadowXs:    '0 1px 3px rgba(41,48,100,0.06)',
  shadowSm:    '0 1px 8px rgba(41,48,100,0.08)',
  shadowMd:    '0 2px 12px rgba(41,48,100,0.10)',
  shadowLg:    '0 4px 20px rgba(41,48,100,0.14)',
  shadowXl:    '0 8px 32px rgba(41,48,100,0.18)',
  shadowInset: 'inset 0 1px 3px rgba(41,48,100,0.08)',

  // ── Typography Scale ─────────────────────────────────────────────────────
  textXs:     { fontSize: 10, lineHeight: 1.4, fontWeight: 600 },
  textSm:     { fontSize: 11, lineHeight: 1.4, fontWeight: 500 },
  textSmBold: { fontSize: 11, lineHeight: 1.4, fontWeight: 700 },
  textBase:   { fontSize: 13, lineHeight: 1.5, fontWeight: 500 },
  textMd:     { fontSize: 13, lineHeight: 1.5, fontWeight: 700 },
  textLg:     { fontSize: 15, lineHeight: 1.4, fontWeight: 700 },
  textXl:     { fontSize: 18, lineHeight: 1.3, fontWeight: 800 },
  text2xl:    { fontSize: 20, lineHeight: 1.25, fontWeight: 800, letterSpacing: -0.5 },
  textLabel:  { fontSize: 10, lineHeight: 1.3, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.8 },
  textMono:   { fontVariantNumeric: 'tabular-nums' as const, fontFeatureSettings: '"tnum"' },

  // ── Spacing Scale (8px grid) ─────────────────────────────────────────────
  space1: 4,
  space2: 8,
  space3: 12,
  space4: 16,
  space5: 20,
  space6: 24,

  // ── Border Radius Scale ──────────────────────────────────────────────────
  radiusSm:   8,
  radiusMd:   12,
  radiusLg:   16,
  radiusXl:   20,
  radius2xl:  24,
  radiusFull: 999,
}

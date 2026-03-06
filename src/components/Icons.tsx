// Icons — filled/solid for colored backgrounds, stroke for navigation
interface IconProps { size?: number; color?: string; className?: string }

// ── Navigation (stroke — used on white/neutral backgrounds) ──────────────────

export const IconChevron = ({ size = 18, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const IconBack = ({ size = 18, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 6l-6 6 6 6" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ── Section icons (solid filled — used on colored tinted backgrounds) ─────────

export const IconBuilding = ({ size = 22, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Main structure */}
    <path d="M3 21V5a2 2 0 012-2h14a2 2 0 012 2v16H3z" fill={color} fillOpacity="0.2"/>
    <path d="M3 21h18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    {/* Roof / top band */}
    <path d="M3 5a2 2 0 012-2h14a2 2 0 012 2v2H3V5z" fill={color} fillOpacity="0.55"/>
    {/* Windows */}
    <rect x="6" y="10" width="3.5" height="3" rx="0.7" fill={color}/>
    <rect x="10.25" y="10" width="3.5" height="3" rx="0.7" fill={color}/>
    <rect x="14.5" y="10" width="3.5" height="3" rx="0.7" fill={color}/>
    {/* Door */}
    <rect x="9.5" y="15.5" width="5" height="5.5" rx="0.7" fill={color} fillOpacity="0.7"/>
  </svg>
)

export const IconPlus = ({ size = 16, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.4" strokeLinecap="round"/>
  </svg>
)

export const IconCalendar = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="16" rx="3" fill={color} fillOpacity="0.18"/>
    <rect x="3" y="5" width="18" height="6.5" rx="3" fill={color} fillOpacity="0.5"/>
    <rect x="3" y="9" width="18" height="2.5" fill={color} fillOpacity="0.5"/>
    {/* Rings */}
    <rect x="7.5" y="2.5" width="2.5" height="5" rx="1.25" fill={color}/>
    <rect x="14" y="2.5" width="2.5" height="5" rx="1.25" fill={color}/>
    {/* Date highlight */}
    <rect x="9.5" y="14" width="5" height="4" rx="1.5" fill={color} fillOpacity="0.65"/>
  </svg>
)

export const IconClipboard = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Board */}
    <rect x="5" y="4" width="14" height="17" rx="2.5" fill={color} fillOpacity="0.2"/>
    {/* Top clip */}
    <path d="M9 4a3 3 0 006 0H16a2 2 0 012 2v1H6V6a2 2 0 012-2h1z" fill={color} fillOpacity="0.55"/>
    <rect x="9.5" y="2" width="5" height="4" rx="1.5" fill={color} fillOpacity="0.8"/>
    <rect x="10.5" y="1.5" width="3" height="3" rx="1.5" fill={color}/>
    {/* Content lines */}
    <rect x="8" y="11" width="8" height="2" rx="1" fill={color} fillOpacity="0.65"/>
    <rect x="8" y="15" width="5.5" height="2" rx="1" fill={color} fillOpacity="0.45"/>
  </svg>
)

export const IconTruck = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Cargo */}
    <rect x="1" y="6" width="13" height="11" rx="2" fill={color} fillOpacity="0.2"/>
    <rect x="1" y="6" width="13" height="3.5" rx="2" fill={color} fillOpacity="0.45"/>
    {/* Cabin */}
    <path d="M14 9.5h4l2.5 3.5V17H14V9.5z" fill={color} fillOpacity="0.55"/>
    <path d="M14.5 10l1.5 3h4.5" stroke={color} strokeWidth="0.8" strokeOpacity="0.3" fill="none"/>
    {/* Wheels */}
    <circle cx="6.5" cy="18.5" r="2.5" fill={color} fillOpacity="0.45"/>
    <circle cx="6.5" cy="18.5" r="1.3" fill={color}/>
    <circle cx="18.5" cy="18.5" r="2.5" fill={color} fillOpacity="0.45"/>
    <circle cx="18.5" cy="18.5" r="1.3" fill={color}/>
  </svg>
)

export const IconMap = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M1 6l7-4 8 4 7-4v16l-7 4-8-4-7 4V6z" fill={color} fillOpacity="0.15"/>
    <path d="M1 6l7-4v16l-7 4V6z" fill={color} fillOpacity="0.35"/>
    <path d="M16 6l7-4v16l-7 4V6z" fill={color} fillOpacity="0.25"/>
    <path d="M8 2v16M16 6v16" stroke={color} strokeWidth="1.2" strokeOpacity="0.4"/>
    {/* Location pin */}
    <circle cx="12" cy="10" r="2.8" fill={color} fillOpacity="0.65"/>
    <circle cx="12" cy="10" r="1.4" fill={color}/>
    <path d="M12 12.8v2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/>
  </svg>
)

export const IconCamera = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Body */}
    <rect x="2" y="8" width="20" height="13" rx="3" fill={color} fillOpacity="0.2"/>
    <rect x="2" y="8" width="20" height="4.5" rx="3" fill={color} fillOpacity="0.35"/>
    {/* Viewfinder bump */}
    <path d="M9 8V6.5C9 5.67 9.67 5 10.5 5h3c.83 0 1.5.67 1.5 1.5V8" fill={color} fillOpacity="0.5"/>
    {/* Lens rings */}
    <circle cx="12" cy="14.5" r="4.5" fill={color} fillOpacity="0.25"/>
    <circle cx="12" cy="14.5" r="3" fill={color} fillOpacity="0.45"/>
    <circle cx="12" cy="14.5" r="1.5" fill={color}/>
    {/* Flash */}
    <circle cx="18.5" cy="11" r="1.2" fill={color} fillOpacity="0.6"/>
  </svg>
)

export const IconWifi = ({ size = 15, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M1.42 9a16 16 0 0121.16 0" stroke={color} strokeWidth="2" strokeLinecap="round" fillOpacity="0.3" fill="none"/>
    <path d="M5 12.55a11 11 0 0114.08 0" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M8.53 16.11a6 6 0 016.95 0" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="12" cy="20" r="1.5" fill={color} stroke="none"/>
  </svg>
)

export const IconWifiOff = ({ size = 15, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <line x1="1" y1="1" x2="23" y2="23"/>
    <path d="M16.72 11.06A10.94 10.94 0 0119 12.55"/>
    <path d="M5 12.55a11 11 0 015.17-2.39"/>
    <path d="M10.71 5.05A16 16 0 0122.56 9"/>
    <path d="M1.42 9a15.91 15.91 0 014.7-2.88"/>
    <path d="M8.53 16.11a6 6 0 016.95 0"/>
    <circle cx="12" cy="20" r="1" fill={color} stroke="none"/>
  </svg>
)

export const IconCheck = ({ size = 14, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.15"/>
    <polyline points="7 12 10.5 15.5 17 9" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
)

export const IconThermometer = ({ size = 12, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="10" y="3" width="4" height="13" rx="2" fill={color} fillOpacity="0.25"/>
    <rect x="11.2" y="3" width="1.6" height="10" rx="0.8" fill={color} fillOpacity="0.6"/>
    <circle cx="12" cy="18" r="4" fill={color} fillOpacity="0.4"/>
    <circle cx="12" cy="18" r="2.5" fill={color}/>
  </svg>
)

export const IconWind = ({ size = 12, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <path d="M9.59 4.59A2 2 0 1111 8H2"/>
    <path d="M12.59 19.41A2 2 0 1114 16H2"/>
    <path d="M17.73 7.73A2.5 2.5 0 1119.5 12H2"/>
  </svg>
)

export const IconUpload = ({ size = 18, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M18 13a5 5 0 00-1.61-9H15A8 8 0 005 16" fill={color} fillOpacity="0.1"/>
    <polyline points="16 16 12 12 8 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="12" y1="12" x2="12" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export const IconPdf = ({ size = 18, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M6 2h9l5 5v15a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" fill={color} fillOpacity="0.18"/>
    <path d="M15 2l5 5h-4a1 1 0 01-1-1V2z" fill={color} fillOpacity="0.55"/>
    <rect x="4" y="13" width="16" height="6" rx="1.5" fill={color} fillOpacity="0.3"/>
    {/* PDF text */}
    <rect x="6.5" y="15" width="3" height="1.5" rx="0.7" fill={color} fillOpacity="0.8"/>
    <rect x="6.5" y="17" width="2" height="1.5" rx="0.7" fill={color} fillOpacity="0.55"/>
    <rect x="10.5" y="15" width="2" height="3" rx="0.7" fill={color} fillOpacity="0.8"/>
    <rect x="13.5" y="15" width="3.5" height="1.5" rx="0.7" fill={color} fillOpacity="0.8"/>
    <rect x="13.5" y="17" width="2" height="1.5" rx="0.7" fill={color} fillOpacity="0.55"/>
  </svg>
)

export const IconUsers = ({ size = 18, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Back person */}
    <circle cx="16.5" cy="8" r="3.5" fill={color} fillOpacity="0.35"/>
    <path d="M20 20c0-3.31-1.57-6-3.5-6s-3.5 2.69-3.5 6" fill={color} fillOpacity="0.25"/>
    {/* Front person */}
    <circle cx="9" cy="7" r="4" fill={color} fillOpacity="0.55"/>
    <circle cx="9" cy="7" r="2.5" fill={color}/>
    <path d="M1 21c0-4 3.58-7 8-7s8 3 8 7" fill={color} fillOpacity="0.4"/>
  </svg>
)

export const IconBarChart = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="4" y="14" width="4" height="7" rx="2" fill={color} fillOpacity="0.35"/>
    <rect x="10" y="8" width="4" height="13" rx="2" fill={color} fillOpacity="0.6"/>
    <rect x="16" y="4" width="4" height="17" rx="2" fill={color}/>
    <rect x="2" y="21" width="20" height="1.5" rx="0.75" fill={color} fillOpacity="0.3"/>
  </svg>
)

export const IconUser = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="5" fill={color} fillOpacity="0.4"/>
    <circle cx="12" cy="8" r="3.2" fill={color}/>
    <path d="M4 21c0-4 3.58-7 8-7s8 3 8 7" fill={color} fillOpacity="0.3"/>
  </svg>
)

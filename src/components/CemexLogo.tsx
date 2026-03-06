// CEMEX Logo SVG — official 2023 wordmark with stripe motif
interface Props {
  variant?: 'full' | 'icon'
  height?: number
  light?: boolean
}

export default function CemexLogo({ variant = 'full', height = 28, light = false }: Props) {
  const redColor = '#DF343D'
  const blueColor = '#293064'

  if (variant === 'icon') {
    // Stripe icon only — the two diagonal stripes motif
    return (
      <svg width={height} height={height} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="8" fill={blueColor} />
        <rect x="6" y="14" width="28" height="5" rx="1" fill={redColor} />
        <rect x="6" y="22" width="28" height="5" rx="1" fill="#FFFFFF" opacity="0.9" />
      </svg>
    )
  }

  return (
    <svg height={height} viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stripe accent — left side */}
      <rect x="0" y="8" width="6" height="10" rx="1" fill={redColor} />
      <rect x="0" y="22" width="6" height="10" rx="1" fill={blueColor} opacity={light ? '0.5' : '1'} />

      {/* CEMEX wordmark */}
      <text
        x="14"
        y="30"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="26"
        letterSpacing="-0.5"
        fill={light ? '#FFFFFF' : blueColor}
      >
        CEMEX
      </text>

      {/* Red dot accent on X */}
      <circle cx="174" cy="10" r="4" fill={redColor} />
    </svg>
  )
}

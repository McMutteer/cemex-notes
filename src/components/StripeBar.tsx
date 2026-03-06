// CEMEX identity stripe motif — used at top/bottom of headers
export default function StripeBar({ bottom = false }: { bottom?: boolean }) {
  return (
    <div className={`flex w-full ${bottom ? '' : ''}`} style={{ height: 5 }}>
      <div style={{ flex: 1, background: '#DF343D' }} />
      <div style={{ flex: 1, background: '#293064' }} />
      <div style={{ flex: 1, background: '#DF343D' }} />
      <div style={{ flex: 1, background: '#293064' }} />
    </div>
  )
}

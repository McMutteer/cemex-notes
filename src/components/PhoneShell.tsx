import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'

function LiveTime() {
  const [time, setTime] = useState(() => {
    const d = new Date()
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
  })
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date()
      setTime(`${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`)
    }, 10000)
    return () => clearInterval(id)
  }, [])
  return <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: -0.3 }}>{time}</span>
}

export default function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#d4d8e0' }}>
      <div style={{
        width: 390, height: 844, borderRadius: 50, border: '12px solid #1C2245',
        background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(41,48,100,0.28), 0 8px 24px rgba(0,0,0,0.14)',
        position: 'relative',
        transform: 'translateZ(0)',
      }}>
        {/* Physical buttons */}
        <div style={{ position: 'absolute', left: -16, top: 118, width: 4, height: 30, background: '#1C2245', borderRadius: 3 }} />
        <div style={{ position: 'absolute', left: -16, top: 160, width: 4, height: 54, background: '#1C2245', borderRadius: 3 }} />
        <div style={{ position: 'absolute', left: -16, top: 224, width: 4, height: 54, background: '#1C2245', borderRadius: 3 }} />
        <div style={{ position: 'absolute', right: -16, top: 168, width: 4, height: 70, background: '#1C2245', borderRadius: 3 }} />

        {/* Dynamic island */}
        <div style={{
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          width: 118, height: 34, background: '#080808', borderRadius: 20, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.04)',
        }}>
          {/* Camera + Face ID sensor */}
          <div style={{ width: 10, height: 10, background: '#1a1a1a', borderRadius: '50%', border: '1.5px solid #2d2d2d', boxShadow: 'inset 0 0 3px rgba(255,255,255,0.06)' }} />
          <div style={{ width: 10, height: 10, background: '#111', borderRadius: '50%', border: '1px solid #222' }} />
        </div>

        {/* Status bar — iOS-accurate layout */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '54px 24px 4px', flexShrink: 0,
        }}>
          {/* Left: Time */}
          <LiveTime />

          {/* Right: connectivity indicators */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {/* Signal + 5G */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
              {[5, 7, 9, 11].map((h, i) => (
                <div key={i} style={{
                  width: 3, height: h, borderRadius: 1.5,
                  background: i < 3 ? '#1E293B' : 'rgba(30,41,59,0.25)',
                }} />
              ))}
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#1E293B', letterSpacing: -0.2 }}>5G</span>

            {/* WiFi — 3 arcs + dot */}
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <circle cx="8" cy="11" r="1.4" fill="#1E293B"/>
              <path d="M4.5 8C5.7 6.7 6.8 6 8 6s2.3.7 3.5 2" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <path d="M1.5 5.2C3.4 3 5.6 2 8 2s4.6 1 6.5 3.2" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>

            {/* Battery */}
            <svg width="28" height="14" viewBox="0 0 28 14" fill="none">
              {/* Outer shell */}
              <rect x="0.5" y="1" width="24" height="12" rx="3.5" stroke="#1E293B" strokeOpacity="0.35" strokeWidth="1"/>
              {/* Fill — ~75% */}
              <rect x="2" y="2.5" width="18" height="9" rx="2.5" fill="#1E293B"/>
              {/* Nub */}
              <path d="M25.5 5v4c1-.4 1.5-1.1 1.5-2s-.5-1.6-1.5-2z" fill="#1E293B" fillOpacity="0.4"/>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div id="phone-shell-content" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {children}
        </div>

        {/* Home indicator */}
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', padding: '8px 0 12px', background: '#fff' }}>
          <div style={{ width: 134, height: 5, background: '#1C2245', borderRadius: 3, opacity: 0.18 }} />
        </div>
      </div>
    </div>
  )
}

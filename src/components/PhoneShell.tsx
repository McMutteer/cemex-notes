import type { ReactNode } from 'react'

export default function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#dde1e7' }}>
      <div style={{
        width: 390, height: 844, borderRadius: 50, border: '12px solid #1C2245',
        background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(41,48,100,0.28), 0 8px 24px rgba(0,0,0,0.14)',
        position: 'relative',
      }}>
        {/* Physical buttons */}
        <div style={{ position: 'absolute', left: -15, top: 118, width: 4, height: 30, background: '#1C2245', borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: -15, top: 160, width: 4, height: 54, background: '#1C2245', borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: -15, top: 224, width: 4, height: 54, background: '#1C2245', borderRadius: 2 }} />
        <div style={{ position: 'absolute', right: -15, top: 168, width: 4, height: 70, background: '#1C2245', borderRadius: 2 }} />

        {/* Dynamic island */}
        <div style={{
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          width: 118, height: 34, background: '#080808', borderRadius: 20, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <div style={{ width: 10, height: 10, background: '#1a1a1a', borderRadius: '50%', border: '1.5px solid #2a2a2a' }} />
          <div style={{ width: 10, height: 10, background: '#111', borderRadius: '50%' }} />
        </div>

        {/* Status bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '52px 22px 6px', fontSize: 12, fontWeight: 700, color: '#1E293B', flexShrink: 0,
        }}>
          <span>9:41</span>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {/* Signal bars */}
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
              <rect x="0" y="7" width="3" height="5" rx="0.8" fill="#1E293B"/>
              <rect x="4.7" y="4.5" width="3" height="7.5" rx="0.8" fill="#1E293B"/>
              <rect x="9.4" y="2" width="3" height="10" rx="0.8" fill="#1E293B"/>
              <rect x="14.1" y="0" width="3" height="12" rx="0.8" fill="#1E293B"/>
            </svg>
            {/* Wifi */}
            <svg width="16" height="13" viewBox="0 0 16 13" fill="none">
              <path d="M8 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" fill="#1E293B"/>
              <path d="M3.5 7C5 5.3 6.4 4.5 8 4.5s3 .8 4.5 2.5" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <path d="M1 4.5C3.2 2 5.5 0.8 8 0.8s4.8 1.2 7 3.7" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
            {/* Battery */}
            <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
              <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="#1E293B" strokeOpacity="0.4"/>
              <rect x="2" y="2" width="18" height="9" rx="2" fill="#1E293B"/>
              <path d="M25 4.5v4c.9-.4 1.5-1.1 1.5-2s-.6-1.6-1.5-2z" fill="#1E293B" fillOpacity="0.4"/>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>

        {/* Home indicator */}
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', padding: '8px 0 12px', background: '#fff' }}>
          <div style={{ width: 124, height: 5, background: '#1C2245', borderRadius: 3, opacity: 0.15 }} />
        </div>
      </div>
    </div>
  )
}

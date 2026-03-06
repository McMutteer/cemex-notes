interface Props {
  camiones: Array<{ id: string; cr: string }>
  onPick: (cr: string) => void
  onClose: () => void
}

export default function CRPickerSheet({ camiones, onPick, onClose }: Props) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}
      onClick={onClose}
    >
      <div
        style={{ width: '100%', background: '#fff', borderRadius: '24px 24px 0 0', padding: '20px 16px 32px', maxHeight: '70vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1E293B' }}>Asignar CR al punto</h3>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94A3B8' }}>Selecciona el camión revolvedor</p>
          </div>
          <button onClick={onClose} style={{ background: '#F1F3F5', border: 'none', borderRadius: 20, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#64748B' }}>×</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {camiones.map((c, i) => (
            <button
              key={c.id}
              onClick={() => onPick(c.cr)}
              style={{
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                borderRadius: 12,
                padding: '12px 10px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: '#293064',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>{i + 1}</span>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#1E293B' }}>CR {c.cr}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

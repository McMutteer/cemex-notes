import { useState } from 'react'
import { useAppStore } from '../context/AppContext'
import StripeBar from '../components/StripeBar'
import { IconBack, IconPlus } from '../components/Icons'
import type { CamionCR } from '../types'

interface Props {
  onNavigate: (screen: string) => void
}

const inputStyle = { width: '100%', background: '#F8F9FA', border: '1px solid #E9ECEF', borderRadius: 12, padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1E293B', marginTop: 4, boxSizing: 'border-box' as const }
const labelStyle = { fontSize: 10, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.4 }

interface ModalProps {
  initial?: CamionCR
  onClose: () => void
  onSave: (c: CamionCR) => void
}

function CamionModal({ initial, onClose, onSave }: ModalProps) {
  const [cr, setCr] = useState(initial?.cr ?? '')
  const [m3, setM3] = useState(initial?.m3 ? String(initial.m3) : '')
  const [horaLlegada, setHoraLlegada] = useState(initial?.horaLlegada ?? '')
  const [horaInicio, setHoraInicio] = useState(initial?.horaInicio ?? '')
  const [horaTermino, setHoraTermino] = useState(initial?.horaTermino ?? '')
  const [rev, setRev] = useState(initial?.rev ?? '')
  const [temp, setTemp] = useState(initial?.tempConcreto ?? '')
  const [espera, setEspera] = useState(initial?.esperaCliente ?? '')

  const isEdit = !!initial

  const handleSave = () => {
    if (!cr) return
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      cr,
      m3: Number(m3) || 0,
      horaLlegada,
      horaInicio,
      horaTermino,
      rev,
      tempConcreto: temp,
      esperaCliente: espera,
    })
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ background: '#fff', width: '100%', borderRadius: '24px 24px 0 0', padding: 20, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 4, height: 20, background: '#DF343D', borderRadius: 2 }} />
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1E293B' }}>
              {isEdit ? 'Editar Camión CR' : 'Registrar Camión CR'}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: '#F1F3F5', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontSize: 16, color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div><label style={labelStyle}># CR</label><input style={inputStyle} placeholder="5894" value={cr} onChange={e => setCr(e.target.value)} /></div>
          <div><label style={labelStyle}>m³</label><input style={inputStyle} placeholder="7" type="number" value={m3} onChange={e => setM3(e.target.value)} /></div>
          <div><label style={labelStyle}>Hora llegada</label><input type="time" style={inputStyle} value={horaLlegada} onChange={e => setHoraLlegada(e.target.value)} /></div>
          <div><label style={labelStyle}>Hora inicio</label><input type="time" style={inputStyle} value={horaInicio} onChange={e => setHoraInicio(e.target.value)} /></div>
          <div><label style={labelStyle}>Hora término</label><input type="time" style={inputStyle} value={horaTermino} onChange={e => setHoraTermino(e.target.value)} /></div>
          <div><label style={labelStyle}>Rev</label><input style={inputStyle} placeholder="11" value={rev} onChange={e => setRev(e.target.value)} /></div>
          <div><label style={labelStyle}>Temp. Concreto (°C)</label><input style={inputStyle} placeholder="31.3" value={temp} onChange={e => setTemp(e.target.value)} /></div>
          <div><label style={labelStyle}>Espera Cliente</label><input style={inputStyle} placeholder="0 mins" value={espera} onChange={e => setEspera(e.target.value)} /></div>
        </div>
        <button
          onClick={handleSave}
          disabled={!cr}
          style={{ width: '100%', marginTop: 14, background: cr ? '#293064' : '#CBD5E1', color: '#fff', borderRadius: 14, border: 'none', cursor: cr ? 'pointer' : 'not-allowed', padding: '14px', fontSize: 13, fontWeight: 700 }}
        >
          {isEdit ? 'Guardar cambios' : 'Guardar CR'}
        </button>
      </div>
    </div>
  )
}

export default function Camiones({ onNavigate }: Props) {
  const { sesiones, activeSessionId, addCamion, updateCamion, removeCamion } = useAppStore()
  const sesion = sesiones.find(s => s.id === activeSessionId)
  const camiones = sesion?.camiones ?? []
  const [showNew, setShowNew] = useState(false)
  const [editingCamion, setEditingCamion] = useState<CamionCR | null>(null)

  const totalM3 = camiones.reduce((sum, c) => sum + c.m3, 0)

  const handleAdd = (c: CamionCR) => {
    if (activeSessionId) addCamion(activeSessionId, c)
  }

  const handleUpdate = (c: CamionCR) => {
    if (activeSessionId) updateCamion(activeSessionId, c.id, c)
  }

  const handleRemove = (id: string, cr: string) => {
    if (!activeSessionId) return
    if (window.confirm(`¿Eliminar CR ${cr}? Esta acción no se puede deshacer.`)) {
      removeCamion(activeSessionId, id)
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F1F3F5' }}>
      <div style={{ background: '#293064', paddingBottom: 20 }}>
        <StripeBar />
        <div style={{ padding: '10px 18px 0' }}>
          <button onClick={() => onNavigate('sesion')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', padding: '4px 0', marginBottom: 8 }}>
            <IconBack size={16} color="rgba(255,255,255,0.6)" /> {sesion?.fecha ?? 'Sesión'}
          </button>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>Camiones CR</h1>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>Registro de viajes del día</p>
            </div>
            <button onClick={() => setShowNew(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#DF343D', color: '#fff', border: 'none', borderRadius: 20, padding: '7px 14px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
              <IconPlus size={13} color="#fff" /> Registrar CR
            </button>
          </div>
        </div>
      </div>

      <div style={{ margin: '0 16px', marginTop: -16 }}>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(41,48,100,0.1)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', overflow: 'hidden' }}>
          {[
            { label: 'CRs', value: String(camiones.length), color: '#293064' },
            { label: 'm³ total', value: String(totalM3), color: '#1E293B' },
            { label: 'Último CR', value: camiones.length > 0 ? `CR ${camiones[camiones.length - 1].cr}` : '—', color: '#DF343D' },
          ].map((s, i) => (
            <div key={s.label} style={{ padding: '12px 8px', textAlign: 'center', borderLeft: i > 0 ? '1px solid #F1F3F5' : 'none' }}>
              <p style={{ margin: 0, fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>{s.label}</p>
              <p style={{ margin: '3px 0 0', fontSize: 15, fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 8px' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 8 }}>Secuencia</span>

        {camiones.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#94A3B8' }}>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Sin camiones registrados</p>
            <p style={{ fontSize: 11, marginTop: 4 }}>Usa "Registrar CR" para agregar el primer viaje</p>
          </div>
        ) : (
          camiones.map((c, i) => (
            <div key={c.id} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 8px rgba(41,48,100,0.07)', marginBottom: 8, overflow: 'hidden' }}>
              <button
                onClick={() => setEditingCamion(c)}
                style={{ width: '100%', padding: '12px 14px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: '#293064', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 800 }}>
                      {i + 1}
                    </div>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#1E293B' }}>CR {c.cr}</span>
                      <span style={{ fontSize: 11, color: '#94A3B8', marginLeft: 8 }}>{c.m3} m³</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {c.horaLlegada && <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>{c.horaLlegada}{c.horaTermino ? ` → ${c.horaTermino}` : ''}</p>}
                    {c.rev && <p style={{ margin: '1px 0 0', fontSize: 11, fontWeight: 600, color: '#64748B' }}>Rev {c.rev}</p>}
                  </div>
                </div>
                {(c.tempConcreto || c.esperaCliente) && (
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 8 }}>
                    {c.tempConcreto && <span style={{ fontSize: 10, background: '#FEF2F2', color: '#DF343D', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{c.tempConcreto}°C</span>}
                    {c.esperaCliente && <span style={{ fontSize: 10, background: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>Cliente: {c.esperaCliente}</span>}
                  </div>
                )}
              </button>
              <div style={{ borderTop: '1px solid #F1F3F5' }}>
                <button
                  onClick={() => handleRemove(c.id, c.cr)}
                  style={{ width: '100%', padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#DF343D', fontSize: 12, fontWeight: 700, textAlign: 'center' }}
                >
                  Eliminar CR
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showNew && <CamionModal onClose={() => setShowNew(false)} onSave={handleAdd} />}
      {editingCamion && <CamionModal initial={editingCamion} onClose={() => setEditingCamion(null)} onSave={handleUpdate} />}
    </div>
  )
}

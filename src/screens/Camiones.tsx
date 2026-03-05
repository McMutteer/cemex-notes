import { useState } from 'react'
import { useAppStore } from '../context/AppContext'
import StripeBar from '../components/StripeBar'
import { IconBack, IconPlus } from '../components/Icons'
import { brand } from '../brand'
import type { CamionCR } from '../types'

interface Props {
  onNavigate: (screen: string) => void
}

const inputStyle = { width: '100%', background: brand.surfaceMuted, border: `1.5px solid ${brand.border}`, borderRadius: brand.radiusMd, padding: '10px 12px', fontSize: 13, fontWeight: 600, color: brand.gray800, marginTop: 4, boxSizing: 'border-box' as const, fontFamily: 'inherit' }
const labelStyle = { fontSize: 10, color: brand.gray400, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.6 }

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
      <div style={{ background: brand.surface, width: '100%', borderRadius: `${brand.radius2xl}px ${brand.radius2xl}px 0 0`, padding: 20, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 -8px 32px rgba(41,48,100,0.14)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 4, height: 20, background: brand.red, borderRadius: 2 }} />
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: brand.gray800 }}>
              {isEdit ? 'Editar Camión CR' : 'Registrar Camión CR'}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: brand.surfaceSubtle, border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontSize: 16, color: brand.gray500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div><label htmlFor="camion-cr" style={labelStyle}># CR</label><input id="camion-cr" className="cemex-input" style={inputStyle} placeholder="5894" value={cr} onChange={e => setCr(e.target.value)} /></div>
          <div><label htmlFor="camion-m3" style={labelStyle}>m³</label><input id="camion-m3" className="cemex-input" style={inputStyle} placeholder="7" type="number" value={m3} onChange={e => setM3(e.target.value)} /></div>
          <div><label htmlFor="camion-llegada" style={labelStyle}>Hora llegada</label><input id="camion-llegada" type="time" className="cemex-input" style={inputStyle} value={horaLlegada} onChange={e => setHoraLlegada(e.target.value)} /></div>
          <div><label htmlFor="camion-inicio" style={labelStyle}>Hora inicio</label><input id="camion-inicio" type="time" className="cemex-input" style={inputStyle} value={horaInicio} onChange={e => setHoraInicio(e.target.value)} /></div>
          <div><label htmlFor="camion-termino" style={labelStyle}>Hora término</label><input id="camion-termino" type="time" className="cemex-input" style={inputStyle} value={horaTermino} onChange={e => setHoraTermino(e.target.value)} /></div>
          <div><label htmlFor="camion-rev" style={labelStyle}>Rev</label><input id="camion-rev" className="cemex-input" style={inputStyle} placeholder="11" value={rev} onChange={e => setRev(e.target.value)} /></div>
          <div><label htmlFor="camion-temp" style={labelStyle}>Temp. Concreto (°C)</label><input id="camion-temp" className="cemex-input" style={inputStyle} placeholder="31.3" value={temp} onChange={e => setTemp(e.target.value)} /></div>
          <div><label htmlFor="camion-espera" style={labelStyle}>Espera Cliente</label><input id="camion-espera" className="cemex-input" style={inputStyle} placeholder="0 mins" value={espera} onChange={e => setEspera(e.target.value)} /></div>
        </div>
        <button
          onClick={handleSave}
          disabled={!cr}
          style={{ width: '100%', marginTop: 14, background: cr ? brand.gradientHeader : brand.gray300, color: brand.white, borderRadius: brand.radiusLg, border: 'none', cursor: cr ? 'pointer' : 'not-allowed', padding: '14px', fontSize: 13, fontWeight: 700, boxShadow: cr ? brand.shadowSm : brand.shadowNone }}
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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: brand.surfaceSubtle, position: 'relative' }}>
      {/* Header */}
      <div style={{ background: brand.gradientHeaderAccent, paddingBottom: 20, position: 'relative' }}>
        <StripeBar />
        <div style={{ padding: '10px 18px 0', position: 'relative' }}>
          <button onClick={() => onNavigate('sesion')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', padding: '4px 0', marginBottom: 8 }}>
            <IconBack size={16} color="rgba(255,255,255,0.6)" /> {sesion?.fecha ?? 'Sesión'}
          </button>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ margin: 0, color: brand.white, fontSize: 18, fontWeight: 800 }}>Camiones CR</h1>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>Registro de viajes del día</p>
            </div>
            <button onClick={() => setShowNew(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: brand.gradientCardAccent, color: brand.white, border: 'none', borderRadius: 20, padding: '7px 14px', fontWeight: 700, fontSize: 12, cursor: 'pointer', boxShadow: brand.shadowSm }}>
              <IconPlus size={13} color={brand.white} /> Registrar CR
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ margin: '12px 16px 0' }}>
        <div style={{ background: brand.surface, borderRadius: brand.radiusLg, boxShadow: brand.shadowMd, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', overflow: 'hidden' }}>
          {[
            { label: 'CRs', value: String(camiones.length), color: brand.navy },
            { label: 'm³ total', value: String(totalM3), color: brand.gray800 },
            { label: 'Último CR', value: camiones.length > 0 ? `CR ${camiones[camiones.length - 1].cr}` : '—', color: brand.red },
          ].map((s, i) => (
            <div key={s.label} style={{ padding: '12px 8px', textAlign: 'center', borderLeft: i > 0 ? `1px solid ${brand.borderLight}` : 'none' }}>
              <p style={{ margin: 0, fontSize: 10, color: brand.gray400, fontWeight: 600 }}>{s.label}</p>
              <p style={{ margin: '3px 0 0', fontSize: i === 1 ? 17 : 15, fontWeight: 800, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 8px' }}>
        <span style={{ ...brand.textLabel, color: brand.gray400, display: 'block', marginBottom: 8 }}>Secuencia</span>

        {camiones.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: brand.gray400 }}>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Sin camiones registrados</p>
            <p style={{ fontSize: 11, marginTop: 4 }}>Usa "Registrar CR" para agregar el primer viaje</p>
          </div>
        ) : (
          camiones.map((c, i) => {
            const isLast = i === camiones.length - 1
            return (
              <div key={c.id} style={{ background: brand.surface, borderRadius: brand.radiusLg, boxShadow: brand.shadowSm, marginBottom: 8, overflow: 'hidden', borderLeft: isLast ? `3px solid ${brand.red}` : `3px solid transparent` }}>
                <button
                  onClick={() => setEditingCamion(c)}
                  style={{ width: '100%', padding: '12px 14px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 9, background: brand.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', color: brand.white, fontSize: 12, fontWeight: 800, boxShadow: '0 2px 4px rgba(41,48,100,0.20)' }}>
                        {i + 1}
                      </div>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 800, color: brand.gray800 }}>CR {c.cr}</span>
                        <span style={{ fontSize: 11, color: brand.gray400, marginLeft: 8, fontVariantNumeric: 'tabular-nums' }}>{c.m3} m³</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {c.horaLlegada && <p style={{ margin: 0, fontSize: 11, color: brand.gray400 }}>{c.horaLlegada}{c.horaTermino ? ` → ${c.horaTermino}` : ''}</p>}
                      {c.rev && <p style={{ margin: '1px 0 0', fontSize: 11, fontWeight: 600, color: brand.gray500 }}>Rev {c.rev}</p>}
                    </div>
                  </div>
                  {(c.tempConcreto || c.esperaCliente) && (
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 8 }}>
                      {c.tempConcreto && <span style={{ fontSize: 10, background: '#FEF2F2', color: brand.red, padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>{c.tempConcreto}°C</span>}
                      {c.esperaCliente && <span style={{ fontSize: 10, background: brand.warningLight, color: brand.warningText, padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>Cliente: {c.esperaCliente}</span>}
                    </div>
                  )}
                </button>
                <div style={{ borderTop: `1px solid ${brand.borderLight}` }}>
                  <button
                    onClick={() => handleRemove(c.id, c.cr)}
                    style={{ width: '100%', padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer', color: brand.red, fontSize: 12, fontWeight: 700, textAlign: 'center' }}
                  >
                    Eliminar CR
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {showNew && <CamionModal onClose={() => setShowNew(false)} onSave={handleAdd} />}
      {editingCamion && <CamionModal initial={editingCamion} onClose={() => setEditingCamion(null)} onSave={handleUpdate} />}
    </div>
  )
}

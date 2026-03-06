import { useState } from 'react'
import { useAppStore } from '../context/AppContext'
import StripeBar from '../components/StripeBar'
import { brand } from '../brand'
import { IconBack, IconChevron, IconClipboard, IconTruck, IconMap, IconCamera, IconPdf, IconUsers } from '../components/Icons'
import SignaturePad from '../components/SignaturePad'

// Fallback si el proyecto no tiene equipo cargado aún
const EQUIPO_FALLBACK = [
  { nombre: 'Ing. Marcos Fuentes', rol: 'Coordinador CEMEX', iniciales: 'MF', color: '#293064', bg: '#EEF0FA' },
  { nombre: 'Patricia Olvera', rol: 'Supervisora de Calidad', iniciales: 'PO', color: '#DF343D', bg: '#FEF2F2' },
  { nombre: 'René Castellanos', rol: 'Residente de Obra', iniciales: 'RC', color: '#16A34A', bg: '#F0FDF4' },
]

const AVATAR_COLORS_SESION = [
  { color: '#293064', bg: '#EEF0FA' },
  { color: '#DF343D', bg: '#FEF2F2' },
  { color: '#16A34A', bg: '#F0FDF4' },
  { color: '#7C3AED', bg: '#F5F3FF' },
  { color: '#0284C7', bg: '#F0F9FF' },
]

interface Props {
  onNavigate: (screen: string) => void
}

const seccionesBase = [
  { icon: 'clipboard', color: brand.navy, bg: brand.navyLight, borderColor: brand.navy, title: 'Datos del Colado', sub: 'Producto, espesor, condiciones', screen: 'colado' },
  { icon: 'truck', color: brand.red, bg: '#FEF2F2', borderColor: brand.red, title: 'Camiones CR', sub: 'Registro de viajes del día', screen: 'camiones' },
  { icon: 'map', color: '#7C3AED', bg: '#F5F3FF', borderColor: '#7C3AED', title: 'Plano y Mapeo', sub: 'Zonas coladas · Mapeo del día', screen: 'plano' },
  { icon: 'camera', color: brand.info, bg: brand.infoLight, borderColor: brand.info, title: 'Reporte Fotográfico', sub: 'Fotos del proceso', screen: 'fotos' },
]

function SectionIcon({ name, color }: { name: string; color: string }) {
  if (name === 'clipboard') return <IconClipboard size={26} color={color} />
  if (name === 'truck') return <IconTruck size={26} color={color} />
  if (name === 'map') return <IconMap size={26} color={color} />
  return <IconCamera size={26} color={color} />
}

function statusBadgeStyle(estado?: string): React.CSSProperties {
  if (estado === 'Completado') return { background: brand.successLight, color: brand.successText, border: `1px solid rgba(22,163,74,0.25)` }
  if (estado === 'Pendiente') return { background: brand.warningLight, color: brand.warningText, border: `1px solid rgba(217,119,6,0.25)` }
  return { background: 'rgba(74,222,128,0.18)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.35)' }
}

type ModalStep = 'confirmar' | 'firma1' | 'firma2' | 'compartir' | null

export default function Sesion({ onNavigate }: Props) {
  const { sesiones, proyectos, activeSessionId, activeProyectoId, updateSesion } = useAppStore()
  const [modalStep, setModalStep] = useState<ModalStep>(null)
  const [firma1, setFirma1] = useState<string | null>(null)
  const [firma2, setFirma2] = useState<string | null>(null)
  const sesion = sesiones.find(s => s.id === activeSessionId)
  const proyecto = proyectos.find(p => p.id === activeProyectoId)

  const camiones = sesion?.camiones ?? []
  const totalM3Camiones = camiones.reduce((sum, c) => sum + c.m3, 0)
  const volumenReal = totalM3Camiones > 0 ? totalM3Camiones : (sesion?.volumenReal ?? 0)
  const volumenProgramado = sesion?.volumenProgramado ?? 0
  const pct = volumenProgramado > 0 ? Math.round((volumenReal / volumenProgramado) * 100) : 0
  const barPct = Math.min(pct, 100)
  const isOver = pct > 100

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: brand.surfaceSubtle }}>
      {/* Header */}
      <div style={{ background: brand.gradientHeaderAccent, paddingBottom: 20, position: 'relative' }}>
        <StripeBar />
        <div style={{ padding: '10px 18px 0', position: 'relative' }}>
          <button
            onClick={() => onNavigate('proyecto')}
            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', padding: '4px 0', marginBottom: 8 }}
          >
            <IconBack size={16} color="rgba(255,255,255,0.6)" /> {proyecto?.nombre ?? 'Proyecto'}
          </button>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ margin: 0, color: brand.white, fontSize: 18, fontWeight: 800 }}>Sesión del día</h1>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{sesion?.fecha ?? '—'}</p>
            </div>
            <span style={{ fontSize: 10, ...statusBadgeStyle(sesion?.estado), padding: '4px 12px', borderRadius: 20, fontWeight: 700, marginTop: 2 }}>
              {sesion?.estado?.toUpperCase() ?? 'EN CURSO'}
            </span>
          </div>
        </div>
      </div>

      {/* Volume card — overlaps header */}
      <div style={{ margin: '12px 16px 0' }}>
        <div style={{ background: brand.surface, borderRadius: brand.radiusLg, boxShadow: brand.shadowLg, padding: '14px 16px', borderLeft: `3px solid ${brand.red}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: brand.gray500, fontWeight: 600 }}>Volumen del día</span>
            <span style={{ fontSize: 12, color: brand.gray400, fontVariantNumeric: 'tabular-nums' }}>{volumenReal} / {volumenProgramado} m³</span>
          </div>
          <div style={{ background: brand.surfaceSubtle, borderRadius: brand.radiusFull, height: 8, overflow: 'hidden' }}>
            <div style={{ width: `${barPct}%`, height: '100%', background: isOver ? brand.red : brand.gradientProgress, borderRadius: brand.radiusFull, transition: 'width 0.3s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 11, color: brand.gray400 }}>Programado: {volumenProgramado} m³</span>
            <span style={{ fontSize: 11, color: isOver ? brand.red : brand.success, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{pct}%{isOver ? ' ▲' : ''}</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 8px' }}>
        <span style={{ ...brand.textLabel, color: brand.gray400, display: 'block', marginBottom: 10 }}>Secciones</span>

        {seccionesBase.map((s) => {
          const fotos = sesion?.fotos ?? []
          const muestras = sesion?.muestras ?? []
          let badge = 'Ver'
          if (s.screen === 'camiones' && camiones.length > 0) badge = `${camiones.length} CR${camiones.length !== 1 ? 's' : ''}`
          else if (s.screen === 'fotos' && fotos.length > 0) badge = `${fotos.length}`
          else if (s.screen === 'plano' && muestras.length > 0) badge = `${muestras.length}`

          return (
            <button
              key={s.screen}
              onClick={() => onNavigate(s.screen)}
              style={{
                width: '100%', background: brand.surface, borderRadius: brand.radiusLg, border: 'none',
                cursor: 'pointer', padding: '13px 14px 13px 11px',
                boxShadow: brand.shadowSm, marginBottom: 8, textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 12,
                borderLeft: `3px solid ${s.borderColor}`,
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: brand.shadowXs }}>
                <SectionIcon name={s.icon} color={s.color} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: brand.gray800 }}>{s.title}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: brand.gray400 }}>{s.sub}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <span style={{ fontSize: 10, background: s.bg, color: s.color, padding: '2px 10px', borderRadius: 20, fontWeight: 700, minWidth: 36, textAlign: 'center' }}>{badge}</span>
                <IconChevron size={14} color={brand.gray300} />
              </div>
            </button>
          )
        })}

        {sesion?.estado === 'Completado' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            {/* Fila: Ver reporte + Compartir */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                style={{ flex: 1, background: brand.navyLight, color: brand.navy, borderRadius: brand.radiusLg, border: 'none', cursor: 'pointer', padding: '13px 8px', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <IconPdf size={15} color={brand.navy} /> Ver reporte
              </button>
              <button
                onClick={() => setModalStep('compartir')}
                style={{ flex: 1, background: brand.gradientHeader, color: brand.white, borderRadius: brand.radiusLg, border: 'none', cursor: 'pointer', padding: '13px 8px', fontWeight: 700, fontSize: 12, boxShadow: brand.shadowSm, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <IconUsers size={15} color={brand.white} /> Compartir
              </button>
            </div>
            {/* Re-abrir */}
            <button
              onClick={() => {
                if (activeSessionId) updateSesion(activeSessionId, { estado: 'En curso' })
              }}
              style={{ width: '100%', background: 'none', color: brand.gray400, borderRadius: brand.radiusLg, border: `1.5px solid ${brand.borderLight}`, cursor: 'pointer', padding: '11px', fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              Re-abrir sesión
            </button>
          </div>
        ) : (
          <button
            onClick={() => setModalStep('confirmar')}
            style={{
              width: '100%', background: brand.gradientHeader, color: brand.white,
              borderRadius: brand.radiusLg, border: 'none', cursor: 'pointer', padding: '14px',
              marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontWeight: 700, fontSize: 13, boxShadow: brand.shadowSm, letterSpacing: 0.3,
            }}
          >
            <IconPdf size={18} color={brand.white} /> Generar Reporte PDF
          </button>
        )}

        {/* Spacer para que el botón no quede pegado al bottom */}
        <div style={{ height: 24 }} />
      </div>

      {/* ── Modal: Confirmar ── */}
      {modalStep === 'confirmar' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: brand.surface, borderRadius: `${brand.radius2xl}px ${brand.radius2xl}px 0 0`, padding: '24px 20px 36px', boxShadow: '0 -8px 32px rgba(41,48,100,0.14)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ width: 4, height: 22, background: brand.red, borderRadius: 2 }} />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: brand.gray800 }}>Cerrar sesión del día</h3>
              </div>
              <button onClick={() => setModalStep(null)} style={{ background: brand.surfaceSubtle, border: 'none', borderRadius: 20, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: brand.gray500 }}>×</button>
            </div>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: brand.gray500, paddingLeft: 12 }}>
              {sesion?.fecha} · {volumenReal} m³ colados · {camiones.length} CR{camiones.length !== 1 ? 's' : ''}
            </p>
            <div style={{ background: brand.surfaceMuted, borderRadius: brand.radiusMd, padding: '14px', marginBottom: 20, border: `1px solid ${brand.borderLight}` }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: brand.gray700 }}>Al cerrar la sesión:</p>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: brand.gray500, lineHeight: 1.8 }}>
                <li>Se registra como <strong style={{ color: brand.successText }}>Completado</strong></li>
                <li>El volumen real queda fijo ({volumenReal} m³)</li>
                <li>Se solicitarán 2 firmas de conformidad</li>
              </ul>
            </div>
            <button
              onClick={() => { setFirma1(null); setFirma2(null); setModalStep('firma1') }}
              style={{ width: '100%', background: brand.gradientHeader, color: brand.white, border: 'none', borderRadius: brand.radiusLg, padding: '14px', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: brand.shadowSm, marginBottom: 10 }}
            >
              Confirmar y firmar
            </button>
            <button onClick={() => setModalStep(null)} style={{ width: '100%', background: 'none', color: brand.gray500, border: 'none', borderRadius: brand.radiusLg, padding: '10px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ── Modal: Firma 1 ── */}
      {modalStep === 'firma1' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: brand.surface, borderRadius: `${brand.radius2xl}px ${brand.radius2xl}px 0 0`, padding: '24px 20px 36px', boxShadow: '0 -8px 32px rgba(41,48,100,0.14)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ width: 4, height: 22, background: brand.navy, borderRadius: 2 }} />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: brand.gray800 }}>Firma de conformidad</h3>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: brand.gray400, fontWeight: 600 }}>1 de 2</span>
                <button onClick={() => setModalStep(null)} style={{ background: brand.surfaceSubtle, border: 'none', borderRadius: 20, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: brand.gray500 }}>×</button>
              </div>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: 12, color: brand.gray400, paddingLeft: 12 }}>Residente de obra / Supervisor</p>
            <SignaturePad
              label="Firma 1 — Residente / Supervisor"
              signed={firma1 !== null}
              onSign={(data) => setFirma1(data)}
              onClear={() => setFirma1(null)}
            />
            <button
              onClick={() => setModalStep('firma2')}
              disabled={!firma1}
              style={{ width: '100%', marginTop: 20, background: firma1 ? brand.gradientHeader : brand.gray300, color: brand.white, border: 'none', borderRadius: brand.radiusLg, padding: '14px', fontWeight: 700, fontSize: 14, cursor: firma1 ? 'pointer' : 'not-allowed', boxShadow: firma1 ? brand.shadowSm : brand.shadowNone }}
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}

      {/* ── Modal: Compartir ── */}
      {modalStep === 'compartir' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: brand.surface, borderRadius: `${brand.radius2xl}px ${brand.radius2xl}px 0 0`, padding: '24px 20px 36px', boxShadow: '0 -8px 32px rgba(41,48,100,0.14)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ width: 4, height: 22, background: brand.navy, borderRadius: 2 }} />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: brand.gray800 }}>Compartir reporte</h3>
              </div>
              <button onClick={() => setModalStep(null)} style={{ background: brand.surfaceSubtle, border: 'none', borderRadius: 20, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: brand.gray500 }}>×</button>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: brand.gray500, paddingLeft: 12 }}>
              Selecciona a quién enviar el reporte de {sesion?.fecha}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {(proyecto?.equipo?.length ? proyecto.equipo : EQUIPO_FALLBACK).map((m, i) => {
                const ac = 'color' in m ? { color: m.color, bg: m.bg } : AVATAR_COLORS_SESION[i % AVATAR_COLORS_SESION.length]
                return (
                  <button
                    key={m.nombre}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, background: brand.surfaceMuted, borderRadius: brand.radiusMd, border: `1.5px solid ${brand.borderLight}`, padding: '12px 14px', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                    onClick={() => {
                      // placeholder — en producción dispararía WhatsApp/email
                      setModalStep(null)
                    }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: brand.radiusMd, background: ac.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: ac.color }}>{m.iniciales}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: brand.gray800 }}>{m.nombre}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: brand.gray400 }}>{m.rol}</p>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: brand.navy, background: brand.navyLight, padding: '4px 10px', borderRadius: 20 }}>Enviar</span>
                  </button>
                )
              })}
            </div>
            <button onClick={() => setModalStep(null)} style={{ width: '100%', background: 'none', color: brand.gray400, border: 'none', borderRadius: brand.radiusLg, padding: '10px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ── Modal: Firma 2 ── */}
      {modalStep === 'firma2' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: brand.surface, borderRadius: `${brand.radius2xl}px ${brand.radius2xl}px 0 0`, padding: '24px 20px 36px', boxShadow: '0 -8px 32px rgba(41,48,100,0.14)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ width: 4, height: 22, background: brand.navy, borderRadius: 2 }} />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: brand.gray800 }}>Firma de conformidad</h3>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: brand.gray400, fontWeight: 600 }}>2 de 2</span>
                <button onClick={() => setModalStep(null)} style={{ background: brand.surfaceSubtle, border: 'none', borderRadius: 20, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: brand.gray500 }}>×</button>
              </div>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: 12, color: brand.gray400, paddingLeft: 12 }}>Coordinador CEMEX</p>
            <SignaturePad
              label="Firma 2 — Coordinador CEMEX"
              signed={firma2 !== null}
              onSign={(data) => setFirma2(data)}
              onClear={() => setFirma2(null)}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setModalStep('firma1')}
                style={{ flex: 1, background: brand.surfaceSubtle, color: brand.gray600, border: 'none', borderRadius: brand.radiusLg, padding: '14px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
              >
                ← Atrás
              </button>
              <button
                onClick={() => {
                  if (activeSessionId) {
                    updateSesion(activeSessionId, { estado: 'Completado', volumenReal })
                  }
                  setModalStep(null)
                  onNavigate('proyecto')
                }}
                disabled={!firma2}
                style={{ flex: 2, background: firma2 ? brand.gradientHeader : brand.gray300, color: brand.white, border: 'none', borderRadius: brand.radiusLg, padding: '14px', fontWeight: 700, fontSize: 14, cursor: firma2 ? 'pointer' : 'not-allowed', boxShadow: firma2 ? brand.shadowSm : brand.shadowNone }}
              >
                Completar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

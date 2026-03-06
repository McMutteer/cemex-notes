import { useState } from 'react'
import { useAppStore } from '../context/AppContext'
import StripeBar from '../components/StripeBar'
import { IconBack, IconCalendar, IconChevron, IconPlus, IconUsers } from '../components/Icons'
import { brand } from '../brand'
import PinchZoom from '../components/PinchZoom'
import { zonasMapa } from '../data'
import type { Sesion } from '../types'

interface Props {
  onNavigate: (screen: string) => void
}

const CATALOGO_MI_EQUIPO = [
  { nombre: 'Ing. Marcos Fuentes', rol: 'Coordinador CEMEX', empresa: 'CEMEX' },
  { nombre: 'Patricia Olvera', rol: 'Supervisora de Calidad', empresa: 'CEMEX' },
  { nombre: 'Ing. Sofía Ramírez', rol: 'Coordinadora CEMEX', empresa: 'CEMEX' },
  { nombre: 'Alejandro Vidal', rol: 'Control de Calidad', empresa: 'CEMEX' },
  { nombre: 'Daniela Mora', rol: 'Supervisora CEMEX', empresa: 'CEMEX' },
  { nombre: 'Ing. Gustavo Herrera', rol: 'Coordinador CEMEX', empresa: 'CEMEX' },
  { nombre: 'Lorena Ibáñez', rol: 'Ingeniera de Proyecto', empresa: 'CEMEX' },
  { nombre: 'Héctor Sandoval', rol: 'Técnico de Laboratorio', empresa: 'CEMEX' },
]

const AVATAR_COLORS = [
  { color: brand.navy, bg: brand.navyLight },
  { color: brand.red, bg: '#FEF2F2' },
  { color: brand.success, bg: brand.successLight },
  { color: '#7C3AED', bg: '#F5F3FF' },
  { color: '#0284C7', bg: '#F0F9FF' },
]

function avatarColor(index: number, externo: boolean) {
  if (externo) return { color: brand.gray600, bg: brand.surfaceMuted }
  return AVATAR_COLORS[index % AVATAR_COLORS.length]
}

export default function Proyecto({ onNavigate }: Props) {
  const { proyectos, sesiones, activeProyectoId, setActiveSessionId, addSesion, addMiembroEquipo, removeMiembroEquipo } = useAppStore()
  const [activeTab, setActiveTab] = useState<'sesiones' | 'plano' | 'equipo'>('sesiones')
  const [showNuevaSesionModal, setShowNuevaSesionModal] = useState(false)
  const [volProgInput, setVolProgInput] = useState('')
  const [showAgregarMiembro, setShowAgregarMiembro] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [rolExterno, setRolExterno] = useState('')

  const todayISO = new Date().toISOString().split('T')[0]
  const [fechaInput, setFechaInput] = useState(todayISO)

  const proyecto = proyectos.find(p => p.id === activeProyectoId)
  const pSesiones = sesiones
    .filter(s => s.proyectoId === activeProyectoId)
    .sort((a, b) => b.fechaISO.localeCompare(a.fechaISO))

  const sesionM3Real = (s: Sesion) => {
    const fromCamiones = (s.camiones ?? []).reduce((sum, c) => sum + c.m3, 0)
    return fromCamiones > 0 ? fromCamiones : s.volumenReal
  }
  const volAcum = pSesiones.reduce((sum, s) => sum + sesionM3Real(s), 0)
  const volProgTotal = pSesiones.reduce((sum, s) => sum + s.volumenProgramado, 0)
  const avancePct = volProgTotal > 0 ? Math.round((volAcum / volProgTotal) * 100) : null

  const handleOpenSesion = (s: Sesion) => {
    setActiveSessionId(s.id)
    onNavigate('sesion')
  }

  const handleCrearSesion = () => {
    if (!activeProyectoId || !fechaInput || !volProgInput) return
    // Parse date parts manually to avoid UTC offset shifting the day
    const [year, month, day] = fechaInput.split('-').map(Number)
    const dateLocal = new Date(year, month - 1, day)
    const nuevaSesion: Sesion = {
      id: crypto.randomUUID(),
      proyectoId: activeProyectoId,
      fecha: dateLocal.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      fechaISO: fechaInput,
      volumenProgramado: Number(volProgInput),
      volumenReal: 0,
      estado: 'En curso',
      areaDefinida: null,
      markers: [],
      camiones: [],
      muestras: [],
      fotos: [],
    }
    addSesion(nuevaSesion)
    setActiveSessionId(nuevaSesion.id)
    setShowNuevaSesionModal(false)
    onNavigate('sesion')
  }

  if (!proyecto) return null

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: brand.surfaceSubtle, position: 'relative' }}>
      {/* Header */}
      <div style={{ background: brand.gradientHeaderAccent, paddingBottom: 20, position: 'relative' }}>
        <StripeBar />
        <div style={{ padding: '10px 18px 0', position: 'relative' }}>
          <button onClick={() => onNavigate('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', padding: '4px 0', marginBottom: 8 }}>
            <IconBack size={16} color="rgba(255,255,255,0.6)" /> Proyectos
          </button>
          <h1 style={{ margin: 0, color: brand.white, fontSize: 17, fontWeight: 800, lineHeight: 1.3 }}>{proyecto.nombre}</h1>
          <p style={{ margin: '3px 0 10px', fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{proyecto.cliente} · {proyecto.contratista}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.12)', borderRadius: 20, padding: '4px 12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <IconUsers size={12} color="rgba(255,255,255,0.7)" />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{proyecto.coordinador}</span>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ margin: '12px 16px 0' }}>
        <div style={{ background: brand.surface, borderRadius: brand.radiusLg, boxShadow: brand.shadowLg, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', overflow: 'hidden' }}>
          {[
            { label: 'Acumulado', value: `${volAcum.toLocaleString()} m³`, color: brand.gray800 },
            { label: 'Sesiones', value: String(pSesiones.length), color: brand.navy },
            { label: 'Avance', value: avancePct !== null ? `${avancePct}%` : '—', color: avancePct !== null && avancePct > 100 ? brand.red : brand.navy },
          ].map((s, i) => (
            <div key={s.label} style={{ padding: '12px 8px', textAlign: 'center', borderLeft: i > 0 ? `1px solid ${brand.borderLight}` : 'none' }}>
              <p style={{ margin: 0, fontSize: 10, color: brand.gray400, fontWeight: 600 }}>{s.label}</p>
              <p style={{ margin: '3px 0 0', fontSize: 14, fontWeight: 800, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', margin: '14px 16px 0', background: brand.gray200, borderRadius: brand.radiusMd, padding: 4 }}>
        {(['sesiones', 'plano', 'equipo'] as const).map((t) => {
          const label = t === 'sesiones' ? 'Sesiones' : t === 'plano' ? 'Plano' : 'Equipo'
          const isActive = activeTab === t
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{ flex: 1, padding: '8px 0', fontSize: 12, fontWeight: 700, borderRadius: 9, border: 'none', cursor: 'pointer', background: isActive ? brand.surface : 'transparent', color: isActive ? brand.navy : brand.gray400, boxShadow: isActive ? brand.shadowSm : brand.shadowNone }}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 8px' }}>

        {/* ── TAB: SESIONES ── */}
        {activeTab === 'sesiones' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ ...brand.textLabel, color: brand.gray400 }}>Historial</span>
              <button onClick={() => setShowNuevaSesionModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, background: brand.gradientHeader, color: brand.white, border: 'none', borderRadius: 20, padding: '6px 14px', fontWeight: 700, cursor: 'pointer', boxShadow: brand.shadowSm }}>
                <IconPlus size={12} color={brand.white} /> Nueva sesión
              </button>
            </div>

            {pSesiones.map((s, i) => (
              <button key={s.id} onClick={() => handleOpenSesion(s)} style={{ width: '100%', background: brand.surface, borderRadius: brand.radiusLg, border: 'none', cursor: 'pointer', padding: '12px 14px', boxShadow: brand.shadowSm, marginBottom: 8, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden', position: 'relative', borderLeft: i === 0 ? `3px solid ${brand.red}` : `3px solid transparent` }}>
                <div style={{ width: 38, height: 38, borderRadius: brand.radiusMd, background: i === 0 ? '#FEF2F2' : brand.navyLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IconCalendar size={18} color={i === 0 ? brand.red : brand.navy} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: brand.gray800 }}>{s.fecha}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: brand.gray400, fontVariantNumeric: 'tabular-nums' }}>{sesionM3Real(s)} m³ de {s.volumenProgramado} m³ programados</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span style={{ fontSize: 10, background: s.estado === 'Completado' ? brand.successLight : brand.warningLight, color: s.estado === 'Completado' ? brand.successText : brand.warningText, padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>{s.estado === 'Completado' ? 'OK' : s.estado}</span>
                  <IconChevron size={14} color={brand.gray300} />
                </div>
              </button>
            ))}

            {pSesiones.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px 0', color: brand.gray400 }}>
                <p style={{ fontSize: 13, fontWeight: 600 }}>Sin sesiones aún</p>
                <p style={{ fontSize: 11, marginTop: 4 }}>Crea la primera sesión del día</p>
              </div>
            )}
          </>
        )}

        {/* ── TAB: PLANO ── */}
        {activeTab === 'plano' && (() => {
          const areasDefinidas = pSesiones.filter(s => s.areaDefinida !== null)
          return (
            <>
              <span style={{ ...brand.textLabel, color: brand.gray400, display: 'block', marginBottom: 10 }}>Plano del proyecto</span>
              {proyecto.planoDataUrl ? (
                <>
                  {areasDefinidas.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, border: `2px solid ${brand.navy}`, background: 'rgba(41,48,100,0.15)' }} />
                      <span style={{ fontSize: 11, color: brand.gray500 }}>Áreas coladas ({areasDefinidas.length} sesión{areasDefinidas.length !== 1 ? 'es' : ''})</span>
                    </div>
                  )}
                  <div style={{ boxShadow: brand.shadowSm, borderRadius: brand.radiusMd, overflow: 'hidden' }}>
                    <PinchZoom>
                      <div style={{ position: 'relative' }}>
                        <img src={proyecto.planoDataUrl} alt="Plano" style={{ width: '100%', display: 'block' }} />
                        {areasDefinidas.map((s) => {
                          const nearTop = s.areaDefinida!.y < 5
                          return (
                            <div key={s.id} style={{ position: 'absolute', left: `${s.areaDefinida!.x}%`, top: `${s.areaDefinida!.y}%`, width: `${s.areaDefinida!.w}%`, height: `${s.areaDefinida!.h}%`, border: `2px solid ${brand.navy}`, background: 'rgba(41,48,100,0.15)', borderRadius: 4, pointerEvents: 'none' }}>
                              <span style={{ position: 'absolute', top: nearTop ? 4 : -18, left: 0, fontSize: 9, fontWeight: 700, color: brand.navy, background: 'rgba(255,255,255,0.92)', borderRadius: 4, padding: '1px 4px', whiteSpace: 'nowrap' }}>{s.fecha}</span>
                            </div>
                          )
                        })}
                      </div>
                    </PinchZoom>
                  </div>
                  {areasDefinidas.length === 0 && (
                    <p style={{ margin: '8px 0 0', fontSize: 12, color: brand.gray400, textAlign: 'center' }}>Aún no hay áreas definidas en ninguna sesión</p>
                  )}
                </>
              ) : (
                <>
                  <div style={{ background: brand.surface, borderRadius: brand.radiusLg, boxShadow: brand.shadowSm, overflow: 'hidden' }}>
                    <svg viewBox="0 0 100 100" style={{ width: '100%', aspectRatio: '1/1', display: 'block' }}>
                      <rect x="0" y="10" width="100" height="80" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.5" />
                      <rect x="2" y="3" width="15" height="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.5" />
                      <rect x="83" y="3" width="15" height="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.5" />
                      {zonasMapa.map((z) => (
                        <g key={z.id}>
                          <rect x={z.x} y={z.y} width={z.w} height={z.h} fill={z.color} fillOpacity="0.5" stroke={z.color} strokeWidth="0.4" />
                          {z.etiqueta.split('\n').map((line, li) => (
                            <text key={li} x={z.x + z.w / 2} y={z.y + z.h / 2 + (li - 0.3) * 3.5} textAnchor="middle" fontSize="2.2" fill="#166534" fontWeight="600">{line}</text>
                          ))}
                        </g>
                      ))}
                    </svg>
                  </div>
                  <p style={{ margin: '8px 0 0', fontSize: 11, color: brand.gray400, textAlign: 'center' }}>Sube el plano al crear el proyecto para verlo aquí</p>
                </>
              )}
            </>
          )
        })()}

        {/* ── TAB: EQUIPO ── */}
        {activeTab === 'equipo' && (
          <>
            <span style={{ ...brand.textLabel, color: brand.gray400, display: 'block', marginBottom: 10 }}>Miembros del equipo</span>
            {(proyecto?.equipo ?? []).map((m, i) => {
              const ac = avatarColor(i, m.externo)
              return (
                <div key={m.id} style={{ background: brand.surface, borderRadius: brand.radiusLg, padding: '14px', boxShadow: brand.shadowXs, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: brand.radiusMd, background: ac.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: ac.color }}>{m.iniciales}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: brand.gray800 }}>{m.nombre}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: brand.gray400 }}>{m.rol} {m.externo && <span style={{ color: brand.gray300 }}>· Externo</span>}</p>
                  </div>
                  <button
                    onClick={() => activeProyectoId && removeMiembroEquipo(activeProyectoId, m.id)}
                    style={{ background: brand.surfaceSubtle, border: 'none', borderRadius: 20, width: 28, height: 28, cursor: 'pointer', fontSize: 14, color: brand.gray400, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  >×</button>
                </div>
              )
            })}
            <button
              onClick={() => { setBusqueda(''); setRolExterno(''); setShowAgregarMiembro(true) }}
              style={{ width: '100%', background: brand.surfaceMuted, border: `1.5px dashed ${brand.border}`, borderRadius: brand.radiusLg, padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: brand.navy, fontWeight: 700, fontSize: 13, marginTop: 4 }}
            >
              <IconPlus size={16} color={brand.navy} /> Agregar miembro
            </button>
          </>
        )}

      </div>

      {/* Nueva sesión modal */}
      {showNuevaSesionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: brand.surface, borderRadius: `${brand.radius2xl}px ${brand.radius2xl}px 0 0`, padding: '24px 20px 32px', boxShadow: '0 -8px 32px rgba(41,48,100,0.14)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: brand.gray800 }}>Nueva Sesión</h3>
              <button onClick={() => setShowNuevaSesionModal(false)} style={{ background: brand.surfaceSubtle, border: 'none', borderRadius: 20, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: brand.gray500 }}>×</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: brand.gray400, textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>Fecha</label>
              <input
                type="date"
                className="cemex-input"
                value={fechaInput}
                onChange={e => setFechaInput(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: brand.radiusMd, border: `1.5px solid ${brand.border}`, fontSize: 14, color: brand.gray800, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: brand.gray400, textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>Volumen programado (m³) <span style={{ color: brand.red }}>*</span></label>
              <input
                type="number"
                className="cemex-input"
                value={volProgInput}
                onChange={e => setVolProgInput(e.target.value)}
                placeholder="ej. 167"
                style={{ width: '100%', padding: '10px 12px', borderRadius: brand.radiusMd, border: `1.5px solid ${brand.border}`, fontSize: 14, color: brand.gray800, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            </div>
            <button
              onClick={handleCrearSesion}
              disabled={!fechaInput || !volProgInput}
              style={{ width: '100%', background: (fechaInput && volProgInput) ? brand.gradientHeader : brand.gray300, color: brand.white, border: 'none', borderRadius: brand.radiusLg, padding: '14px', fontWeight: 700, fontSize: 14, cursor: (fechaInput && volProgInput) ? 'pointer' : 'not-allowed', boxShadow: (fechaInput && volProgInput) ? brand.shadowSm : brand.shadowNone }}
            >
              Crear sesión
            </button>
          </div>
        </div>
      )}

      {/* Agregar miembro sheet */}
      {showAgregarMiembro && activeProyectoId && (() => {
        const equipoActual = proyecto?.equipo ?? []
        const nombresActuales = equipoActual.map(m => m.nombre.toLowerCase())
        const catalogoFiltrado = CATALOGO_MI_EQUIPO.filter(m =>
          !nombresActuales.includes(m.nombre.toLowerCase()) &&
          (busqueda === '' || m.nombre.toLowerCase().includes(busqueda.toLowerCase()))
        )
        const busquedaTrimmed = busqueda.trim()
        const noCoincideCatalogo = busquedaTrimmed.length > 0 &&
          !CATALOGO_MI_EQUIPO.some(m => m.nombre.toLowerCase().includes(busquedaTrimmed.toLowerCase()))

        const handleAddCatalogo = (nombre: string, rol: string, empresa: string) => {
          const iniciales = nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
          addMiembroEquipo(activeProyectoId, { id: crypto.randomUUID(), nombre, rol, iniciales, empresa, externo: false })
          setShowAgregarMiembro(false)
        }

        const handleAddExterno = () => {
          if (!busquedaTrimmed) return
          const iniciales = busquedaTrimmed.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
          addMiembroEquipo(activeProyectoId, { id: crypto.randomUUID(), nombre: busquedaTrimmed, rol: rolExterno || 'Colaborador', iniciales, empresa: 'Externo', externo: true })
          setShowAgregarMiembro(false)
        }

        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ width: '100%', background: brand.surface, borderRadius: `${brand.radius2xl}px ${brand.radius2xl}px 0 0`, padding: '24px 20px 36px', boxShadow: '0 -8px 32px rgba(41,48,100,0.14)', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: brand.gray800 }}>Agregar miembro</h3>
                <button onClick={() => setShowAgregarMiembro(false)} style={{ background: brand.surfaceSubtle, border: 'none', borderRadius: 20, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: brand.gray500 }}>×</button>
              </div>

              {/* Buscador */}
              <input
                className="cemex-input"
                type="text"
                placeholder="Buscar persona..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: brand.radiusMd, border: `1.5px solid ${brand.border}`, fontSize: 14, color: brand.gray800, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', marginBottom: 16 }}
              />

              <div style={{ overflowY: 'auto', flex: 1 }}>
                {/* Mi Equipo */}
                {catalogoFiltrado.length > 0 && (
                  <>
                    <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 700, color: brand.gray400, textTransform: 'uppercase', letterSpacing: 0.8 }}>Mi Equipo</p>
                    {catalogoFiltrado.map((m) => (
                      <button
                        key={m.nombre}
                        onClick={() => handleAddCatalogo(m.nombre, m.rol, m.empresa)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, background: brand.surfaceMuted, borderRadius: brand.radiusMd, border: `1.5px solid ${brand.borderLight}`, padding: '12px 14px', cursor: 'pointer', textAlign: 'left', marginBottom: 8 }}
                      >
                        <div style={{ width: 40, height: 40, borderRadius: brand.radiusMd, background: brand.navyLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: brand.navy }}>{m.nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: brand.gray800 }}>{m.nombre}</p>
                          <p style={{ margin: '2px 0 0', fontSize: 11, color: brand.gray400 }}>{m.rol} · {m.empresa}</p>
                        </div>
                        <IconPlus size={16} color={brand.navy} />
                      </button>
                    ))}
                  </>
                )}

                {/* Externo */}
                {noCoincideCatalogo && (
                  <>
                    <p style={{ margin: '12px 0 8px', fontSize: 10, fontWeight: 700, color: brand.gray400, textTransform: 'uppercase', letterSpacing: 0.8 }}>Otros equipos</p>
                    <div style={{ background: brand.surfaceMuted, borderRadius: brand.radiusMd, border: `1.5px solid ${brand.borderLight}`, padding: '14px' }}>
                      <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: brand.gray800 }}>{busquedaTrimmed}</p>
                      <input
                        className="cemex-input"
                        type="text"
                        placeholder="Rol / puesto (ej. Supervisor)"
                        value={rolExterno}
                        onChange={e => setRolExterno(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: brand.radiusSm, border: `1.5px solid ${brand.border}`, fontSize: 13, color: brand.gray800, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', marginBottom: 10 }}
                      />
                      <button
                        onClick={handleAddExterno}
                        style={{ width: '100%', background: brand.gradientHeader, color: brand.white, border: 'none', borderRadius: brand.radiusMd, padding: '10px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                      >
                        Agregar {busquedaTrimmed}
                      </button>
                    </div>
                  </>
                )}

                {catalogoFiltrado.length === 0 && !noCoincideCatalogo && (
                  <p style={{ textAlign: 'center', color: brand.gray300, fontSize: 13, marginTop: 20 }}>
                    {busqueda ? 'Sin resultados' : 'Todos los miembros del catálogo ya están en el equipo'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

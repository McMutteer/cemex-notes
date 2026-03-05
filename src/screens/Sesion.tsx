import { useAppStore } from '../context/AppContext'
import StripeBar from '../components/StripeBar'
import { brand } from '../brand'
import { IconBack, IconChevron, IconClipboard, IconTruck, IconMap, IconCamera, IconPdf } from '../components/Icons'

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
  if (name === 'clipboard') return <IconClipboard size={20} color={color} />
  if (name === 'truck') return <IconTruck size={20} color={color} />
  if (name === 'map') return <IconMap size={20} color={color} />
  return <IconCamera size={20} color={color} />
}

function statusBadgeStyle(estado?: string): React.CSSProperties {
  if (estado === 'Completado') return { background: brand.successLight, color: brand.successText, border: `1px solid rgba(22,163,74,0.25)` }
  if (estado === 'Pendiente') return { background: brand.warningLight, color: brand.warningText, border: `1px solid rgba(217,119,6,0.25)` }
  return { background: 'rgba(74,222,128,0.18)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.35)' }
}

export default function Sesion({ onNavigate }: Props) {
  const { sesiones, proyectos, activeSessionId, activeProyectoId } = useAppStore()
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
      <div style={{ background: brand.gradientHeaderAccent, paddingBottom: 20, position: 'relative', overflow: 'hidden' }}>
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
      <div style={{ margin: '0 16px', marginTop: -16 }}>
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
              <div style={{ width: 42, height: 42, borderRadius: 13, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: brand.shadowXs }}>
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

        <button
          style={{
            width: '100%', background: brand.gradientHeader, color: brand.white,
            borderRadius: brand.radiusLg, border: 'none', cursor: 'pointer', padding: '14px',
            marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontWeight: 700, fontSize: 13, boxShadow: brand.shadowSm, letterSpacing: 0.3,
          }}
        >
          <IconPdf size={18} color={brand.white} /> Generar Reporte PDF
        </button>
      </div>
    </div>
  )
}

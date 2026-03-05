import { useAppStore } from '../context/AppContext'
import StripeBar from '../components/StripeBar'
import { IconBack, IconChevron, IconClipboard, IconTruck, IconMap, IconCamera, IconPdf } from '../components/Icons'

interface Props {
  onNavigate: (screen: string) => void
}

const seccionesBase = [
  { icon: 'clipboard', color: '#293064', bg: '#EEF0F8', title: 'Datos del Colado', sub: 'Producto, espesor, condiciones', screen: 'colado', badgeColor: '#EEF0F8', badgeText: '#293064' },
  { icon: 'truck', color: '#DF343D', bg: '#FEF2F2', title: 'Camiones CR', sub: 'Registro de viajes del día', screen: 'camiones', badgeColor: '#FEF2F2', badgeText: '#DF343D' },
  { icon: 'map', color: '#7C3AED', bg: '#F5F3FF', title: 'Plano y Mapeo', sub: 'Zonas coladas · Mapeo del día', screen: 'plano', badgeColor: '#F5F3FF', badgeText: '#7C3AED' },
  { icon: 'camera', color: '#0284C7', bg: '#F0F9FF', title: 'Reporte Fotográfico', sub: 'Fotos del proceso', screen: 'fotos', badgeColor: '#F0F9FF', badgeText: '#0284C7' },
]

function SectionIcon({ name, color }: { name: string; color: string }) {
  if (name === 'clipboard') return <IconClipboard size={20} color={color} />
  if (name === 'truck') return <IconTruck size={20} color={color} />
  if (name === 'map') return <IconMap size={20} color={color} />
  return <IconCamera size={20} color={color} />
}

export default function Sesion({ onNavigate }: Props) {
  const { sesiones, proyectos, activeSessionId, activeProyectoId } = useAppStore()
  const sesion = sesiones.find(s => s.id === activeSessionId)
  const proyecto = proyectos.find(p => p.id === activeProyectoId)

  const camiones = sesion?.camiones ?? []
  const totalM3Camiones = camiones.reduce((sum, c) => sum + c.m3, 0)
  const volumenReal = totalM3Camiones > 0 ? totalM3Camiones : (sesion?.volumenReal ?? 0)
  const volumenProgramado = sesion?.volumenProgramado ?? 0
  // Allow >100% — bar overflows in red to indicate excess
  const pct = volumenProgramado > 0 ? Math.round((volumenReal / volumenProgramado) * 100) : 0
  const barPct = Math.min(pct, 100)
  const isOver = pct > 100

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F1F3F5' }}>
      <div style={{ background: '#293064', paddingBottom: 20 }}>
        <StripeBar />
        <div style={{ padding: '10px 18px 0' }}>
          <button onClick={() => onNavigate('proyecto')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', padding: '4px 0', marginBottom: 8 }}>
            <IconBack size={16} color="rgba(255,255,255,0.6)" /> {proyecto?.nombre ?? 'Proyecto'}
          </button>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>Sesión del día</h1>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{sesion?.fecha ?? '—'}</p>
            </div>
            <span style={{ fontSize: 10, background: 'rgba(74,222,128,0.2)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.35)', padding: '4px 12px', borderRadius: 20, fontWeight: 700, marginTop: 2 }}>
              {sesion?.estado?.toUpperCase() ?? 'EN CURSO'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ margin: '0 16px', marginTop: -16 }}>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(41,48,100,0.1)', padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Volumen del día</span>
            <span style={{ fontSize: 12, color: '#94A3B8' }}>{volumenReal} / {volumenProgramado} m³</span>
          </div>
          <div style={{ background: '#F1F3F5', borderRadius: 999, height: 8, overflow: 'hidden' }}>
            <div style={{ width: `${barPct}%`, height: '100%', background: isOver ? '#DF343D' : 'linear-gradient(90deg, #293064, #DF343D)', borderRadius: 999 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 11, color: '#94A3B8' }}>Programado: {volumenProgramado} m³</span>
            <span style={{ fontSize: 11, color: isOver ? '#DF343D' : '#16A34A', fontWeight: 700 }}>{pct}%{isOver ? ' ▲' : ''}</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 8px' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 10 }}>Secciones</span>

        {seccionesBase.map((s) => {
          const badge = s.screen === 'camiones' && camiones.length > 0
            ? `${camiones.length} CR${camiones.length !== 1 ? 's' : ''}`
            : 'Ver'
          return (
            <button key={s.screen} onClick={() => onNavigate(s.screen)} style={{ width: '100%', background: '#fff', borderRadius: 16, border: 'none', cursor: 'pointer', padding: '14px', boxShadow: '0 1px 8px rgba(41,48,100,0.07)', marginBottom: 8, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <SectionIcon name={s.icon} color={s.color} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1E293B' }}>{s.title}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94A3B8' }}>{s.sub}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <span style={{ fontSize: 10, background: s.badgeColor, color: s.badgeText, padding: '2px 10px', borderRadius: 20, fontWeight: 700 }}>{badge}</span>
                <IconChevron size={14} color="#CBD5E1" />
              </div>
            </button>
          )
        })}

        <button style={{ width: '100%', background: '#293064', color: '#fff', borderRadius: 16, border: 'none', cursor: 'pointer', padding: '14px', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700, fontSize: 13 }}>
          <IconPdf size={18} color="#fff" /> Generar Reporte PDF
        </button>
      </div>
    </div>
  )
}

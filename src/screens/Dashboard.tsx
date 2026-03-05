import { useAppStore } from '../context/AppContext'
import CemexLogo from '../components/CemexLogo'
import StripeBar from '../components/StripeBar'
import { IconBuilding, IconChevron, IconPlus, IconWifi, IconWifiOff, IconBarChart, IconUser } from '../components/Icons'

interface Props {
  online: boolean
  onNavigate: (screen: string) => void
}

export default function Dashboard({ online, onNavigate }: Props) {
  const { proyectos, sesiones, setActiveProyectoId } = useAppStore()

  const handleOpenProyecto = (id: string) => {
    setActiveProyectoId(id)
    onNavigate('proyecto')
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F1F3F5' }}>
      <div style={{ background: '#293064', paddingBottom: 20 }}>
        <StripeBar />
        <div style={{ padding: '14px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <CemexLogo height={26} light />
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {online ? <IconWifi size={14} color="#4ade80" /> : <IconWifiOff size={14} color="#f87171" />}
              <span style={{ fontSize: 11, fontWeight: 600, color: online ? '#4ade80' : '#f87171' }}>
                {online ? 'Sincronizado' : 'Sin conexión'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
            <div style={{ width: 4, height: 24, background: '#DF343D', borderRadius: 2, flexShrink: 0 }} />
            <h1 style={{ margin: 0, color: '#fff', fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>Mis Proyectos</h1>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#DF343D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IconBuilding size={18} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Organización</p>
              <p style={{ margin: 0, fontSize: 13, color: '#fff', fontWeight: 700 }}>CEMEX México</p>
            </div>
            <span style={{ fontSize: 10, background: '#DF343D', color: '#fff', padding: '3px 10px', borderRadius: 20, fontWeight: 700, letterSpacing: 0.5, flexShrink: 0 }}>DIRECTOR</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8 }}>Activos</span>
          <button onClick={() => onNavigate('nuevo-proyecto')} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#DF343D', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <IconPlus size={13} color="#DF343D" /> Nuevo
          </button>
        </div>

        {[...proyectos].sort((a, b) => b.creadoEn.localeCompare(a.creadoEn)).map((p, i) => {
          const pSesiones = sesiones.filter(s => s.proyectoId === p.id)
          const sesionReal = (s: typeof pSesiones[0]) => {
            const fromCamiones = (s.camiones ?? []).reduce((sum, c) => sum + c.m3, 0)
            return fromCamiones > 0 ? fromCamiones : s.volumenReal
          }
          const volAcum = pSesiones.reduce((sum, s) => sum + sesionReal(s), 0)
          const volProg = pSesiones.reduce((sum, s) => sum + s.volumenProgramado, 0)
          const avancePct = volProg > 0 ? Math.round((volAcum / volProg) * 100) : null
          const ultimaVol = pSesiones[0] ? sesionReal(pSesiones[0]) : null
          const isFirst = i === 0

          return (
            <button key={p.id} onClick={() => handleOpenProyecto(p.id)} style={{ width: '100%', background: '#fff', borderRadius: 20, border: 'none', cursor: 'pointer', padding: 0, boxShadow: '0 2px 12px rgba(41,48,100,0.1)', marginBottom: 12, textAlign: 'left', overflow: 'hidden', display: 'block' }}>
              <div style={{ display: 'flex', height: 4 }}>
                <div style={{ flex: 1, background: isFirst ? '#DF343D' : '#94A3B8' }} />
                <div style={{ flex: 1, background: isFirst ? '#293064' : '#CBD5E1' }} />
              </div>
              <div style={{ padding: '14px 16px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 800, color: '#1E293B', fontSize: 14, lineHeight: 1.3 }}>{p.nombre}</p>
                    <p style={{ margin: '3px 0 0', fontSize: 11, color: '#94A3B8' }}>{p.cliente} · {p.contratista}</p>
                  </div>
                  <IconChevron size={18} color="#CBD5E1" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: pSesiones.length > 0 ? 12 : 0 }}>
                  {[
                    { label: 'Acumulado', value: `${volAcum.toLocaleString()} m³`, bg: '#F1F3F5', color: '#1E293B' },
                    { label: 'Última sesión', value: ultimaVol !== null ? `${ultimaVol} m³` : '—', bg: '#FEF2F2', color: '#DF343D' },
                    { label: 'Sesiones', value: String(pSesiones.length), bg: '#EEF0F8', color: '#293064' },
                  ].map((s) => (
                    <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '8px 4px', textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>{s.label}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, fontWeight: 800, color: s.color }}>{s.value}</p>
                    </div>
                  ))}
                </div>
                {pSesiones.length > 0 && avancePct !== null && (
                  <>
                    <div style={{ background: '#F1F3F5', borderRadius: 999, height: 6, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(avancePct, 100)}%`, height: '100%', background: avancePct > 100 ? '#DF343D' : 'linear-gradient(90deg, #293064, #DF343D)', borderRadius: 999 }} />
                    </div>
                    <p style={{ margin: '5px 0 0', fontSize: 10, color: '#94A3B8' }}>{avancePct}% completado · {pSesiones.some(s => s.estado === 'En curso') ? 'En curso' : 'Completado'}</p>
                  </>
                )}
                {pSesiones.length > 0 && avancePct === null && (
                  <p style={{ margin: '5px 0 0', fontSize: 10, color: '#94A3B8' }}>Sin volumen programado</p>
                )}
                {pSesiones.length === 0 && (
                  <span style={{ fontSize: 10, background: '#FEF3C7', color: '#D97706', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>EN ESPERA</span>
                )}
              </div>
            </button>
          )
        })}

        {proyectos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
            <p style={{ fontSize: 13, fontWeight: 600 }}>No hay proyectos aún</p>
            <p style={{ fontSize: 11, marginTop: 4 }}>Toca "Nuevo" para crear el primero</p>
          </div>
        )}
      </div>

      <div style={{ background: '#fff', borderTop: '1px solid #F1F3F5', display: 'flex', justifyContent: 'space-around', padding: '10px 0 4px', flexShrink: 0 }}>
        {[
          { icon: <IconBuilding size={22} color="#293064" />, label: 'Proyectos', active: true },
          { icon: <IconBarChart size={22} color="#94A3B8" />, label: 'Reportes', active: false },
          { icon: <IconUser size={22} color="#94A3B8" />, label: 'Perfil', active: false },
        ].map((item) => (
          <button key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer', padding: '0 16px' }}>
            {item.icon}
            <span style={{ fontSize: 10, fontWeight: 700, color: item.active ? '#293064' : '#94A3B8' }}>{item.label}</span>
            {item.active && <div style={{ width: 20, height: 3, background: '#DF343D', borderRadius: 2, marginTop: 1 }} />}
          </button>
        ))}
      </div>
    </div>
  )
}

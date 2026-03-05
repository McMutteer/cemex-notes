import { useAppStore } from '../context/AppContext'
import CemexLogo from '../components/CemexLogo'
import StripeBar from '../components/StripeBar'
import { brand } from '../brand'
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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: brand.surfaceSubtle }}>
      {/* Header */}
      <div style={{ background: brand.gradientHeaderAccent, paddingBottom: 20, position: 'relative', overflow: 'hidden' }}>
        {/* Radial glow accent */}
        <div style={{ position: 'absolute', top: -20, left: -20, right: -20, bottom: -20, background: 'radial-gradient(ellipse at 15% 60%, rgba(223,52,61,0.07) 0%, transparent 55%)', pointerEvents: 'none' }} />
        <StripeBar />
        <div style={{ padding: '14px 20px 0', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <CemexLogo height={26} light />
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.08)', borderRadius: brand.radiusFull, padding: '4px 10px 4px 8px' }}>
              {online ? <IconWifi size={13} color="#4ade80" /> : <IconWifiOff size={13} color="#f87171" />}
              <span style={{ fontSize: 11, fontWeight: 700, color: online ? '#4ade80' : '#f87171' }}>
                {online ? 'Sincronizado' : 'Sin conexión'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
            <div style={{ width: 4, height: 24, background: brand.red, borderRadius: 2, flexShrink: 0 }} />
            <h1 style={{ margin: 0, color: brand.white, fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>Mis Proyectos</h1>
          </div>
          {/* Organization card — glassmorphism */}
          <div style={{ background: brand.gradientOrgCard, borderRadius: 14, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, border: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: brand.gradientCardAccent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: brand.shadowSm }}>
              <IconBuilding size={18} color={brand.white} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Organización</p>
              <p style={{ margin: 0, fontSize: 13, color: brand.white, fontWeight: 700 }}>CEMEX México</p>
            </div>
            <span style={{ fontSize: 10, background: 'rgba(223,52,61,0.85)', color: brand.white, padding: '3px 10px', borderRadius: 20, fontWeight: 700, letterSpacing: 1.2, flexShrink: 0 }}>DIRECTOR</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ ...brand.textLabel, color: brand.gray400 }}>Activos</span>
          <button
            onClick={() => onNavigate('nuevo-proyecto')}
            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: brand.red, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <IconPlus size={13} color={brand.red} /> Nuevo
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
            <button
              key={p.id}
              onClick={() => handleOpenProyecto(p.id)}
              style={{ width: '100%', background: brand.surface, borderRadius: brand.radiusXl, border: `1px solid rgba(241,243,245,0.8)`, cursor: 'pointer', padding: 0, boxShadow: brand.shadowMd, marginBottom: 12, textAlign: 'left', overflow: 'hidden', display: 'block' }}
            >
              {/* Top stripe — gradient for active project */}
              <div style={{ height: 5, background: isFirst ? brand.gradientProgress : brand.gray300 }} />
              <div style={{ padding: '14px 16px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 800, color: brand.gray800, fontSize: 14, lineHeight: 1.3 }}>{p.nombre}</p>
                    <p style={{ margin: '3px 0 0', fontSize: 11, color: brand.gray400 }}>{p.cliente} · {p.contratista}</p>
                  </div>
                  <IconChevron size={18} color={brand.gray300} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: pSesiones.length > 0 ? 12 : 0 }}>
                  {[
                    { label: 'Acumulado', value: `${volAcum.toLocaleString()} m³`, bg: brand.surfaceSubtle, color: brand.gray800 },
                    { label: 'Última sesión', value: ultimaVol !== null ? `${ultimaVol} m³` : '—', bg: '#FEF2F2', color: brand.red },
                    { label: 'Sesiones', value: String(pSesiones.length), bg: brand.navyLight, color: brand.navy },
                  ].map((s) => (
                    <div key={s.label} style={{ background: s.bg, borderRadius: brand.radiusMd, padding: '8px 4px', textAlign: 'center', boxShadow: brand.shadowInset }}>
                      <p style={{ margin: 0, fontSize: 10, color: brand.gray400, fontWeight: 600 }}>{s.label}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, fontWeight: 800, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.value}</p>
                    </div>
                  ))}
                </div>
                {pSesiones.length > 0 && avancePct !== null && (
                  <>
                    <div style={{ background: brand.surfaceSubtle, borderRadius: brand.radiusFull, height: 8, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(avancePct, 100)}%`, height: '100%', background: avancePct > 100 ? brand.red : brand.gradientProgress, borderRadius: brand.radiusFull, transition: 'width 0.4s ease' }} />
                    </div>
                    <p style={{ margin: '5px 0 0', fontSize: 10, color: brand.gray400, fontVariantNumeric: 'tabular-nums' }}>{avancePct}% completado · {pSesiones.some(s => s.estado === 'En curso') ? 'En curso' : 'Completado'}</p>
                  </>
                )}
                {pSesiones.length > 0 && avancePct === null && (
                  <p style={{ margin: '5px 0 0', fontSize: 10, color: brand.gray400 }}>Sin volumen programado</p>
                )}
                {pSesiones.length === 0 && (
                  <span style={{ fontSize: 10, background: brand.warningLight, color: brand.warningText, padding: '3px 10px', borderRadius: brand.radiusFull, fontWeight: 700 }}>EN ESPERA</span>
                )}
              </div>
            </button>
          )
        })}

        {proyectos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: brand.gray400 }}>
            <p style={{ fontSize: 13, fontWeight: 600 }}>No hay proyectos aún</p>
            <p style={{ fontSize: 11, marginTop: 4 }}>Toca "Nuevo" para crear el primero</p>
          </div>
        )}
      </div>

      {/* Bottom tab bar */}
      <div style={{ background: brand.surface, borderTop: `1px solid ${brand.gray200}`, display: 'flex', justifyContent: 'space-around', padding: '10px 0 6px', flexShrink: 0 }}>
        {[
          { icon: <IconBuilding size={22} color={brand.navy} />, label: 'Proyectos', active: true },
          { icon: <IconBarChart size={22} color={brand.gray400} />, label: 'Reportes', active: false },
          { icon: <IconUser size={22} color={brand.gray400} />, label: 'Perfil', active: false },
        ].map((item) => (
          <button key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer', padding: '0 16px' }}>
            {item.icon}
            <span style={{ fontSize: 10, fontWeight: 700, color: item.active ? brand.navy : brand.gray400 }}>{item.label}</span>
            {item.active && <div style={{ width: 24, height: 3, background: brand.gradientCardAccent, borderRadius: 2, marginTop: 1 }} />}
          </button>
        ))}
      </div>
    </div>
  )
}

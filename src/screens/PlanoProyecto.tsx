import { useAppStore } from '../context/AppContext'
import StripeBar from '../components/StripeBar'
import { IconBack } from '../components/Icons'
import PinchZoom from '../components/PinchZoom'
import { zonasMapa } from '../data'

interface Props {
  onNavigate: (screen: string) => void
}

export default function PlanoProyecto({ onNavigate }: Props) {
  const { proyectos, sesiones, activeProyectoId } = useAppStore()

  const proyecto = proyectos.find(p => p.id === activeProyectoId)
  const pSesiones = sesiones.filter(s => s.proyectoId === activeProyectoId)
  const areasDefinidas = pSesiones.filter(s => s.areaDefinida !== null)
  const planoDataUrl = proyecto?.planoDataUrl ?? null

  if (!proyecto) return null

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F1F3F5' }}>
      <div style={{ background: '#293064', paddingBottom: 18 }}>
        <StripeBar />
        <div style={{ padding: '10px 18px 0' }}>
          <button
            onClick={() => onNavigate('proyecto')}
            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', padding: '4px 0', marginBottom: 8 }}
          >
            <IconBack size={16} color="rgba(255,255,255,0.6)" /> {proyecto.nombre}
          </button>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 4, height: 22, background: '#DF343D', borderRadius: 2, flexShrink: 0 }} />
            <h1 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>Plano del Proyecto</h1>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {areasDefinidas.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, border: '2px solid #293064', background: 'rgba(41,48,100,0.15)' }} />
            <span style={{ fontSize: 11, color: '#64748B' }}>Áreas coladas ({areasDefinidas.length} sesión{areasDefinidas.length !== 1 ? 'es' : ''})</span>
          </div>
        )}

        {planoDataUrl ? (
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 8px rgba(41,48,100,0.08)', overflow: 'hidden', position: 'relative' }}>
            <PinchZoom>
              <div style={{ position: 'relative' }}>
                <img src={planoDataUrl} alt="Plano" style={{ width: '100%', display: 'block' }} />
                {/* Overlay de áreas de todas las sesiones */}
                {areasDefinidas.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      position: 'absolute',
                      left: `${s.areaDefinida!.x}%`,
                      top: `${s.areaDefinida!.y}%`,
                      width: `${s.areaDefinida!.w}%`,
                      height: `${s.areaDefinida!.h}%`,
                      border: '2px solid #293064',
                      background: 'rgba(41,48,100,0.15)',
                      borderRadius: 4,
                      pointerEvents: 'none',
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      top: -18,
                      left: 0,
                      fontSize: 9,
                      fontWeight: 700,
                      color: '#293064',
                      background: '#fff',
                      borderRadius: 4,
                      padding: '1px 4px',
                      whiteSpace: 'nowrap',
                    }}>
                      {s.fecha}
                    </span>
                  </div>
                ))}
              </div>
            </PinchZoom>
          </div>
        ) : (
          <>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 8px rgba(41,48,100,0.08)', overflow: 'hidden' }}>
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
            <p style={{ margin: 0, fontSize: 11, color: '#94A3B8', textAlign: 'center' }}>
              Sube el plano al crear el proyecto para verlo aquí
            </p>
          </>
        )}

        {areasDefinidas.length === 0 && planoDataUrl && (
          <p style={{ margin: 0, fontSize: 12, color: '#94A3B8', textAlign: 'center' }}>
            Aún no hay áreas definidas en ninguna sesión
          </p>
        )}
      </div>
    </div>
  )
}

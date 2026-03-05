import StripeBar from '../components/StripeBar'
import { IconBack, IconCheck } from '../components/Icons'

interface Props {
  onNavigate: (screen: string) => void
}

const Field = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <label style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</label>
    <div style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', borderRadius: 12, padding: '10px 12px', fontSize: 13, color: '#1E293B', fontWeight: 600 }}>
      {value}
    </div>
  </div>
)

const Toggle = ({ label, value }: { label: string; value: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F1F3F5' }}>
    <span style={{ fontSize: 13, color: '#1E293B' }}>{label}</span>
    <div style={{ width: 22, height: 22, borderRadius: '50%', background: value ? '#16A34A' : '#E9ECEF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {value && <IconCheck size={12} color="#fff" />}
    </div>
  </div>
)

export default function DatosColado({ onNavigate }: Props) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F1F3F5' }}>
      <div style={{ background: '#293064', paddingBottom: 18 }}>
        <StripeBar />
        <div style={{ padding: '10px 18px 0' }}>
          <button onClick={() => onNavigate('sesion')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', padding: '4px 0', marginBottom: 8 }}>
            <IconBack size={16} color="rgba(255,255,255,0.6)" /> Sesión 25/Oct
          </button>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 4, height: 22, background: '#DF343D', borderRadius: 2, flexShrink: 0 }} />
            <h1 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>Datos del Colado</h1>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        <div style={{ background: '#fff', borderRadius: 16, padding: '14px 16px', boxShadow: '0 1px 8px rgba(41,48,100,0.07)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8 }}>Mezcla</p>
          <Field label="Producto" value="—" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Código" value="—" />
            <Field label="Frecuencia" value="—" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Espesor" value="—" />
            <Field label="Revenimiento" value="—" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Fibra" value="—" />
            <Field label="Acabado" value="—" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Volumen" value="—" />
            <Field label="Horario inicio" value="—" />
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: '14px 16px', boxShadow: '0 1px 8px rgba(41,48,100,0.07)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8 }}>Responsables</p>
          <Field label="Pisero" value="—" />
          <Field label="Laboratorio" value="—" />
          <Field label="Coordinador CEMEX" value="—" />
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: '14px 16px', boxShadow: '0 1px 8px rgba(41,48,100,0.07)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8 }}>Producción</p>
          <Field label="Planta óptima" value="—" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Cantidad CR" value="—" />
            <Field label="Tiempo ciclo" value="—" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Estadía en obra" value="—" />
            <Field label="Trayecto" value="—" />
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: '14px 16px', boxShadow: '0 1px 8px rgba(41,48,100,0.07)' }}>
          <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8 }}>Checklist obra</p>
          <Toggle label="Nave cerrada" value={false} />
          <Toggle label="Se utiliza láser" value={false} />
          <Toggle label="Regla vibratoria" value={false} />
          <Toggle label="Bump Cutter" value={false} />
          <Toggle label="Barrera de viento" value={false} />
          <Toggle label="Barrera de vapor" value={false} />
          <Toggle label="Se agrega fibra" value={false} />
          <Toggle label="Diamond Dowel" value={false} />
          <Toggle label="Pronóstico de lluvia" value={false} />
        </div>

        <button style={{ width: '100%', background: '#293064', color: '#fff', borderRadius: 16, border: 'none', cursor: 'pointer', padding: '14px', fontSize: 13, fontWeight: 700 }}>
          Guardar cambios
        </button>
      </div>
    </div>
  )
}

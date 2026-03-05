import { useState } from 'react'
import StripeBar from '../components/StripeBar'
import { IconBack, IconCheck } from '../components/Icons'
import { brand } from '../brand'
import { useAppStore } from '../context/AppContext'
import type { DatosColadoData } from '../types'

interface Props {
  onNavigate: (screen: string) => void
}

const TIPO_PRODUCTO_OPTIONS = ['Concreto Normal', 'Bombeado', 'Impermeabilizado', 'Con fibra', 'Autocompactante']
const FRECUENCIA_OPTIONS = ['Cada camión', 'Cada 10 min', 'Cada 15 min', 'Cada 20 min', 'Cada 30 min', 'Cada 60 min']
const TAM_AGREGADO_OPTIONS = ['3/8"', '1/2"', '3/4"', '1"']
const ADITIVOS_OPTIONS = ['Plastificante', 'Superplastificante', 'Retardante', 'Acelerante', 'Impermeabilizante', 'Microsílice']

const sectionCard: React.CSSProperties = {
  background: brand.surface,
  borderRadius: brand.radiusLg,
  padding: '14px 16px',
  boxShadow: brand.shadowMd,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
}

const sectionLabel: React.CSSProperties = {
  ...brand.textLabel,
  color: brand.gray400,
  margin: 0,
}

const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: brand.radiusMd,
  border: `1.5px solid ${brand.border}`,
  fontSize: 13,
  color: brand.gray800,
  background: brand.surface,
  fontFamily: 'inherit',
  fontWeight: 600,
  boxSizing: 'border-box' as const,
}

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  color: brand.gray400,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 0.6,
  marginBottom: 4,
  display: 'block',
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

export default function DatosColado({ onNavigate }: Props) {
  const { sesiones, activeSessionId, updateSesion } = useAppStore()
  const sesion = sesiones.find(s => s.id === activeSessionId)
  const existing = sesion?.datosColado

  const [tipoProducto, setTipoProducto] = useState(existing?.tipoProducto ?? '')
  const [fc, setFc] = useState(existing?.fc ?? '')
  const [fcUnit, setFcUnit] = useState<'kg/cm2' | 'MPa'>(existing?.fcUnit ?? 'kg/cm2')
  const [espesor, setEspesor] = useState(existing?.espesor ?? '')
  const [frecuenciaMuestreo, setFrecuenciaMuestreo] = useState(existing?.frecuenciaMuestreo ?? '')
  const [slump, setSlump] = useState(existing?.slump ?? '')
  const [tamMaxAgregado, setTamMaxAgregado] = useState(existing?.tamMaxAgregado ?? '')
  const [aditivos, setAditivos] = useState<string[]>(existing?.aditivos ?? [])
  const [pisero, setPisero] = useState(existing?.pisero ?? '')
  const [laboratorio, setLaboratorio] = useState(existing?.laboratorio ?? '')
  const [coordinadorCemex, setCoordinadorCemex] = useState(existing?.coordinadorCemex ?? '')
  const [plantaOptima, setPlantaOptima] = useState(existing?.plantaOptima ?? '')
  const [cantidadCR, setCantidadCR] = useState(existing?.cantidadCR ?? '')
  const [tiempoCiclo, setTiempoCiclo] = useState(existing?.tiempoCiclo ?? '')
  const [estadiaObra, setEstadiaObra] = useState(existing?.estadiaObra ?? '')
  const [trayecto, setTrayecto] = useState(existing?.trayecto ?? '')
  const [naveCerrada, setNaveCerrada] = useState(existing?.naveCerrada ?? false)
  const [usaLaser, setUsaLaser] = useState(existing?.usaLaser ?? false)
  const [reglaVibratoria, setReglaVibratoria] = useState(existing?.reglaVibratoria ?? false)
  const [bumpCutter, setBumpCutter] = useState(existing?.bumpCutter ?? false)
  const [barreraViento, setBarreraViento] = useState(existing?.barreraViento ?? false)
  const [barreraVapor, setBarreraVapor] = useState(existing?.barreraVapor ?? false)
  const [agregaFibra, setAgregaFibra] = useState(existing?.agregaFibra ?? false)
  const [diamondDowel, setDiamondDowel] = useState(existing?.diamondDowel ?? false)
  const [pronosticoLluvia, setPronosticoLluvia] = useState(existing?.pronosticoLluvia ?? false)
  const [notas, setNotas] = useState(existing?.notas ?? '')

  const toggleAditivo = (a: string) => {
    setAditivos(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])
  }

  const handleSave = () => {
    if (!activeSessionId) return
    const data: DatosColadoData = {
      tipoProducto, fc, fcUnit, espesor, frecuenciaMuestreo, slump, tamMaxAgregado,
      aditivos, pisero, laboratorio, coordinadorCemex, plantaOptima, cantidadCR,
      tiempoCiclo, estadiaObra, trayecto,
      naveCerrada, usaLaser, reglaVibratoria, bumpCutter, barreraViento, barreraVapor,
      agregaFibra, diamondDowel, pronosticoLluvia, notas,
    }
    updateSesion(activeSessionId, { datosColado: data })
    onNavigate('sesion')
  }

  const checklistItems: [string, boolean, (v: boolean) => void][] = [
    ['Nave cerrada', naveCerrada, setNaveCerrada],
    ['Se utiliza láser', usaLaser, setUsaLaser],
    ['Regla vibratoria', reglaVibratoria, setReglaVibratoria],
    ['Bump Cutter', bumpCutter, setBumpCutter],
    ['Barrera de viento', barreraViento, setBarreraViento],
    ['Barrera de vapor', barreraVapor, setBarreraVapor],
    ['Se agrega fibra', agregaFibra, setAgregaFibra],
    ['Diamond Dowel', diamondDowel, setDiamondDowel],
    ['Pronóstico de lluvia', pronosticoLluvia, setPronosticoLluvia],
  ]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: brand.surfaceSubtle }}>
      {/* Header */}
      <div style={{ background: brand.gradientHeaderAccent, paddingBottom: 18, position: 'relative', overflow: 'hidden' }}>
        <StripeBar />
        <div style={{ padding: '10px 18px 0', position: 'relative' }}>
          <button
            onClick={() => onNavigate('sesion')}
            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', padding: '4px 0', marginBottom: 8 }}
          >
            <IconBack size={16} color="rgba(255,255,255,0.6)" />
            {sesion?.fecha ?? 'Sesión'}
          </button>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 4, height: 22, background: brand.red, borderRadius: 2, flexShrink: 0 }} />
            <h1 style={{ margin: 0, color: brand.white, fontSize: 18, fontWeight: 800 }}>Datos del Colado</h1>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Sección 1 — Mezcla */}
        <div style={sectionCard}>
          <p style={sectionLabel}>Mezcla</p>

          <FieldGroup label="Tipo de producto">
            <select
              className="cemex-select"
              value={tipoProducto}
              onChange={e => setTipoProducto(e.target.value)}
              style={{ ...inputBase }}
            >
              <option value="">Seleccionar...</option>
              {TIPO_PRODUCTO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </FieldGroup>

          <FieldGroup label="Resistencia f'c">
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="cemex-input"
                type="text"
                value={fc}
                onChange={e => setFc(e.target.value)}
                placeholder="Ej. 300"
                style={{ ...inputBase, flex: 1 }}
              />
              <button
                onClick={() => setFcUnit(fcUnit === 'kg/cm2' ? 'MPa' : 'kg/cm2')}
                style={{ padding: '10px 12px', borderRadius: brand.radiusMd, border: `1.5px solid ${brand.navy}`, background: brand.navyLight, color: brand.navy, fontSize: 11, fontWeight: 700, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}
              >
                {fcUnit}
              </button>
            </div>
          </FieldGroup>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FieldGroup label="Espesor (cm)">
              <input className="cemex-input" type="text" value={espesor} onChange={e => setEspesor(e.target.value)} placeholder="Ej. 15" style={inputBase} />
            </FieldGroup>
            <FieldGroup label="Revenimiento (cm)">
              <input className="cemex-input" type="text" value={slump} onChange={e => setSlump(e.target.value)} placeholder="Ej. 12 ± 2.5" style={inputBase} />
            </FieldGroup>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FieldGroup label="Frec. muestreo">
              <select className="cemex-select" value={frecuenciaMuestreo} onChange={e => setFrecuenciaMuestreo(e.target.value)} style={{ ...inputBase }}>
                <option value="">Seleccionar...</option>
                {FRECUENCIA_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </FieldGroup>
            <FieldGroup label="Tam. máx. agregado">
              <select className="cemex-select" value={tamMaxAgregado} onChange={e => setTamMaxAgregado(e.target.value)} style={{ ...inputBase }}>
                <option value="">Seleccionar...</option>
                {TAM_AGREGADO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </FieldGroup>
          </div>
        </div>

        {/* Sección 2 — Aditivos */}
        <div style={sectionCard}>
          <p style={sectionLabel}>Aditivos</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ADITIVOS_OPTIONS.map(a => {
              const selected = aditivos.includes(a)
              return (
                <button
                  key={a}
                  onClick={() => toggleAditivo(a)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: brand.radiusFull,
                    border: `1.5px solid ${selected ? brand.navy : brand.border}`,
                    background: selected ? brand.navyLight : brand.surfaceMuted,
                    color: selected ? brand.navy : brand.gray400,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {selected && <IconCheck size={11} color={brand.navy} />}
                  {selected ? ' ' : ''}{a}
                </button>
              )
            })}
          </div>
        </div>

        {/* Sección 3 — Responsables */}
        <div style={sectionCard}>
          <p style={sectionLabel}>Responsables</p>
          <FieldGroup label="Pisero">
            <input className="cemex-input" type="text" value={pisero} onChange={e => setPisero(e.target.value)} placeholder="Nombre del pisero" style={inputBase} />
          </FieldGroup>
          <FieldGroup label="Laboratorio">
            <input className="cemex-input" type="text" value={laboratorio} onChange={e => setLaboratorio(e.target.value)} placeholder="Nombre del laboratorio" style={inputBase} />
          </FieldGroup>
          <FieldGroup label="Coordinador CEMEX">
            <input className="cemex-input" type="text" value={coordinadorCemex} onChange={e => setCoordinadorCemex(e.target.value)} placeholder="Nombre del coordinador" style={inputBase} />
          </FieldGroup>
        </div>

        {/* Sección 4 — Producción */}
        <div style={sectionCard}>
          <p style={sectionLabel}>Producción</p>
          <FieldGroup label="Planta óptima">
            <input className="cemex-input" type="text" value={plantaOptima} onChange={e => setPlantaOptima(e.target.value)} placeholder="Nombre de la planta" style={inputBase} />
          </FieldGroup>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FieldGroup label="Cantidad CR">
              <input className="cemex-input" type="text" value={cantidadCR} onChange={e => setCantidadCR(e.target.value)} placeholder="Ej. 12" style={inputBase} />
            </FieldGroup>
            <FieldGroup label="Tiempo ciclo (min)">
              <input className="cemex-input" type="text" value={tiempoCiclo} onChange={e => setTiempoCiclo(e.target.value)} placeholder="Ej. 45" style={inputBase} />
            </FieldGroup>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FieldGroup label="Estadía en obra">
              <input className="cemex-input" type="text" value={estadiaObra} onChange={e => setEstadiaObra(e.target.value)} placeholder="min" style={inputBase} />
            </FieldGroup>
            <FieldGroup label="Trayecto">
              <input className="cemex-input" type="text" value={trayecto} onChange={e => setTrayecto(e.target.value)} placeholder="km" style={inputBase} />
            </FieldGroup>
          </div>
        </div>

        {/* Sección 5 — Checklist */}
        <div style={{ ...sectionCard, gap: 0 }}>
          <p style={{ ...sectionLabel, marginBottom: 6 }}>Checklist obra</p>
          {checklistItems.map(([label, value, setter]) => (
            <button
              key={label}
              onClick={() => setter(!value)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '11px 0', borderBottom: `1px solid ${brand.borderLight}`,
                background: 'none', border: 'none', borderRadius: 0,
                borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: brand.borderLight,
                cursor: 'pointer', width: '100%', textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 13, color: brand.gray800, fontWeight: value ? 700 : 500 }}>{label}</span>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                background: value ? brand.success : brand.gray200,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
              }}>
                {value && <IconCheck size={13} color={brand.white} />}
              </div>
            </button>
          ))}
        </div>

        {/* Sección 6 — Notas */}
        <div style={sectionCard}>
          <p style={sectionLabel}>Notas adicionales</p>
          <textarea
            className="cemex-input"
            value={notas}
            onChange={e => setNotas(e.target.value)}
            placeholder="Observaciones del colado..."
            rows={3}
            style={{ ...inputBase, resize: 'none', lineHeight: 1.5 }}
          />
        </div>

        <button
          onClick={handleSave}
          style={{
            width: '100%', background: brand.gradientHeader, color: brand.white,
            borderRadius: brand.radiusLg, border: 'none', cursor: 'pointer',
            padding: '14px', fontSize: 13, fontWeight: 700,
            boxShadow: brand.shadowSm, letterSpacing: 0.3,
          }}
        >
          Guardar cambios
        </button>
      </div>
    </div>
  )
}

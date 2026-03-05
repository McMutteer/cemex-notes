import { useState, useRef } from 'react'
import { useAppStore } from '../context/AppContext'
import StripeBar from '../components/StripeBar'
import { IconBack, IconCamera } from '../components/Icons'
import type { Proyecto } from '../types'

interface Props {
  onNavigate: (screen: string) => void
}

function compressImage(dataUrl: string, maxWidth = 800): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.src = dataUrl
  })
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: 12,
  border: '1.5px solid #E2E8F0',
  fontSize: 14,
  color: '#1E293B',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  background: '#fff',
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: '#94A3B8',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  display: 'block',
  marginBottom: 6,
}

export default function NuevoProyecto({ onNavigate }: Props) {
  const { addProyecto, setActiveProyectoId } = useAppStore()
  const [nombre, setNombre] = useState('')
  const [cliente, setCliente] = useState('')
  const [contratista, setContratista] = useState('')
  const [coordinador, setCoordinador] = useState('')
  const [planoPreview, setPlanoPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const raw = ev.target?.result as string
      const compressed = await compressImage(raw)
      setPlanoPreview(compressed)
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!nombre.trim()) return
    const nuevo: Proyecto = {
      id: crypto.randomUUID(),
      nombre: nombre.trim(),
      cliente: cliente.trim(),
      contratista: contratista.trim(),
      coordinador: coordinador.trim(),
      planoDataUrl: planoPreview,
      creadoEn: new Date().toISOString(),
    }
    addProyecto(nuevo)
    setActiveProyectoId(nuevo.id)
    onNavigate('proyecto')
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F1F3F5' }}>
      <div style={{ background: '#293064', paddingBottom: 20 }}>
        <StripeBar />
        <div style={{ padding: '10px 18px 0' }}>
          <button onClick={() => onNavigate('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', padding: '4px 0', marginBottom: 8 }}>
            <IconBack size={16} color="rgba(255,255,255,0.6)" /> Proyectos
          </button>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 4, height: 22, background: '#DF343D', borderRadius: 2, flexShrink: 0 }} />
            <h1 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>Nuevo Proyecto</h1>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 24px' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '18px 16px', boxShadow: '0 1px 8px rgba(41,48,100,0.07)', marginBottom: 12 }}>
          <p style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8 }}>Información general</p>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Nombre del proyecto *</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="ej. Nave Vesta 4 Aguascalientes" style={inputStyle} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Cliente</label>
            <input value={cliente} onChange={e => setCliente(e.target.value)} placeholder="ej. VYACY" style={inputStyle} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Contratista</label>
            <input value={contratista} onChange={e => setContratista(e.target.value)} placeholder="ej. COPACHISA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Coordinador CEMEX</label>
            <input value={coordinador} onChange={e => setCoordinador(e.target.value)} placeholder="ej. Ing. Luis Alberto Cortes" style={inputStyle} />
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: '18px 16px', boxShadow: '0 1px 8px rgba(41,48,100,0.07)', marginBottom: 16 }}>
          <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8 }}>Plano de la obra</p>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />

          {planoPreview ? (
            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 10 }}>
              <img src={planoPreview} alt="Plano" style={{ width: '100%', display: 'block', maxHeight: 200, objectFit: 'cover' }} />
              <button onClick={() => fileInputRef.current?.click()} style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none', borderRadius: 20, padding: '5px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                Cambiar
              </button>
            </div>
          ) : (
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading} style={{ width: '100%', border: '2px dashed #CBD5E1', borderRadius: 12, padding: '28px 0', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: '#94A3B8' }}>
              <IconCamera size={28} color="#CBD5E1" />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{uploading ? 'Procesando...' : 'Subir plano'}</span>
              <span style={{ fontSize: 11 }}>JPG, PNG · se comprimirá automáticamente</span>
            </button>
          )}
        </div>

        <button onClick={handleSubmit} disabled={!nombre.trim()} style={{ width: '100%', background: nombre.trim() ? '#293064' : '#CBD5E1', color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontWeight: 700, fontSize: 14, cursor: nombre.trim() ? 'pointer' : 'not-allowed', transition: 'background 0.15s' }}>
          Crear proyecto
        </button>
      </div>
    </div>
  )
}

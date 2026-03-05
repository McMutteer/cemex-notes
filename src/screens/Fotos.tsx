import { useState, useRef } from 'react'
import { useAppStore } from '../context/AppContext'
import StripeBar from '../components/StripeBar'
import { IconBack, IconCamera, IconUpload } from '../components/Icons'
import { brand } from '../brand'
import type { FotoEvidencia } from '../types'

interface Props {
  onNavigate: (screen: string) => void
}

interface FotoModalProps {
  foto?: FotoEvidencia
  onSave: (descripcion: string, imageDataUrl: string) => void
  onDelete?: () => void
  onClose: () => void
}

function FotoModal({ foto, onSave, onDelete, onClose }: FotoModalProps) {
  const [descripcion, setDescripcion] = useState(foto?.descripcion ?? '')
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(foto?.imageDataUrl ?? null)
  const fileRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => setImageDataUrl(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const canSave = descripcion.trim().length > 0 && imageDataUrl !== null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }} onClick={onClose}>
      <div style={{ width: '100%', background: brand.surface, borderRadius: `${brand.radius2xl}px ${brand.radius2xl}px 0 0`, padding: '20px 16px 32px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 -8px 32px rgba(41,48,100,0.14)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: brand.gray800 }}>{foto ? 'Editar foto' : 'Nueva foto'}</h3>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: brand.gray400 }}>Evidencia fotográfica del proceso</p>
          </div>
          <button onClick={onClose} style={{ background: brand.surfaceSubtle, border: 'none', borderRadius: 20, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: brand.gray500 }}>×</button>
        </div>

        {imageDataUrl ? (
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <img src={imageDataUrl} alt="" style={{ width: '100%', borderRadius: brand.radiusMd, maxHeight: 260, objectFit: 'cover', display: 'block' }} />
            <button
              onClick={() => setImageDataUrl(null)}
              style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', color: brand.white, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >×</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button
              onClick={() => fileRef.current?.click()}
              style={{ flex: 1, border: `1.5px dashed ${brand.border}`, borderRadius: brand.radiusMd, padding: '18px 0', background: brand.surfaceMuted, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
            >
              <IconUpload size={20} color={brand.gray400} />
              <span style={{ fontSize: 12, color: brand.gray500, fontWeight: 600 }}>Galería</span>
            </button>
            <button
              onClick={() => cameraRef.current?.click()}
              style={{ flex: 1, border: `1.5px dashed ${brand.border}`, borderRadius: brand.radiusMd, padding: '18px 0', background: brand.surfaceMuted, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
            >
              <IconCamera size={20} color={brand.gray400} />
              <span style={{ fontSize: 12, color: brand.gray500, fontWeight: 600 }}>Cámara</span>
            </button>
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 10, fontWeight: 700, color: brand.gray400, textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>Descripción</label>
          <textarea
            className="cemex-input"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="Ej. Colado de losa nivel 3, zona norte..."
            rows={3}
            style={{ width: '100%', border: `1.5px solid ${brand.border}`, borderRadius: brand.radiusMd, padding: '10px 12px', fontSize: 13, color: brand.gray800, resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>

        <button
          onClick={() => { if (canSave) onSave(descripcion.trim(), imageDataUrl!) }}
          disabled={!canSave}
          style={{ width: '100%', background: canSave ? brand.gradientHeader : brand.gray300, color: brand.white, border: 'none', borderRadius: brand.radiusLg, padding: '14px', fontWeight: 700, fontSize: 14, cursor: canSave ? 'pointer' : 'not-allowed', marginBottom: onDelete ? 8 : 0, boxShadow: canSave ? brand.shadowSm : brand.shadowNone }}
        >
          {foto ? 'Guardar cambios' : 'Agregar foto'}
        </button>

        {onDelete && (
          <button
            onClick={onDelete}
            style={{ width: '100%', background: 'none', border: 'none', color: brand.red, fontWeight: 700, fontSize: 13, cursor: 'pointer', padding: '10px' }}
          >
            Eliminar foto
          </button>
        )}
      </div>
    </div>
  )
}

export default function Fotos({ onNavigate }: Props) {
  const { sesiones, activeSessionId, addFoto, updateFoto, removeFoto } = useAppStore()
  const sesion = sesiones.find(s => s.id === activeSessionId)
  const fotos = sesion?.fotos ?? []

  const [showNew, setShowNew] = useState(false)
  const [editingFoto, setEditingFoto] = useState<FotoEvidencia | null>(null)

  const handleAdd = (descripcion: string, imageDataUrl: string) => {
    if (!activeSessionId) return
    const foto: FotoEvidencia = {
      id: crypto.randomUUID(),
      descripcion,
      imageDataUrl,
      creadaEn: new Date().toISOString(),
    }
    addFoto(activeSessionId, foto)
    setShowNew(false)
  }

  const handleUpdate = (descripcion: string, imageDataUrl: string) => {
    if (!activeSessionId || !editingFoto) return
    updateFoto(activeSessionId, editingFoto.id, { descripcion, imageDataUrl })
    setEditingFoto(null)
  }

  const handleDelete = (id: string) => {
    if (!activeSessionId) return
    if (window.confirm('¿Eliminar esta foto? Esta acción no se puede deshacer.')) {
      removeFoto(activeSessionId, id)
      setEditingFoto(null)
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: brand.surfaceSubtle }}>
      {/* Header */}
      <div style={{ background: brand.gradientHeaderAccent, paddingBottom: 18, position: 'relative', overflow: 'hidden' }}>
        <StripeBar />
        <div style={{ padding: '10px 18px 0', position: 'relative' }}>
          <button onClick={() => onNavigate('sesion')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', padding: '4px 0', marginBottom: 8 }}>
            <IconBack size={16} color="rgba(255,255,255,0.6)" /> {sesion?.fecha ?? 'Sesión'}
          </button>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ margin: 0, color: brand.white, fontSize: 18, fontWeight: 800 }}>Reporte Fotográfico</h1>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{fotos.length} evidencia{fotos.length !== 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={() => setShowNew(true)}
              style={{ width: 36, height: 36, borderRadius: '50%', background: brand.gradientCardAccent, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: brand.shadowSm }}
            >
              <IconCamera size={16} color={brand.white} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ ...brand.textLabel, color: brand.gray400 }}>Evidencias</span>
          <button
            onClick={() => setShowNew(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: brand.red, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <IconCamera size={13} color={brand.red} /> Agregar foto
          </button>
        </div>

        {fotos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: brand.gray400 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: brand.infoLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <IconCamera size={26} color={brand.info} />
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: brand.gray700 }}>Sin fotos aún</p>
            <p style={{ fontSize: 11, marginTop: 4 }}>Agrega evidencias fotográficas del proceso</p>
          </div>
        )}

        {fotos.map(f => (
          <button
            key={f.id}
            onClick={() => setEditingFoto(f)}
            style={{ width: '100%', background: brand.surface, borderRadius: brand.radiusLg, border: 'none', cursor: 'pointer', padding: 0, boxShadow: brand.shadowSm, overflow: 'hidden', textAlign: 'left', display: 'block' }}
          >
            <img src={f.imageDataUrl} alt={f.descripcion} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: '10px 14px 12px', borderTop: `1px solid ${brand.borderLight}` }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: brand.gray800 }}>{f.descripcion}</p>
              <p style={{ margin: '3px 0 0', fontSize: 10, color: brand.gray400 }}>{new Date(f.creadaEn).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </button>
        ))}
      </div>

      {showNew && (
        <FotoModal
          onSave={handleAdd}
          onClose={() => setShowNew(false)}
        />
      )}
      {editingFoto && (
        <FotoModal
          foto={editingFoto}
          onSave={handleUpdate}
          onDelete={() => handleDelete(editingFoto.id)}
          onClose={() => setEditingFoto(null)}
        />
      )}
    </div>
  )
}

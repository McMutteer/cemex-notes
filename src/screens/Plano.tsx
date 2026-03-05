import { useState, useRef } from 'react'
import { useAppStore } from '../context/AppContext'
import { zonasMapa } from '../data'
import StripeBar from '../components/StripeBar'
import { IconBack } from '../components/Icons'
import DrawRectOverlay from '../components/DrawRectOverlay'
import MapeoOverlay from '../components/MapeoOverlay'
import CRPickerSheet from '../components/CRPickerSheet'
import type { AreaRect, Marker, Muestra } from '../types'

interface Props {
  onNavigate: (screen: string) => void
}

// ── Modal para agregar/ver foto de muestra ──────────────────────────────────
interface MuestraModalProps {
  muestra?: Muestra
  onSave: (etiqueta: string, imageDataUrl: string | null) => void
  onDelete?: () => void
  onClose: () => void
}

function MuestraModal({ muestra, onSave, onDelete, onClose }: MuestraModalProps) {
  const [etiqueta, setEtiqueta] = useState(muestra?.etiqueta ?? '')
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(muestra?.imageDataUrl ?? null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImageDataUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  const isNew = !muestra

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ width: '100%', background: '#fff', borderRadius: '24px 24px 0 0', padding: '20px 20px 32px', maxHeight: '88vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 4, height: 20, background: '#7C3AED', borderRadius: 2 }} />
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1E293B' }}>
              {isNew ? 'Nueva muestra' : 'Muestra'}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: '#F1F3F5', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontSize: 16, color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* Etiqueta */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', marginBottom: 4 }}>Etiqueta / referencia</label>
          <input
            style={{ width: '100%', background: '#F8F9FA', border: '1px solid #E9ECEF', borderRadius: 12, padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1E293B', boxSizing: 'border-box' }}
            placeholder="Ej. M-1, Zona norte..."
            value={etiqueta}
            onChange={e => setEtiqueta(e.target.value)}
          />
        </div>

        {/* Foto */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', marginBottom: 8 }}>Evidencia fotográfica</label>
          {imageDataUrl ? (
            <div style={{ position: 'relative' }}>
              <img src={imageDataUrl} alt="Muestra" style={{ width: '100%', borderRadius: 12, display: 'block', maxHeight: 220, objectFit: 'cover' }} />
              <button
                onClick={() => setImageDataUrl(null)}
                style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: 28, height: 28, color: '#fff', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >✕</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { if (fileRef.current) { fileRef.current.accept = 'image/*'; fileRef.current.capture = ''; fileRef.current.click() } }}
                style={{ flex: 1, border: '2px dashed #CBD5E1', borderRadius: 12, padding: '16px 8px', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: '#94A3B8', fontSize: 12, fontWeight: 600 }}
              >
                <span style={{ fontSize: 22 }}>🖼️</span>
                Galería
              </button>
              <button
                onClick={() => { if (fileRef.current) { fileRef.current.accept = 'image/*'; fileRef.current.capture = 'environment'; fileRef.current.click() } }}
                style={{ flex: 1, border: '2px dashed #CBD5E1', borderRadius: 12, padding: '16px 8px', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: '#94A3B8', fontSize: 12, fontWeight: 600 }}
              >
                <span style={{ fontSize: 22 }}>📷</span>
                Cámara
              </button>
              <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={handleFile} />
            </div>
          )}
        </div>

        <button
          onClick={() => { onSave(etiqueta, imageDataUrl); onClose() }}
          style={{ width: '100%', background: '#7C3AED', color: '#fff', borderRadius: 14, border: 'none', cursor: 'pointer', padding: '14px', fontSize: 13, fontWeight: 700, marginBottom: onDelete ? 8 : 0 }}
        >
          {isNew ? 'Guardar muestra' : 'Guardar cambios'}
        </button>

        {onDelete && (
          <button
            onClick={() => { onDelete(); onClose() }}
            style={{ width: '100%', background: 'none', color: '#DF343D', borderRadius: 14, border: 'none', cursor: 'pointer', padding: '10px', fontSize: 13, fontWeight: 700 }}
          >
            Eliminar muestra
          </button>
        )}
      </div>
    </div>
  )
}

// ── Overlay de taps sobre el plano completo para muestras ───────────────────
interface MuestrasOverlayProps {
  planoDataUrl: string
  muestras: Muestra[]
  onTap: (x: number, y: number) => void
  onPressMuestra: (id: string) => void
}

function MuestrasOverlay({ planoDataUrl, muestras, onTap, onPressMuestra }: MuestrasOverlayProps) {
  const downRef = useRef<{ x: number; y: number; t: number } | null>(null)

  return (
    <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(41,48,100,0.1)' }}>
      <img src={planoDataUrl} alt="Plano" draggable={false} style={{ width: '100%', display: 'block', userSelect: 'none', pointerEvents: 'none' }} />

      {/* Tap overlay */}
      <div
        style={{ position: 'absolute', inset: 0 }}
        onPointerDown={(e) => { downRef.current = { x: e.clientX, y: e.clientY, t: Date.now() } }}
        onPointerUp={(e) => {
          if (!downRef.current) return
          const dx = Math.abs(e.clientX - downRef.current.x)
          const dy = Math.abs(e.clientY - downRef.current.y)
          const dt = Date.now() - downRef.current.t
          if (dx < 8 && dy < 8 && dt < 400) {
            const rect = e.currentTarget.getBoundingClientRect()
            onTap((e.clientX - rect.left) / rect.width * 100, (e.clientY - rect.top) / rect.height * 100)
          }
          downRef.current = null
        }}
      />

      {/* Pines de muestras */}
      {muestras.map((m) => (
        <button
          key={m.id}
          onClick={(e) => { e.stopPropagation(); onPressMuestra(m.id) }}
          style={{
            position: 'absolute',
            left: `${m.x}%`,
            top: `${m.y}%`,
            transform: 'translate(-50%, -100%) rotate(-45deg)',
            width: 28,
            height: 28,
            borderRadius: '50% 50% 50% 0',
            background: '#7C3AED',
            border: '2px solid #fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            padding: 0,
          }}
        >
          <span style={{ transform: 'rotate(45deg)', color: '#fff', fontSize: 12, lineHeight: 1 }}>M</span>
        </button>
      ))}
    </div>
  )
}

// ── Pantalla principal ──────────────────────────────────────────────────────
export default function Plano({ onNavigate }: Props) {
  const { sesiones, proyectos, activeSessionId, activeProyectoId, setAreaDefinida, addMarker, removeMarker, addMuestra, updateMuestra, removeMuestra } = useAppStore()
  const [tab, setTab] = useState<'area' | 'mapeo' | 'muestras'>('area')
  const [pickerPending, setPickerPending] = useState<{ x: number; y: number } | null>(null)
  const [muestraPending, setMuestraPending] = useState<{ x: number; y: number } | null>(null)
  const [editingMuestra, setEditingMuestra] = useState<Muestra | null>(null)

  const sesion = sesiones.find(s => s.id === activeSessionId)
  const proyecto = proyectos.find(p => p.id === activeProyectoId)
  const planoDataUrl = proyecto?.planoDataUrl ?? null
  const activeArea = sesion?.areaDefinida ?? null
  const muestras = sesion?.muestras ?? []

  const handleConfirmArea = (rect: AreaRect) => {
    if (!activeSessionId) return
    setAreaDefinida(activeSessionId, rect)
  }

  const handleTap = (x: number, y: number) => {
    setPickerPending({ x, y })
  }

  const handlePickCR = (cr: string) => {
    if (!activeSessionId || !pickerPending) return
    const marker: Marker = { id: crypto.randomUUID(), cr, x: pickerPending.x, y: pickerPending.y }
    addMarker(activeSessionId, marker)
    setPickerPending(null)
  }

  const handleRemoveMarker = (markerId: string) => {
    if (!activeSessionId) return
    removeMarker(activeSessionId, markerId)
  }

  const handleMuestraTap = (x: number, y: number) => {
    setMuestraPending({ x, y })
  }

  const handleSaveMuestra = (etiqueta: string, imageDataUrl: string | null) => {
    if (!activeSessionId || !muestraPending) return
    const m: Muestra = {
      id: crypto.randomUUID(),
      x: muestraPending.x,
      y: muestraPending.y,
      etiqueta: etiqueta || `M-${muestras.length + 1}`,
      imageDataUrl,
      creadaEn: new Date().toISOString(),
    }
    addMuestra(activeSessionId, m)
    setMuestraPending(null)
  }

  const handleUpdateMuestra = (id: string, etiqueta: string, imageDataUrl: string | null) => {
    if (!activeSessionId) return
    updateMuestra(activeSessionId, id, { etiqueta, imageDataUrl })
    setEditingMuestra(null)
  }

  const handleDeleteMuestra = (id: string) => {
    if (!activeSessionId) return
    removeMuestra(activeSessionId, id)
    setEditingMuestra(null)
  }

  const camionesParaPicker = (sesion?.camiones ?? []).map(c => ({ id: c.id, cr: c.cr }))

  const tabs: Array<{ key: 'area' | 'mapeo' | 'muestras'; label: string }> = [
    { key: 'area', label: 'Área' },
    { key: 'mapeo', label: 'Mapeo' },
    { key: 'muestras', label: 'Muestras' },
  ]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F1F3F5' }}>
      <div style={{ background: '#293064', paddingBottom: 18 }}>
        <StripeBar />
        <div style={{ padding: '10px 18px 0' }}>
          <button onClick={() => onNavigate('sesion')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', padding: '4px 0', marginBottom: 8 }}>
            <IconBack size={16} color="rgba(255,255,255,0.6)" /> Sesión {sesion?.fecha ?? ''}
          </button>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 4, height: 22, background: '#DF343D', borderRadius: 2, flexShrink: 0 }} />
            <h1 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>Plano y Mapeo</h1>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', margin: '12px 16px 0', background: '#E9ECEF', borderRadius: 12, padding: 4 }}>
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ flex: 1, padding: '8px 0', fontSize: 12, fontWeight: 700, borderRadius: 9, border: 'none', cursor: 'pointer', background: tab === t.key ? '#fff' : 'transparent', color: tab === t.key ? '#1E293B' : '#94A3B8', boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 16px' }}>

        {/* ── TAB: ÁREA DE TRABAJO ── */}
        {tab === 'area' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {planoDataUrl ? (
              <>
                <p style={{ margin: 0, fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                  {activeArea ? 'Área actual marcada · Arrastra para redefinir' : 'Arrastra sobre el plano para definir el área del día'}
                </p>
                <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 8px rgba(41,48,100,0.08)' }}>
                  <img src={planoDataUrl} alt="Plano" draggable={false} style={{ width: '100%', display: 'block', userSelect: 'none' }} />
                  <DrawRectOverlay existingRect={activeArea} onConfirm={handleConfirmArea} />
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: '#4ade80', opacity: 0.7 }} />
                    <span style={{ fontSize: 11, color: '#64748B' }}>Colado</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: '#CBD5E1' }} />
                    <span style={{ fontSize: 11, color: '#64748B' }}>Pendiente</span>
                  </div>
                </div>
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
          </div>
        )}

        {/* ── TAB: MAPEO DEL DÍA ── */}
        {tab === 'mapeo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeArea && planoDataUrl ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ margin: 0, fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                    {(sesion?.markers?.length ?? 0) > 0
                      ? `${sesion!.markers.length} CR${sesion!.markers.length !== 1 ? 's' : ''} colocado${sesion!.markers.length !== 1 ? 's' : ''} · Toca para eliminar`
                      : 'Toca el plano para colocar un CR'}
                  </p>
                  <button onClick={() => setTab('area')} style={{ fontSize: 11, fontWeight: 700, color: '#293064', background: '#EEF0F8', border: 'none', borderRadius: 20, padding: '4px 10px', cursor: 'pointer' }}>
                    Editar área
                  </button>
                </div>
                <MapeoOverlay planoDataUrl={planoDataUrl} area={activeArea} markers={sesion?.markers ?? []} onTap={handleTap} onRemoveMarker={handleRemoveMarker} />
                {(sesion?.markers?.length ?? 0) > 0 && (
                  <div style={{ background: '#fff', borderRadius: 14, padding: '12px 14px', boxShadow: '0 1px 8px rgba(41,48,100,0.07)' }}>
                    <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>CRs registrados</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {sesion!.markers.map((m, i) => (
                        <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#EEF0F8', borderRadius: 20, padding: '4px 10px' }}>
                          <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#293064', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ color: '#fff', fontSize: 9, fontWeight: 800 }}>{i + 1}</span>
                          </div>
                          <span style={{ fontSize: 11, color: '#1E293B', fontWeight: 600 }}>CR {m.cr}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ background: '#FEF3C7', borderRadius: 14, padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ fontSize: 18 }}>📍</span>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#92400E' }}>
                    {!planoDataUrl ? 'Sin plano en este proyecto' : 'Área de trabajo no definida'}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: '#B45309' }}>
                    {!planoDataUrl ? 'El plano se sube al crear el proyecto. Ve a Dashboard → Nuevo Proyecto.' : 'Ve a "Área" y arrastra para definir la zona del día antes de mapear.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: MUESTRAS ── */}
        {tab === 'muestras' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {planoDataUrl ? (
              <>
                <p style={{ margin: 0, fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                  {muestras.length > 0
                    ? `${muestras.length} muestra${muestras.length !== 1 ? 's' : ''} registrada${muestras.length !== 1 ? 's' : ''} · Toca un pin para ver/editar`
                    : 'Toca el plano para registrar una muestra'}
                </p>

                <MuestrasOverlay
                  planoDataUrl={planoDataUrl}
                  muestras={muestras}
                  onTap={handleMuestraTap}
                  onPressMuestra={(id) => {
                    const m = muestras.find(m => m.id === id)
                    if (m) setEditingMuestra(m)
                  }}
                />

                {/* Lista de muestras */}
                {muestras.length > 0 && (
                  <div>
                    <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Muestras tomadas</p>
                    {muestras.map((m, i) => (
                      <button
                        key={m.id}
                        onClick={() => setEditingMuestra(m)}
                        style={{ width: '100%', background: '#fff', borderRadius: 14, padding: 0, boxShadow: '0 1px 8px rgba(41,48,100,0.07)', marginBottom: 8, border: 'none', cursor: 'pointer', textAlign: 'left', overflow: 'hidden', display: 'flex' }}
                      >
                        {/* Miniatura o placeholder */}
                        <div style={{ width: 72, height: 72, flexShrink: 0, background: m.imageDataUrl ? 'transparent' : '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {m.imageDataUrl
                            ? <img src={m.imageDataUrl} alt="Muestra" style={{ width: 72, height: 72, objectFit: 'cover', display: 'block' }} />
                            : <span style={{ fontSize: 24 }}>🔬</span>
                          }
                        </div>
                        <div style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 20, height: 20, borderRadius: 6, background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span style={{ color: '#fff', fontSize: 10, fontWeight: 800 }}>{i + 1}</span>
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>{m.etiqueta || `Muestra ${i + 1}`}</span>
                          </div>
                          <span style={{ fontSize: 10, color: '#94A3B8', marginTop: 3 }}>
                            {m.imageDataUrl ? 'Con foto · ' : 'Sin foto · '}
                            Pos {m.x.toFixed(0)}%, {m.y.toFixed(0)}%
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', paddingRight: 12 }}>
                          <span style={{ fontSize: 16, color: '#CBD5E1' }}>›</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{ background: '#F5F3FF', borderRadius: 14, padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ fontSize: 18 }}>🔬</span>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#5B21B6' }}>Sin plano en este proyecto</p>
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: '#7C3AED' }}>El plano se sube al crear el proyecto para poder marcar muestras.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CR picker para mapeo */}
      {pickerPending && camionesParaPicker.length > 0 && (
        <CRPickerSheet camiones={camionesParaPicker} onPick={handlePickCR} onClose={() => setPickerPending(null)} />
      )}
      {pickerPending && camionesParaPicker.length === 0 && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }} onClick={() => setPickerPending(null)}>
          <div style={{ width: '100%', background: '#fff', borderRadius: '24px 24px 0 0', padding: '24px 20px 36px' }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1E293B' }}>Sin camiones registrados</p>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: '#94A3B8' }}>Registra primero los CRs en "Camiones CR" antes de marcarlos en el plano.</p>
          </div>
        </div>
      )}

      {/* Modal nueva muestra */}
      {muestraPending && (
        <MuestraModal
          onSave={handleSaveMuestra}
          onClose={() => setMuestraPending(null)}
        />
      )}

      {/* Modal editar muestra */}
      {editingMuestra && (
        <MuestraModal
          muestra={editingMuestra}
          onSave={(etiqueta, imageDataUrl) => handleUpdateMuestra(editingMuestra.id, etiqueta, imageDataUrl)}
          onDelete={() => handleDeleteMuestra(editingMuestra.id)}
          onClose={() => setEditingMuestra(null)}
        />
      )}
    </div>
  )
}

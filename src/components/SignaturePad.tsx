import { useRef, useEffect, useState } from 'react'
import { brand } from '../brand'

interface Props {
  label: string
  onSign: (dataUrl: string) => void
  onClear: () => void
  signed: boolean
}

export default function SignaturePad({ label, onSign, onClear, signed }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [isEmpty, setIsEmpty] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // Set canvas resolution to match display size
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    ctx.strokeStyle = brand.navy
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawing.current = true
    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!drawing.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const pos = getPos(e)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    setIsEmpty(false)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    drawing.current = false
    const canvas = canvasRef.current
    if (!canvas || isEmpty) return
    onSign(canvas.toDataURL('image/png'))
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)
    setIsEmpty(true)
    onClear()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: brand.gray500, textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</span>
        {!isEmpty && (
          <button
            onClick={handleClear}
            style={{ fontSize: 11, color: brand.red, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: '2px 6px' }}
          >
            Limpiar
          </button>
        )}
      </div>
      <div style={{
        border: `1.5px dashed ${signed ? brand.success : brand.border}`,
        borderRadius: brand.radiusMd,
        background: signed ? brand.successLight : brand.surfaceMuted,
        overflow: 'hidden',
        position: 'relative',
        height: 130,
      }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none', cursor: 'crosshair' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
        {isEmpty && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ fontSize: 12, color: brand.gray300, fontWeight: 500 }}>Firma aquí</span>
          </div>
        )}
      </div>
      {/* Baseline */}
      <div style={{ borderTop: `1px solid ${brand.gray300}`, margin: '-4px 16px 0' }} />
    </div>
  )
}

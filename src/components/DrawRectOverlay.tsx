import { useState, useRef } from 'react'
import type { AreaRect } from '../types'

interface Props {
  onConfirm: (rect: AreaRect) => void
  onPending?: (rect: AreaRect | null) => void
  existingRect?: AreaRect | null
}

interface Point { x: number; y: number }

export default function DrawRectOverlay({ onConfirm, onPending, existingRect }: Props) {
  const [startPt, setStartPt] = useState<Point | null>(null)
  const [currentPt, setCurrentPt] = useState<Point | null>(null)
  const [committed, setCommitted] = useState<AreaRect | null>(null)
  const containerSizeRef = useRef<{ w: number; h: number } | null>(null)

  const getLiveRect = () => {
    if (!startPt || !currentPt) return null
    return {
      left: Math.min(startPt.x, currentPt.x),
      top: Math.min(startPt.y, currentPt.y),
      width: Math.abs(currentPt.x - startPt.x),
      height: Math.abs(currentPt.y - startPt.y),
    }
  }

  const liveRect = getLiveRect()

  const handleConfirm = () => {
    if (!committed) return
    onConfirm(committed)
    // Don't clear committed here — the component will unmount as the parent
    // switches to mapeo mode, so the rect stays visible until the transition
  }

  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        cursor: 'crosshair',
        touchAction: 'none',
        userSelect: 'none',
      }}
      onPointerDown={(e) => {
        e.preventDefault()
        e.currentTarget.setPointerCapture(e.pointerId)
        const rect = e.currentTarget.getBoundingClientRect()
        containerSizeRef.current = { w: rect.width, h: rect.height }
        setStartPt({ x: e.clientX - rect.left, y: e.clientY - rect.top })
        setCurrentPt(null)
        setCommitted(null)
        onPending?.(null)
      }}
      onPointerMove={(e) => {
        if (!startPt) return
        const rect = e.currentTarget.getBoundingClientRect()
        setCurrentPt({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      }}
      onPointerUp={(e) => {
        if (!startPt || !currentPt) { setStartPt(null); return }
        const cw = containerSizeRef.current?.w ?? e.currentTarget.getBoundingClientRect().width
        const ch = containerSizeRef.current?.h ?? e.currentTarget.getBoundingClientRect().height
        const x = Math.min(startPt.x, currentPt.x) / cw * 100
        const y = Math.min(startPt.y, currentPt.y) / ch * 100
        const w = Math.abs(currentPt.x - startPt.x) / cw * 100
        const h = Math.abs(currentPt.y - startPt.y) / ch * 100
        if (w > 2 && h > 2) {
          const rect: AreaRect = { x, y, w, h }
          setCommitted(rect)
          onPending?.(rect)
        }
        setStartPt(null)
        setCurrentPt(null)
      }}
    >
      {/* Existing area (dashed blue reference) */}
      {existingRect && !committed && (
        <div style={{
          position: 'absolute',
          left: `${existingRect.x}%`,
          top: `${existingRect.y}%`,
          width: `${existingRect.w}%`,
          height: `${existingRect.h}%`,
          border: '2px dashed #293064',
          borderRadius: 4,
          background: 'rgba(41,48,100,0.08)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Live drag preview */}
      {liveRect && (
        <div style={{
          position: 'absolute',
          left: liveRect.left,
          top: liveRect.top,
          width: liveRect.width,
          height: liveRect.height,
          border: '2px solid #DF343D',
          background: 'rgba(223,52,61,0.1)',
          borderRadius: 4,
          pointerEvents: 'none',
        }} />
      )}

      {/* Committed rect preview with confirm button inside overlay */}
      {committed && (
        <>
          <div style={{
            position: 'absolute',
            left: `${committed.x}%`,
            top: `${committed.y}%`,
            width: `${committed.w}%`,
            height: `${committed.h}%`,
            border: '2.5px solid #DF343D',
            background: 'rgba(223,52,61,0.12)',
            borderRadius: 4,
            pointerEvents: 'none',
          }}>
            <div style={{
              position: 'absolute',
              top: -22,
              left: 0,
              fontSize: 10,
              fontWeight: 700,
              color: '#DF343D',
              background: '#fff',
              borderRadius: 6,
              padding: '2px 6px',
              whiteSpace: 'nowrap',
            }}>Área seleccionada</div>
          </div>

          {/* Confirm button pinned to bottom of the image, inside the overlay */}
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleConfirm}
            style={{
              position: 'absolute',
              bottom: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#293064',
              color: '#fff',
              border: 'none',
              borderRadius: 14,
              padding: '11px 24px',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
              pointerEvents: 'auto',
            }}
          >
            Confirmar área del día →
          </button>
        </>
      )}
    </div>
  )
}

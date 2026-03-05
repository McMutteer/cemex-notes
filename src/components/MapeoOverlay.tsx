import { useRef, useState, useLayoutEffect } from 'react'
import type { AreaRect, Marker } from '../types'

interface Props {
  planoDataUrl: string
  area: AreaRect
  markers: Marker[]
  onTap: (x: number, y: number) => void
  onRemoveMarker: (id: string) => void
}

export default function MapeoOverlay({ planoDataUrl, area, markers, onTap, onRemoveMarker }: Props) {
  const downRef = useRef<{ x: number; y: number; t: number } | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [crop, setCrop] = useState<{ imgW: number; imgH: number; imgX: number; imgY: number; boxH: number } | null>(null)

  useLayoutEffect(() => {
    if (!planoDataUrl || !wrapperRef.current) return
    const boxW = wrapperRef.current.offsetWidth
    if (boxW === 0) return

    const img = new Image()
    img.onload = () => {
      const natW = img.naturalWidth
      const natH = img.naturalHeight

      // Scale so area fills full width of container
      const fullImgW = boxW / (area.w / 100)
      const fullImgH = fullImgW * (natH / natW)
      const areaRenderedH = (area.h / 100) * fullImgH

      // Cap height at 70% of viewport height
      const maxH = window.innerHeight * 0.7

      let imgW = fullImgW
      let imgH = fullImgH
      let boxH = areaRenderedH

      if (areaRenderedH > maxH) {
        const scale = maxH / areaRenderedH
        imgW = fullImgW * scale
        imgH = fullImgH * scale
        boxH = maxH
      }

      setCrop({
        imgW,
        imgH,
        imgX: -(area.x / 100) * imgW,
        imgY: -(area.y / 100) * imgH,
        boxH,
      })
    }
    img.src = planoDataUrl
    return () => { img.onload = null }
  }, [planoDataUrl, area.x, area.y, area.w, area.h])

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'relative',
        width: '100%',
        height: crop ? `${crop.boxH}px` : `${(area.h / area.w) * 100}%`,
        overflow: 'hidden',
        borderRadius: 14,
        background: '#E9ECEF',
        boxShadow: '0 2px 12px rgba(41,48,100,0.1)',
      }}
    >
      {crop && (
        <img
          src={planoDataUrl}
          alt="Plano"
          draggable={false}
          style={{
            position: 'absolute',
            width: `${crop.imgW}px`,
            height: `${crop.imgH}px`,
            maxWidth: 'none',
            left: `${crop.imgX}px`,
            top: `${crop.imgY}px`,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Tap overlay */}
      <div
        style={{ position: 'absolute', inset: 0, touchAction: 'pan-y' }}
        onPointerDown={(e) => {
          downRef.current = { x: e.clientX, y: e.clientY, t: Date.now() }
        }}
        onPointerUp={(e) => {
          if (!downRef.current) return
          const dx = Math.abs(e.clientX - downRef.current.x)
          const dy = Math.abs(e.clientY - downRef.current.y)
          const dt = Date.now() - downRef.current.t
          if (dx < 8 && dy < 8 && dt < 400) {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = (e.clientX - rect.left) / rect.width * 100
            const y = (e.clientY - rect.top) / rect.height * 100
            onTap(x, y)
          }
          downRef.current = null
        }}
      />

      {/* Markers */}
      {markers.map((marker) => (
        <button
          key={marker.id}
          onClick={(e) => {
            e.stopPropagation()
            onRemoveMarker(marker.id)
          }}
          style={{
            position: 'absolute',
            left: `${marker.x}%`,
            top: `${marker.y}%`,
            transform: 'translate(-50%, -100%) rotate(-45deg)',
            width: 28,
            height: 28,
            borderRadius: '50% 50% 50% 0',
            background: '#293064',
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
          <span style={{
            transform: 'rotate(45deg)',
            color: '#fff',
            fontSize: 9,
            fontWeight: 800,
            lineHeight: 1,
          }}>
            {marker.cr}
          </span>
        </button>
      ))}
    </div>
  )
}

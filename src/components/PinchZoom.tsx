import { useRef, useState, useCallback } from 'react'

interface Props {
  children: React.ReactNode
  minScale?: number
  maxScale?: number
}

interface PointerInfo {
  id: number
  x: number
  y: number
}

function dist(a: PointerInfo, b: PointerInfo) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function midpoint(a: PointerInfo, b: PointerInfo) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

export default function PinchZoom({ children, minScale = 1, maxScale = 6 }: Props) {
  const [scale, setScale] = useState(1)
  const [tx, setTx] = useState(0)
  const [ty, setTy] = useState(0)

  const stateRef = useRef({ scale: 1, tx: 0, ty: 0 })
  const pointersRef = useRef<Map<number, PointerInfo>>(new Map())
  const lastPinchRef = useRef<{ dist: number; mid: { x: number; y: number } } | null>(null)
  const lastPanRef = useRef<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const commit = useCallback((s: number, x: number, y: number) => {
    stateRef.current = { scale: s, tx: x, ty: y }
    setScale(s)
    setTx(x)
    setTy(y)
  }, [])

  const clampTranslate = (s: number, x: number, y: number) => {
    if (!containerRef.current) return { x, y }
    const cw = containerRef.current.clientWidth
    const ch = containerRef.current.clientHeight
    // content size after scale
    const contentW = cw * s
    const contentH = ch * s
    const maxX = Math.max(0, (contentW - cw) / 2)
    const maxY = Math.max(0, (contentH - ch) / 2)
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    pointersRef.current.set(e.pointerId, { id: e.pointerId, x: e.clientX, y: e.clientY })

    const pts = [...pointersRef.current.values()]
    if (pts.length === 2) {
      // Capture both pointers for pinch gesture
      e.currentTarget.setPointerCapture(e.pointerId)
      lastPinchRef.current = { dist: dist(pts[0], pts[1]), mid: midpoint(pts[0], pts[1]) }
      lastPanRef.current = null
    } else if (pts.length === 1) {
      lastPanRef.current = { x: e.clientX, y: e.clientY }
      lastPinchRef.current = null
      // Only capture for pan when already zoomed in — otherwise let taps reach children
      if (stateRef.current.scale > 1.05) {
        e.currentTarget.setPointerCapture(e.pointerId)
      }
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointersRef.current.has(e.pointerId)) return
    pointersRef.current.set(e.pointerId, { id: e.pointerId, x: e.clientX, y: e.clientY })

    const pts = [...pointersRef.current.values()]
    const { scale: cs, tx: cx, ty: cy } = stateRef.current

    if (pts.length === 2 && lastPinchRef.current) {
      const newDist = dist(pts[0], pts[1])
      const newMid = midpoint(pts[0], pts[1])
      const scaleFactor = newDist / lastPinchRef.current.dist
      let newScale = Math.min(maxScale, Math.max(minScale, cs * scaleFactor))

      // Pan from pinch midpoint delta
      const dx = newMid.x - lastPinchRef.current.mid.x
      const dy = newMid.y - lastPinchRef.current.mid.y
      const clamped = clampTranslate(newScale, cx + dx, cy + dy)

      commit(newScale, clamped.x, clamped.y)
      lastPinchRef.current = { dist: newDist, mid: newMid }
    } else if (pts.length === 1 && lastPanRef.current && cs > 1) {
      const dx = e.clientX - lastPanRef.current.x
      const dy = e.clientY - lastPanRef.current.y
      const clamped = clampTranslate(cs, cx + dx, cy + dy)
      commit(cs, clamped.x, clamped.y)
      lastPanRef.current = { x: e.clientX, y: e.clientY }
    }
  }

  const onPointerUp = (e: React.PointerEvent) => {
    pointersRef.current.delete(e.pointerId)
    const pts = [...pointersRef.current.values()]
    if (pts.length === 1) {
      lastPanRef.current = { x: pts[0].x, y: pts[0].y }
      lastPinchRef.current = null
    } else if (pts.length === 0) {
      lastPanRef.current = null
      lastPinchRef.current = null
      // Snap back to minScale if scale is very close to 1
      if (stateRef.current.scale < 1.05) {
        commit(1, 0, 0)
      }
    }
  }

  const onDoubleClick = () => {
    if (stateRef.current.scale > 1.2) {
      commit(1, 0, 0)
    } else {
      const newScale = 2.5
      commit(newScale, 0, 0)
    }
  }

  return (
    <div
      ref={containerRef}
      style={{ overflow: 'hidden', touchAction: 'none', userSelect: 'none', position: 'relative' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={onDoubleClick}
    >
      <div
        style={{
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: scale === 1 && tx === 0 && ty === 0 ? 'transform 0.2s ease' : undefined,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  )
}

import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { AppContextValue, AppState, Proyecto, Sesion, SessionId, AreaRect, Marker, ProjectId, CamionCR, Muestra, FotoEvidencia } from '../types'
import { proyecto as seedProyecto, sesionActual as seedSesion, camiones as seedCamiones } from '../data'

const STORAGE_KEY = 'cemex_app_state_v2'

function buildSeedState(): AppState {
  const p: Proyecto = {
    id: 'seed-proyecto-1',
    nombre: seedProyecto.nombre,
    cliente: seedProyecto.cliente,
    contratista: seedProyecto.contratista,
    coordinador: seedProyecto.coordinador,
    planoDataUrl: null,
    creadoEn: '2024-10-01T00:00:00.000Z',
  }
  const sesiones: Sesion[] = [
    { id: 's-25oct', proyectoId: p.id, fecha: '25/Oct/2024', fechaISO: '2024-10-25', volumenProgramado: 167, volumenReal: 161, estado: 'Completado', areaDefinida: null, markers: [], camiones: [], muestras: [], fotos: [] },
    { id: 's-24oct', proyectoId: p.id, fecha: '24/Oct/2024', fechaISO: '2024-10-24', volumenProgramado: 174, volumenReal: 174, estado: 'Completado', areaDefinida: null, markers: [], camiones: [], muestras: [], fotos: [] },
    { id: 's-23oct', proyectoId: p.id, fecha: '23/Oct/2024', fechaISO: '2024-10-23', volumenProgramado: 170, volumenReal: 166.5, estado: 'Completado', areaDefinida: null, markers: [], camiones: [], muestras: [], fotos: [] },
    { id: 's-22oct', proyectoId: p.id, fecha: '22/Oct/2024', fechaISO: '2024-10-22', volumenProgramado: 190, volumenReal: 189, estado: 'Completado', areaDefinida: null, markers: [], camiones: [], muestras: [], fotos: [] },
    { id: 's-21oct', proyectoId: p.id, fecha: '21/Oct/2024', fechaISO: '2024-10-21', volumenProgramado: 130, volumenReal: 124, estado: 'Completado', areaDefinida: null, markers: [], camiones: [], muestras: [], fotos: [] },
  ]
  // Suppress unused warning — seedSesion and seedCamiones are imported for future use
  void seedSesion
  void seedCamiones
  return { proyectos: [p], sesiones }
}

function loadFromStorage(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppState
      if (parsed.proyectos && parsed.sesiones) {
        // Migrate: ensure all sessions have camiones and muestras fields
        parsed.sesiones = parsed.sesiones.map(s => ({ camiones: [], muestras: [], fotos: [], ...s }))
        return parsed
      }
    }
  } catch {
    // ignore parse errors
  }
  return buildSeedState()
}

function saveToStorage(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded — changes not saved')
    }
  }
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [proyectos, setProyectos] = useState<Proyecto[]>(() => loadFromStorage().proyectos)
  const [sesiones, setSesiones] = useState<Sesion[]>(() => loadFromStorage().sesiones)
  const [activeProyectoId, setActiveProyectoId] = useState<ProjectId | null>(null)
  const [activeSessionId, setActiveSessionId] = useState<SessionId | null>(null)

  useEffect(() => {
    saveToStorage({ proyectos, sesiones })
  }, [proyectos, sesiones])

  const addProyecto = (p: Proyecto) => setProyectos(prev => [...prev, p])

  const addSesion = (s: Sesion) => setSesiones(prev => [...prev, s])

  const updateSesion = (id: SessionId, patch: Partial<Sesion>) =>
    setSesiones(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))

  const setAreaDefinida = (sesionId: SessionId, area: AreaRect) =>
    updateSesion(sesionId, { areaDefinida: area })

  const addMarker = (sesionId: SessionId, marker: Marker) =>
    setSesiones(prev =>
      prev.map(s => s.id === sesionId ? { ...s, markers: [...s.markers, marker] } : s)
    )

  const removeMarker = (sesionId: SessionId, markerId: string) =>
    setSesiones(prev =>
      prev.map(s =>
        s.id === sesionId ? { ...s, markers: s.markers.filter(m => m.id !== markerId) } : s
      )
    )

  const addCamion = (sesionId: SessionId, camion: CamionCR) =>
    setSesiones(prev =>
      prev.map(s => s.id === sesionId ? { ...s, camiones: [...(s.camiones ?? []), camion] } : s)
    )

  const updateCamion = (sesionId: SessionId, camionId: string, patch: Partial<CamionCR>) =>
    setSesiones(prev =>
      prev.map(s => s.id === sesionId
        ? { ...s, camiones: s.camiones.map(c => c.id === camionId ? { ...c, ...patch } : c) }
        : s
      )
    )

  const removeCamion = (sesionId: SessionId, camionId: string) =>
    setSesiones(prev =>
      prev.map(s => s.id === sesionId
        ? { ...s, camiones: s.camiones.filter(c => c.id !== camionId) }
        : s
      )
    )

  const addMuestra = (sesionId: SessionId, muestra: Muestra) =>
    setSesiones(prev =>
      prev.map(s => s.id === sesionId ? { ...s, muestras: [...(s.muestras ?? []), muestra] } : s)
    )

  const updateMuestra = (sesionId: SessionId, muestraId: string, patch: Partial<Muestra>) =>
    setSesiones(prev =>
      prev.map(s => s.id === sesionId
        ? { ...s, muestras: (s.muestras ?? []).map(m => m.id === muestraId ? { ...m, ...patch } : m) }
        : s
      )
    )

  const removeMuestra = (sesionId: SessionId, muestraId: string) =>
    setSesiones(prev =>
      prev.map(s => s.id === sesionId
        ? { ...s, muestras: (s.muestras ?? []).filter(m => m.id !== muestraId) }
        : s
      )
    )

  const addFoto = (sesionId: SessionId, foto: FotoEvidencia) =>
    setSesiones(prev =>
      prev.map(s => s.id === sesionId ? { ...s, fotos: [...(s.fotos ?? []), foto] } : s)
    )

  const updateFoto = (sesionId: SessionId, fotoId: string, patch: Partial<FotoEvidencia>) =>
    setSesiones(prev =>
      prev.map(s => s.id === sesionId
        ? { ...s, fotos: (s.fotos ?? []).map(f => f.id === fotoId ? { ...f, ...patch } : f) }
        : s
      )
    )

  const removeFoto = (sesionId: SessionId, fotoId: string) =>
    setSesiones(prev =>
      prev.map(s => s.id === sesionId
        ? { ...s, fotos: (s.fotos ?? []).filter(f => f.id !== fotoId) }
        : s
      )
    )

  return (
    <AppContext.Provider value={{
      proyectos, sesiones,
      addProyecto, addSesion, updateSesion, setAreaDefinida, addMarker, removeMarker, addCamion, updateCamion, removeCamion, addMuestra, updateMuestra, removeMuestra, addFoto, updateFoto, removeFoto,
      activeProyectoId, activeSessionId, setActiveProyectoId, setActiveSessionId,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppStore(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppStore must be used inside AppProvider')
  return ctx
}

import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { AppContextValue, AppState, Proyecto, Sesion, SessionId, AreaRect, Marker, ProjectId, CamionCR, Muestra, FotoEvidencia, MiembroEquipo } from '../types'
import { proyecto as seedProyecto, sesionActual as seedSesion, camiones as seedCamiones } from '../data'

const STORAGE_KEY = 'cemex_app_state_v5'

function buildSeedState(): AppState {
  const p1: Proyecto = {
    id: 'seed-proyecto-1',
    nombre: 'Bodega Industrial Zona Norte',
    cliente: 'DELNOR',
    contratista: 'GARZA & ASOCIADOS',
    coordinador: 'Ing. Marcos Fuentes',
    planoDataUrl: null,
    creadoEn: '2024-09-15T00:00:00.000Z',
    equipo: [
      { id: 'eq-1', nombre: 'Ing. Marcos Fuentes', rol: 'Coordinador CEMEX', iniciales: 'MF', empresa: 'CEMEX', externo: false },
      { id: 'eq-2', nombre: 'Patricia Olvera', rol: 'Supervisora de Calidad', iniciales: 'PO', empresa: 'CEMEX', externo: false },
      { id: 'eq-3', nombre: 'René Castellanos', rol: 'Residente de Obra', iniciales: 'RC', empresa: 'GARZA & ASOCIADOS', externo: true },
    ],
  }
  const p2: Proyecto = {
    id: 'seed-proyecto-2',
    nombre: 'Plaza Comercial Lomas II',
    cliente: 'INVERSORA LOMAS',
    contratista: 'EDIFICACIONES DEL NORTE',
    coordinador: 'Ing. Sofía Ramírez',
    planoDataUrl: null,
    creadoEn: '2024-08-01T00:00:00.000Z',
    equipo: [
      { id: 'eq-4', nombre: 'Ing. Sofía Ramírez', rol: 'Coordinadora CEMEX', iniciales: 'SR', empresa: 'CEMEX', externo: false },
      { id: 'eq-5', nombre: 'Alejandro Vidal', rol: 'Control de Calidad', iniciales: 'AV', empresa: 'CEMEX', externo: false },
      { id: 'eq-6', nombre: 'Fernando Trejo', rol: 'Jefe de Obra', iniciales: 'FT', empresa: 'EDIFICACIONES DEL NORTE', externo: true },
    ],
  }
  const p3: Proyecto = {
    id: 'seed-proyecto-3',
    nombre: 'Puente Vehicular Km 14',
    cliente: 'SECRETARÍA DE INFRAESTRUCTURA',
    contratista: 'CONSTRUCTORA PÁVEZ',
    coordinador: 'Ing. Gustavo Herrera',
    planoDataUrl: null,
    creadoEn: '2024-07-10T00:00:00.000Z',
    equipo: [
      { id: 'eq-7', nombre: 'Ing. Gustavo Herrera', rol: 'Coordinador CEMEX', iniciales: 'GH', empresa: 'CEMEX', externo: false },
      { id: 'eq-8', nombre: 'Daniela Mora', rol: 'Supervisora CEMEX', iniciales: 'DM', empresa: 'CEMEX', externo: false },
      { id: 'eq-9', nombre: 'Ing. Ricardo Pávez', rol: 'Director de Proyecto', iniciales: 'RP', empresa: 'CONSTRUCTORA PÁVEZ', externo: true },
    ],
  }

  const sesiones: Sesion[] = [
    // Proyecto 1 — Bodega Industrial Zona Norte
    { id: 's-p1-25oct', proyectoId: p1.id, fecha: '25/Oct/2024', fechaISO: '2024-10-25', volumenProgramado: 167, volumenReal: 161, estado: 'Completado', areaDefinida: null, markers: [], camiones: [], muestras: [], fotos: [] },
    { id: 's-p1-24oct', proyectoId: p1.id, fecha: '24/Oct/2024', fechaISO: '2024-10-24', volumenProgramado: 174, volumenReal: 174, estado: 'Completado', areaDefinida: null, markers: [], camiones: [], muestras: [], fotos: [] },
    { id: 's-p1-23oct', proyectoId: p1.id, fecha: '23/Oct/2024', fechaISO: '2024-10-23', volumenProgramado: 170, volumenReal: 166.5, estado: 'Completado', areaDefinida: null, markers: [], camiones: [], muestras: [], fotos: [] },
    { id: 's-p1-22oct', proyectoId: p1.id, fecha: '22/Oct/2024', fechaISO: '2024-10-22', volumenProgramado: 190, volumenReal: 189, estado: 'Completado', areaDefinida: null, markers: [], camiones: [], muestras: [], fotos: [] },
    { id: 's-p1-21oct', proyectoId: p1.id, fecha: '21/Oct/2024', fechaISO: '2024-10-21', volumenProgramado: 130, volumenReal: 124, estado: 'Completado', areaDefinida: null, markers: [], camiones: [], muestras: [], fotos: [] },
    // Proyecto 2 — Plaza Comercial Lomas II
    { id: 's-p2-18oct', proyectoId: p2.id, fecha: '18/Oct/2024', fechaISO: '2024-10-18', volumenProgramado: 210, volumenReal: 208, estado: 'Completado', areaDefinida: null, markers: [], camiones: [], muestras: [], fotos: [] },
    { id: 's-p2-15oct', proyectoId: p2.id, fecha: '15/Oct/2024', fechaISO: '2024-10-15', volumenProgramado: 195, volumenReal: 190, estado: 'Completado', areaDefinida: null, markers: [], camiones: [], muestras: [], fotos: [] },
    { id: 's-p2-12oct', proyectoId: p2.id, fecha: '12/Oct/2024', fechaISO: '2024-10-12', volumenProgramado: 180, volumenReal: 180, estado: 'Completado', areaDefinida: null, markers: [], camiones: [], muestras: [], fotos: [] },
    // Proyecto 3 — Puente Vehicular Km 14
    { id: 's-p3-20oct', proyectoId: p3.id, fecha: '20/Oct/2024', fechaISO: '2024-10-20', volumenProgramado: 145, volumenReal: 140, estado: 'Completado', areaDefinida: null, markers: [], camiones: [], muestras: [], fotos: [] },
    { id: 's-p3-16oct', proyectoId: p3.id, fecha: '16/Oct/2024', fechaISO: '2024-10-16', volumenProgramado: 160, volumenReal: 158, estado: 'Completado', areaDefinida: null, markers: [], camiones: [], muestras: [], fotos: [] },
  ]

  // Suppress unused warning
  void seedProyecto
  void seedSesion
  void seedCamiones
  return { proyectos: [p1, p2, p3], sesiones }
}

function loadFromStorage(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppState
      if (parsed.proyectos && parsed.sesiones) {
        // Migrate: ensure all sessions have camiones and muestras fields
        parsed.sesiones = parsed.sesiones.map(s => ({ ...s, camiones: s.camiones ?? [], muestras: s.muestras ?? [], fotos: s.fotos ?? [] }))
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

  const addMiembroEquipo = (proyectoId: ProjectId, miembro: MiembroEquipo) =>
    setProyectos(prev =>
      prev.map(p => p.id === proyectoId
        ? { ...p, equipo: [...(p.equipo ?? []), miembro] }
        : p
      )
    )

  const removeMiembroEquipo = (proyectoId: ProjectId, miembroId: string) =>
    setProyectos(prev =>
      prev.map(p => p.id === proyectoId
        ? { ...p, equipo: (p.equipo ?? []).filter(m => m.id !== miembroId) }
        : p
      )
    )

  return (
    <AppContext.Provider value={{
      proyectos, sesiones,
      addProyecto, addSesion, updateSesion, setAreaDefinida, addMarker, removeMarker, addCamion, updateCamion, removeCamion, addMuestra, updateMuestra, removeMuestra, addFoto, updateFoto, removeFoto, addMiembroEquipo, removeMiembroEquipo,
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

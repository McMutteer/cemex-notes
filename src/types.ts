export type ProjectId = string
export type SessionId = string

export interface MiembroEquipo {
  id: string
  nombre: string
  rol: string
  iniciales: string
  empresa: string
  externo: boolean
}

export interface Proyecto {
  id: ProjectId
  nombre: string
  cliente: string
  contratista: string
  coordinador: string
  planoDataUrl: string | null
  creadoEn: string
  equipo?: MiembroEquipo[]
}

export interface Sesion {
  id: SessionId
  proyectoId: ProjectId
  fecha: string
  fechaISO: string
  volumenProgramado: number
  volumenReal: number
  estado: 'En curso' | 'Completado' | 'Pendiente'
  areaDefinida: AreaRect | null
  markers: Marker[]
  camiones: CamionCR[]
  muestras: Muestra[]
  fotos: FotoEvidencia[]
  datosColado?: DatosColadoData
}

export interface AreaRect {
  x: number
  y: number
  w: number
  h: number
}

export interface Marker {
  id: string
  cr: string
  x: number
  y: number
}

export interface Muestra {
  id: string
  x: number       // % sobre el plano completo
  y: number
  etiqueta: string
  imageDataUrl: string | null
  creadaEn: string
}

export interface FotoEvidencia {
  id: string
  descripcion: string
  imageDataUrl: string
  creadaEn: string
}

export interface CamionCR {
  id: string
  cr: string
  m3: number
  horaLlegada: string
  horaInicio: string
  horaTermino: string
  rev: string
  tempConcreto: string
  esperaCliente: string
}

export interface DatosColadoData {
  tipoProducto: string
  fc: string
  fcUnit: 'kg/cm2' | 'MPa'
  espesor: string
  frecuenciaMuestreo: string
  slump: string
  tamMaxAgregado: string
  aditivos: string[]
  pisero: string
  laboratorio: string
  coordinadorCemex: string
  plantaOptima: string
  cantidadCR: string
  tiempoCiclo: string
  estadiaObra: string
  trayecto: string
  naveCerrada: boolean
  usaLaser: boolean
  reglaVibratoria: boolean
  bumpCutter: boolean
  barreraViento: boolean
  barreraVapor: boolean
  agregaFibra: boolean
  diamondDowel: boolean
  pronosticoLluvia: boolean
  notas: string
}

export interface AppState {
  proyectos: Proyecto[]
  sesiones: Sesion[]
}

export interface AppContextValue extends AppState {
  addProyecto: (p: Proyecto) => void
  addSesion: (s: Sesion) => void
  updateSesion: (id: SessionId, patch: Partial<Sesion>) => void
  setAreaDefinida: (sesionId: SessionId, area: AreaRect) => void
  addMarker: (sesionId: SessionId, marker: Marker) => void
  removeMarker: (sesionId: SessionId, markerId: string) => void
  addCamion: (sesionId: SessionId, camion: CamionCR) => void
  updateCamion: (sesionId: SessionId, camionId: string, patch: Partial<CamionCR>) => void
  removeCamion: (sesionId: SessionId, camionId: string) => void
  addMuestra: (sesionId: SessionId, muestra: Muestra) => void
  updateMuestra: (sesionId: SessionId, muestraId: string, patch: Partial<Muestra>) => void
  removeMuestra: (sesionId: SessionId, muestraId: string) => void
  addFoto: (sesionId: SessionId, foto: FotoEvidencia) => void
  updateFoto: (sesionId: SessionId, fotoId: string, patch: Partial<FotoEvidencia>) => void
  removeFoto: (sesionId: SessionId, fotoId: string) => void
  addMiembroEquipo: (proyectoId: ProjectId, miembro: MiembroEquipo) => void
  removeMiembroEquipo: (proyectoId: ProjectId, miembroId: string) => void
  activeProyectoId: ProjectId | null
  activeSessionId: SessionId | null
  setActiveProyectoId: (id: ProjectId | null) => void
  setActiveSessionId: (id: SessionId | null) => void
}

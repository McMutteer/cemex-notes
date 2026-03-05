export const proyecto = {
  id: '1',
  nombre: 'Nave Vesta 4 Aguascalientes',
  cliente: 'VYACY',
  contratista: 'COPACHISA',
  coordinador: 'Ing. Luis Alberto Cortes',
  volumenAcumulado: 1715.5,
}

export const sesionActual = {
  id: 's1',
  fecha: '25/Oct/2024',
  volumenProgramado: 167,
  volumenReal: 161,
  estado: 'Completado',
}

export const datosColado = {
  espesor: '15 cm',
  volumen: '161 m³',
  producto: 'B-042-4-C-28-12-0-3-201',
  frecuencia: '15 mins',
  codigo: '20020326',
  revenimiento: '12 cms + 2.5 cms',
  fibra: 'No',
  acabado: 'Pulido',
  horario: '5:00 pm',
  pisero: 'COPACHISA / VIACY',
  laboratorio: 'COSOC',
  coordinadorCemex: 'Luis Alberto Cortes',
  plantaOptima: 'D69 planta sur',
  cantidadCR: 8,
  tiempoCiclo: '1.30 hrs aprox',
  estadiaObra: '35 mins aprox',
  trayecto: '31 mins aprox',
}

export const camiones = [
  { id: 1, cr: 5894, m3: 7, llega: '5:39', inicia: '5:50', termina: '5:55', esperaCliente: '39 min', esperaCemex: '-', rev: 11, tempConcreto: 31.3, velViento: 18.9, tempAmbiente: 23.6, humedad: '21.5%', evaporacion: 1.53 },
  { id: 2, cr: 4923, m3: 7, llega: '6:14', inicia: '6:23', termina: '6:35', esperaCliente: '28 min', esperaCemex: '-', rev: 11, tempConcreto: 31.5, velViento: null, tempAmbiente: null, humedad: null, evaporacion: null },
  { id: 3, cr: 4969, m3: 7, llega: '6:22', inicia: '6:37', termina: '6:44', esperaCliente: '-', esperaCemex: '15 min', rev: 12, tempConcreto: 31.3, velViento: null, tempAmbiente: null, humedad: null, evaporacion: null },
  { id: 4, cr: 5885, m3: 7, llega: '6:34', inicia: '6:48', termina: '7:01', esperaCliente: '-', esperaCemex: '14 min', rev: 11, tempConcreto: 31.1, velViento: null, tempAmbiente: null, humedad: null, evaporacion: null },
  { id: 5, cr: 5424, m3: 7, llega: '6:42', inicia: '7:02', termina: '7:11', esperaCliente: '-', esperaCemex: '20 min', rev: 11, tempConcreto: 31.2, velViento: null, tempAmbiente: null, humedad: null, evaporacion: null },
  { id: 6, cr: 5883, m3: 7, llega: '6:55', inicia: '7:12', termina: '7:25', esperaCliente: '-', esperaCemex: '17 min', rev: 10, tempConcreto: 30.9, velViento: null, tempAmbiente: null, humedad: null, evaporacion: null },
  { id: 7, cr: 4989, m3: 7, llega: '7:04', inicia: '7:27', termina: '7:40', esperaCliente: '-', esperaCemex: '23 min', rev: 11, tempConcreto: 30.8, velViento: null, tempAmbiente: null, humedad: null, evaporacion: null },
  { id: 8, cr: 5894, m3: 7, llega: '7:17', inicia: '7:41', termina: '7:55', esperaCliente: '-', esperaCemex: '24 min', rev: 11, tempConcreto: 30.7, velViento: null, tempAmbiente: null, humedad: null, evaporacion: null },
  { id: 9, cr: 4923, m3: 7, llega: '7:45', inicia: '7:56', termina: '8:06', esperaCliente: '-', esperaCemex: '11 min', rev: 11, tempConcreto: 30.1, velViento: 16.6, tempAmbiente: 20.9, humedad: '30.9%', evaporacion: 1.46 },
  { id: 10, cr: 4969, m3: 7, llega: '8:00', inicia: '8:08', termina: '8:17', esperaCliente: '-', esperaCemex: '8 min', rev: 11, tempConcreto: 30.2, velViento: null, tempAmbiente: null, humedad: null, evaporacion: null },
]

export const zonasMapa = [
  { id: 1, etiqueta: '14/Oct\n91 m³', color: '#4ade80', x: 10, y: 75, w: 18, h: 12 },
  { id: 2, etiqueta: '12/Oct\n64 m³', color: '#4ade80', x: 30, y: 75, w: 15, h: 12 },
  { id: 3, etiqueta: '15/Oct\n160 m³', color: '#4ade80', x: 50, y: 75, w: 35, h: 12 },
  { id: 4, etiqueta: '21/Oct\n124 m³', color: '#4ade80', x: 10, y: 58, w: 35, h: 14 },
  { id: 5, etiqueta: '17/Oct\n182 m³', color: '#4ade80', x: 50, y: 58, w: 35, h: 14 },
  { id: 6, etiqueta: '23/Oct\n166.5 m³', color: '#4ade80', x: 10, y: 42, w: 35, h: 13 },
  { id: 7, etiqueta: '18/Oct\n175 m³', color: '#4ade80', x: 50, y: 42, w: 35, h: 13 },
  { id: 8, etiqueta: '24/Oct\n174 m³', color: '#4ade80', x: 10, y: 28, w: 35, h: 12 },
  { id: 9, etiqueta: '22/Oct\n189 m³', color: '#4ade80', x: 50, y: 28, w: 35, h: 12 },
  { id: 10, etiqueta: '25/Oct\n161 m³', color: '#9ca3af', x: 0, y: 28, w: 8, h: 55 },
  { id: 11, etiqueta: '16/Oct\n167 m³', color: '#4ade80', x: 88, y: 28, w: 8, h: 55 },
]

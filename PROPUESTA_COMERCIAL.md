# Propuesta Comercial — Plataforma de Control de Colados CEMEX

**Desarrollado por:** Nqual5
**Versión:** 1.0
**Fecha:** Marzo 2026
**Confidencial**

---

## 1. Resumen Ejecutivo

Nqual5 ha desarrollado una **plataforma móvil nativa** diseñada específicamente para el flujo de trabajo de CEMEX en obra: control de colados, trazabilidad de camiones revolvedores (CR), mapeo georreferenciado del área de trabajo y evidencia fotográfica. La aplicación existe hoy como un MVP funcional con un año de diseño de UX orientado a campo.

La propuesta contempla la entrega de una aplicación **nativa iOS + Android**, con backend en la nube, panel de visualización web y soporte continuo.

---

## 2. Problema que Resuelve

El proceso de documentación de colados en obra actualmente depende de:

- Formatos en papel o Excel que se pierden o duplican
- Fotos en WhatsApp sin trazabilidad ni contexto
- Sin registro preciso de llegada, inicio y término por camión CR
- Imposibilidad de relacionar volumen descargado con el área física del plano
- Reportes generados horas o días después del evento, con datos incompletos

**Consecuencias:**
- Disputas de volumen entre CEMEX y el contratista
- Pérdida de evidencia en caso de falla o reclamo
- Ausencia de trazabilidad de temperatura y tiempos por CR
- Sin visibilidad en tiempo real para gerentes remotos

---

## 3. La Solución: Control de Colados CEMEX

Una aplicación móvil construida específicamente para el flujo de CEMEX, con las siguientes características:

### 3.1 Gestión de Proyectos

| Funcionalidad | Descripción |
|--------------|-------------|
| Múltiples proyectos | Gestión de varios proyectos en paralelo desde un mismo dispositivo |
| Ficha de proyecto | Nombre, cliente, contratista y coordinador registrados por proyecto |
| Carga de plano | Subida del plano arquitectónico/estructural del proyecto (compresión automática) |
| Métricas acumuladas | Volumen acumulado total, número de sesiones y porcentaje de avance por proyecto |
| Historial de sesiones | Lista cronológica de todas las sesiones de colado con estado |

### 3.2 Sesiones de Colado (por día de trabajo)

| Funcionalidad | Descripción |
|--------------|-------------|
| Creación de sesión | Fecha, volumen programado del día |
| Estado de sesión | En curso / Completado / Pendiente |
| Volumen real vs. programado | Barra de progreso visual comparativo |
| Cálculo automático de volumen | Suma de m³ por camión registrado |
| Datos del colado | Sección de mezcla, responsables y producción |
| Checklist de condiciones | 9 verificaciones de condiciones de obra (losa, cimbra, acero, etc.) |

### 3.3 Control de Camiones CR

| Funcionalidad | Descripción |
|--------------|-------------|
| Registro por CR | Número de CR, m³ transportados |
| Tiempos completos | Hora de llegada, hora de inicio de descarga, hora de término |
| Temperatura del concreto | Registro de temperatura por viaje |
| Espera del cliente | Tiempo de espera atribuible al cliente |
| Número de revolución | Identificador de revolución por viaje |
| Edición y eliminación | Corrección de datos en cualquier momento |
| Total acumulado | Suma automática de m³ de todos los CRs del día |

### 3.4 Plano y Mapeo Georreferenciado

| Funcionalidad | Descripción |
|--------------|-------------|
| Visualización del plano | Carga y visualización del plano del proyecto con zoom |
| Definición del área de trabajo | Herramienta de dibujo para seleccionar el área del colado del día |
| Mapeo de CRs | Colocación de marcadores sobre el plano para cada CR descargado |
| Ubicación de muestras | Marcadores de puntos de muestreo sobre el área de colado |
| Vista histórica | Plano del proyecto con todas las áreas coladas acumuladas por sesión |

### 3.5 Muestras de Laboratorio

| Funcionalidad | Descripción |
|--------------|-------------|
| Registro de puntos de muestra | Etiqueta y posición sobre el plano del área de colado |
| Foto por muestra | Fotografía de la muestra en el punto de toma |
| Timestamp automático | Fecha y hora exacta de cada muestra |
| Edición y eliminación | Corrección de datos en campo |

### 3.6 Reporte Fotográfico

| Funcionalidad | Descripción |
|--------------|-------------|
| Captura desde cámara | Acceso directo a la cámara del dispositivo |
| Selección desde galería | Carga de fotos existentes en el dispositivo |
| Descripción obligatoria | Cada foto requiere un texto descriptivo |
| Galería organizada | Listado cronológico de fotos con thumbnail, descripción y timestamp |
| Edición y eliminación | Corrección o eliminación de cualquier evidencia |

### 3.7 Exportación y Reportes

| Funcionalidad | Estado |
|--------------|--------|
| Reporte PDF por sesión | En desarrollo (incluido en la versión de entrega) |
| Exportación de datos | Planificado (CSV / Excel) |

---

## 4. Arquitectura de la Solución

### MVP Actual (versión de demostración)
- Aplicación web React (PWA — instalable en móvil)
- Almacenamiento local en el dispositivo
- Funcional sin conexión a internet

### Versión de Entrega (nativa iOS + Android)

```
┌─────────────────────────────────┐
│        App Móvil Nativa         │
│    iOS (App Store) + Android    │
│      (Google Play / Enterprise) │
└────────────┬────────────────────┘
             │ HTTPS / REST API
┌────────────▼────────────────────┐
│          Backend API            │
│     Node.js + PostgreSQL        │
│      Servidor dedicado          │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│     Almacenamiento de Fotos     │
│        Cloudflare R2 / S3       │
└─────────────────────────────────┘
             │
┌────────────▼────────────────────┐
│   Panel Web de Visualización    │
│  (Licencias de visualización)   │
└─────────────────────────────────┘
```

**Tecnología:**
- App nativa: React Native / Expo (Capacitor sobre base existente)
- Backend: Node.js + PostgreSQL
- Almacenamiento de imágenes: Cloudflare R2
- Sincronización: Tiempo real entre dispositivos
- Modo offline: Funciona sin conexión, sincroniza al reconectarse

---

## 5. Modelo de Licenciamiento

### Licencia Obra (Usuario de campo)
Para residentes de obra, supervisores, técnicos que capturan datos en sitio.

**Acceso completo:**
- Crear y gestionar proyectos y sesiones
- Registrar camiones CR con todos los campos
- Mapeo de áreas y CRs sobre plano
- Captura fotográfica con descripción
- Registro de muestras de laboratorio
- Exportación de reportes PDF

**Precio: $400 MXN / usuario / mes**

---

### Licencia Visualización (Gerentes y clientes)
Para gerentes de proyecto, personal corporativo, clientes contratistas que consultan información sin estar en campo.

**Acceso de solo lectura:**
- Consulta de todos los proyectos y sesiones
- Visualización del reporte fotográfico
- Acceso al plano con áreas y marcadores
- Descarga de reportes PDF
- Dashboard con métricas acumuladas

**Precio: $175 MXN / usuario / mes**

---

## 6. Propuesta Económica

### Escenario Piloto (3 meses, 100 usuarios)

| Concepto | Cantidad | Precio unitario | Total |
|----------|----------|----------------|-------|
| Implementación inicial | 1 | $45,000 MXN | $45,000 MXN |
| Licencias Obra | 60 usuarios × 3 meses | $400 MXN/mes | $72,000 MXN |
| Licencias Visualización | 40 usuarios × 3 meses | $175 MXN/mes | $21,000 MXN |
| **Total Piloto** | | | **$138,000 MXN** |

---

### Contrato Anual (post-piloto, 100 usuarios)

| Concepto | Cantidad | Precio unitario | Total anual |
|----------|----------|----------------|-------------|
| Licencias Obra | 60 usuarios × 12 meses | $400 MXN/mes | $288,000 MXN |
| Licencias Visualización | 40 usuarios × 12 meses | $175 MXN/mes | $84,000 MXN |
| Soporte y mantenimiento | Incluido | — | — |
| Actualizaciones de plataforma | Incluido | — | — |
| **Total Anual** | | | **$372,000 MXN** |

> Equivalente a **$3,100 MXN/mes promedio por usuario activo en campo** (incluyendo visualizadores).

---

### Cuota de Implementación — Detalle

| Servicio | Incluye |
|----------|---------|
| Setup de backend y base de datos | Infraestructura en servidor dedicado |
| Publicación en App Store (iOS) | Gestión completa del proceso de Apple |
| Publicación en Google Play (Android) | Gestión completa del proceso de Google |
| Migración del MVP actual | Conversión a app nativa |
| Capacitación inicial | 2 sesiones de 2h para administradores |
| Soporte primer mes | Acompañamiento en adopción |

---

## 7. Cronograma de Entrega

| Semana | Entregable |
|--------|-----------|
| 1-2 | Backend + autenticación por usuario |
| 3-4 | Sync multi-dispositivo + base de datos |
| 5 | Exportación PDF completo por sesión |
| 6 | App nativa iOS + Android (Capacitor/React Native) |
| 7-8 | Panel web de visualización |
| 9 | QA + pruebas en campo |
| 10 | Publicación en tiendas + capacitación |
| **Total** | **8-10 semanas** |

---

## 8. Comparativa con el Mercado

| Plataforma | Enfoque | Precio aprox. | Flujo CEMEX/CR |
|------------|---------|--------------|---------------|
| Procore | Construcción genérica | $375 USD/mes (ilimitado) | No tiene |
| PlanGrid (Autodesk) | Planos y documentos | $39–49 USD/usuario/mes | No tiene |
| Fieldwire | Tareas y planos | $29–54 USD/usuario/mes | No tiene |
| **Control Colados CEMEX** | **Específico CEMEX** | **$400 MXN ($21 USD)/usuario/mes** | **Diseñado para ello** |

**Ventaja clave:** Las plataformas genéricas no tienen el concepto de CR, colado, temperatura de concreto, ni el mapeo de áreas de colado. Adaptarlas a los flujos de CEMEX requeriría desarrollo personalizado significativo — a un costo mayor.

---

## 9. Términos y Condiciones Propuestos

| Término | Condición |
|---------|-----------|
| Pago implementación | 50% al firmar, 50% al entregar la app |
| Facturación licencias | Mensual, prepagada |
| Contrato mínimo | 3 meses (piloto) / 12 meses (anual) |
| Datos | Propiedad exclusiva de CEMEX |
| Servidor | Dedicado, no compartido con otros clientes |
| SLA soporte | Respuesta en 24h hábiles, resolución en 72h |
| Confidencialidad | NDA firmado antes de acceso a datos |
| Actualizaciones | Incluidas en las licencias anuales |

---

## 10. Sobre Nqual5

Nqual5 es una empresa de desarrollo de software especializada en aplicaciones móviles y plataformas digitales para industrias de campo. Desarrollamos soluciones enfocadas en la experiencia de usuario en condiciones reales de obra: conectividad intermitente, uso con guantes, captura rápida de datos.

**Capacidades:**
- Desarrollo React Native / iOS / Android
- Backends escalables en la nube
- Diseño UX para usuarios no técnicos en campo
- Infraestructura propia (sin dependencia de terceros para el hosting)

---

*Propuesta válida por 30 días a partir de la fecha de emisión.*
*Para más información: contacto@nqual5.com*

# Plan de Migracion MPA a SPA

## Inventario

- Backend: Spring Boot 3.3.5, Java 21, Spring Web, Spring Data JPA, Validation, MySQL, Actuator.
- Arquitectura previa: Thymeleaf/HTML en `src/main/resources/templates`, scripts DOM embebidos y servicios JS en `src/main/resources/static/js/api`.
- Arquitectura nueva: React + Vite en `frontend`, React Router, servicios REST en `frontend/src/services`.
- Entidades principales: `Usuario`, `Docente`, `Zona`, `Turno`, `AsignacionTurno`, `Incidente`, `Checkpoint`, `Recorrido`, `Reasignacion`.
- Assets reciclados: `logo-sfr.png` copiado a `frontend/src/assets/logo-sfr.png`.
- Dependencias eliminadas: `spring-boot-starter-thymeleaf`.
- Controladores MPA eliminados: `ViewController`, `PantallaController`, `CurrentDocenteViewAdvice`.

## Tabla de pantallas

| Pagina MPA anterior | Ruta React SPA equivalente | Funcionalidad asociada | Endpoint backend | Estado | Observaciones tecnicas |
|---|---|---|---|---|---|
| `index.html` | `/` | Login y acceso por rol | `/api/v1/usuarios/email/{email}` | migrado | No habia autenticacion real por password; queda contexto SPA basico. |
| `dashboard-admin.html` | `/dashboard-admin` | Resumen administrativo | `/docentes`, `/turnos`, `/zonas`, `/incidentes` | migrado | Usa conteos reales. |
| `dashboard-profesor.html` | `/dashboard-profesor` | Acciones rapidas docente | Rutas SPA internas | migrado | Navegacion sin recarga. |
| `dashboard-coordinador.html` | `/dashboard-coordinador` | Resumen coordinacion | `/asignaciones-turnos/activas`, `/reasignaciones/estado/pendiente`, `/analiticas/mapa-calor` | migrado | Datos reales. |
| `gestion-profesores.html` | `/profesores` | CRUD docentes/usuarios | `/docentes`, `/usuarios` | migrado | Crea usuario antes de docente. |
| `gestion-turnos.html` | `/turnos` | CRUD turnos | `/turnos`, `/zonas`, `/asignaciones-turnos` | migrado | Muestra cobertura desde asignaciones. |
| `gestion-zonas.html` | `/zonas` | CRUD zonas | `/zonas` | migrado | CRUD completo. |
| `gestion-incidentes.html` | `/incidentes` | Gestion de incidentes | `/incidentes` | migrado | Acciones de estado con `PUT`. |
| `tablero-coordinacion.html` | `/tablero-coordinacion` | Turnos activos y reemplazos | `/asignaciones-turnos/activas`, `/reasignaciones/estado/pendiente`, `/reasignaciones/{id}/responder` | migrado | Mantiene aprobacion/rechazo. |
| `mis-turnos.html` | `/mis-turnos` | Panel semanal docente | `/asignaciones-turnos/actual/panel` | migrado | Backend resuelve docente actual por sesion/fallback. |
| `registrar-punto.html` | `/registrar-punto` | Registro de recorrido | `/recorridos`, `/checkpoints`, `/asignaciones-turnos/actual/panel` | migrado | Usa endpoints reales. |
| `check-in-punto.html` | `/check-in-punto` | Check-in con PIN | `/asignaciones-turnos/{id}/checkin`, `/checkpoints` | migrado | Validacion del PIN queda en backend. |
| `reportar-incidente.html` | `/reportar-incidente` | Crear incidente | `/incidentes`, `/asignaciones-turnos/actual/panel` | migrado | Guarda estado `reportado`. |
| `solicitar-reemplazo.html` | `/solicitar-reemplazo` | Solicitar reasignacion | `/reasignaciones`, `/reasignaciones/candidatos/{turnoId}` | migrado | Candidatos reales desde backend. |
| `analiticas.html` | `/analiticas` | Mapa de calor | `/analiticas/mapa-calor` | migrado | Filtros SPA. |
| `cobertura-tiempo-real.html` | `/cobertura` | Cobertura activa | `/asignaciones-turnos/activas` | migrado | Datos reales. |
| `MetricasPositivasDocentes.html` | `/metricas-docentes` | Metricas por docente | `/docentes`, `/asignaciones-turnos` | migrado | Indicadores derivados por falta de endpoint dedicado. |
| `reconocimientos-institucionales.html` | `/reconocimientos` | Ranking reconocimientos | `/docentes`, `/asignaciones-turnos` | migrado | Ranking derivado de calificaciones de cierre. |
| `perfil-cuenta.html` | `/mi-perfil` | Perfil admin | Contexto SPA | migrado | Persistencia de perfil no existia. |
| `perfil-profesor.html` | `/mi-perfil-profesor` | Perfil docente | Contexto SPA | migrado | Pendiente endpoint de perfil autenticado. |
| `perfil-coordinador.html` | `/mi-perfil-coordinador` | Perfil coordinador | Contexto SPA | migrado | Pendiente endpoint de perfil autenticado. |
| `reglas-operativas.html` | `/reglas-operativas` | Informacion operativa | Contenido SPA | migrado | Vista informativa sin endpoint previo. |
| `soporte.html` | `/soporte` | Soporte | Contenido SPA | migrado | Vista informativa. |
| `contacto.html` | `/contacto` | Contacto | Contenido SPA | migrado | Vista informativa. |
| `ejemplo-api.html` | No aplica | Demo de API MPA | Reemplazado por servicios React | eliminado | Se elimina por ser prueba antigua. |
| `fragments/*.html` | No aplica | Fragmentos Thymeleaf | No aplica | eliminado | Reemplazados por layout React. |


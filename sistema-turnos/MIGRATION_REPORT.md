# Reporte de Migracion

## Que se migro

- Frontend completo a SPA React con Vite.
- Rutas internas con React Router.
- Layout principal reutilizable.
- Servicios HTTP por recurso bajo `frontend/src/services`.
- Pantallas de dashboards, gestion, acciones de docente, coordinacion, analiticas, perfiles e informacion.
- Estados de carga, errores, vacios, modales y formularios reutilizables.

## Que se elimino de la MPA

- `src/main/resources/templates/**`
- `src/main/resources/static/js/**`
- `src/main/resources/static/css/**`
- `src/main/resources/js/**`
- Controladores MVC `ViewController` y `PantallaController`.
- `CurrentDocenteViewAdvice`, usado solo por Thymeleaf.
- `WebMvcConfig`, usado para mapear recursos estaticos antiguos.
- Dependencia `spring-boot-starter-thymeleaf`.
- Documentacion antigua centrada en MPA.

## Que se reciclo

- API REST existente.
- DTOs, entidades, repositorios, servicios y excepciones backend.
- Configuracion CORS para `/api/**`.
- Logo institucional `logo-sfr.png`, copiado al frontend.
- Contratos de endpoints usados por los antiguos servicios JavaScript.

## Endpoints por pantalla

- `/`: `/api/v1/usuarios/email/{email}`
- `/dashboard-admin`: `/api/v1/docentes`, `/api/v1/turnos`, `/api/v1/zonas`, `/api/v1/incidentes`
- `/dashboard-coordinador`: `/api/v1/asignaciones-turnos/activas`, `/api/v1/reasignaciones/estado/pendiente`, `/api/v1/analiticas/mapa-calor`
- `/profesores`: `/api/v1/docentes`, `/api/v1/usuarios`
- `/turnos`: `/api/v1/turnos`, `/api/v1/zonas`, `/api/v1/asignaciones-turnos`
- `/zonas`: `/api/v1/zonas`
- `/incidentes`: `/api/v1/incidentes`
- `/mis-turnos`: `/api/v1/asignaciones-turnos/actual/panel`
- `/registrar-punto`: `/api/v1/recorridos`, `/api/v1/checkpoints`
- `/check-in-punto`: `/api/v1/asignaciones-turnos/{id}/checkin`, `/api/v1/checkpoints`
- `/reportar-incidente`: `/api/v1/incidentes`
- `/solicitar-reemplazo`: `/api/v1/reasignaciones`, `/api/v1/reasignaciones/candidatos/{turnoId}`
- `/tablero-coordinacion`: `/api/v1/asignaciones-turnos/activas`, `/api/v1/reasignaciones/{id}/responder`
- `/analiticas`: `/api/v1/analiticas/mapa-calor`
- `/cobertura`: `/api/v1/asignaciones-turnos/activas`

## Archivos principales creados o modificados

- `frontend/src/App.jsx`
- `frontend/src/pages/pages.jsx`
- `frontend/src/layouts/AppLayout.jsx`
- `frontend/src/components/ui.jsx`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/services/apiClient.js`
- `frontend/src/services/resources.js`
- `frontend/src/hooks/useAsync.js`
- `frontend/src/styles/global.css`
- `frontend/.env.example`
- `pom.xml`
- `README.md`
- `MIGRATION_PLAN.md`
- `MIGRATION_REPORT.md`

## Funcionalidades validadas

- Build frontend con `npm run build`.
- Lint frontend con `npm run lint`.
- Build backend con `.\mvnw.cmd -DskipTests package`.
- Arranque backend con `.\mvnw.cmd spring-boot:run` y consulta real a `GET /api/v1/zonas`.
- Carga de SPA en `http://127.0.0.1:5173` y ruta profunda `/soporte` en navegador.
- Rutas React definidas para todas las pantallas MPA migradas.
- Eliminacion de controladores que devolvian vistas HTML.
- Eliminacion de templates y scripts DOM de la MPA.

## Pendientes tecnicos

- Implementar autenticacion real en backend: validacion de password, JWT o sesion, usuario actual y roles.
- Sustituir el fallback de `CurrentDocenteContextService` por usuario autenticado real.
- Agregar endpoints dedicados para perfil, metricas docentes y reconocimientos si se requiere evitar calculos derivados en frontend.
- Agregar pruebas automatizadas de frontend y pruebas de integracion REST.
- Revisar politicas de produccion para CORS; actualmente permite origen `*`.

## Riesgos y decisiones

- No se mantuvo compatibilidad con las paginas Thymeleaf antiguas para evitar dos frontends paralelos.
- El backend no sirve el build de React; frontend y backend corren como aplicaciones separadas. Vite maneja fallback de rutas profundas en desarrollo y `vite preview` para build.
- Login se conserva como flujo de SPA, pero no se presenta como seguridad real porque el backend original no la implementaba.

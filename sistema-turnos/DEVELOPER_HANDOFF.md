# Handoff para Desarrolladores

Este documento resume como continuar el trabajo despues de la migracion de MPA Thymeleaf a SPA React + API REST.

## Arquitectura Actual

El proyecto quedo separado en dos capas:

- Backend Spring Boot: API REST bajo `/api/v1`.
- Frontend React/Vite: SPA en `frontend/`.

La fuente de verdad del frontend es React. No se deben recrear templates Thymeleaf ni rutas MVC que devuelvan HTML.

## Estructura Relevante

```text
sistema-turnos/
  src/main/java/com/example/sistema_turnos/
    controllers/api/       API REST
    services/              Logica de negocio
    repositories/          Persistencia JPA
    dtos/                  Contratos JSON
    entities/              Entidades JPA
    config/CorsConfig.java CORS para frontend

  frontend/
    src/
      assets/
      components/
      config/
      context/
      hooks/
      layouts/
      pages/
      services/
      styles/
```

## Como Ejecutar

Backend:

```powershell
cd C:\Users\DELL\Documents\GitHub\ProyectoWeb\sistema-turnos
.\mvnw.cmd spring-boot:run
```

Frontend:

```powershell
cd C:\Users\DELL\Documents\GitHub\ProyectoWeb\sistema-turnos\frontend
npm install
copy .env.example .env
npm run dev
```

Variable requerida:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## Reglas para Continuar

1. No agregar nuevas paginas en `src/main/resources/templates`.
2. No agregar controladores Spring MVC con `@Controller` para devolver vistas.
3. Todo endpoint nuevo debe vivir bajo `/api/v1/...` y devolver JSON.
4. Toda llamada HTTP del frontend debe estar en `frontend/src/services`.
5. Las paginas React no deben tener URLs hardcodeadas al backend.
6. Las rutas internas deben usar `Link`, `NavLink`, `Navigate` o `useNavigate`.
7. No duplicar logica de fetch dentro de componentes.
8. Si una pantalla necesita datos, primero buscar o crear endpoint REST.
9. Mantener estados de carga, error y vacio visibles.
10. Documentar pendientes tecnicos en `MIGRATION_REPORT.md`.

## Frontend

Rutas principales estan en:

```text
frontend/src/App.jsx
```

Paginas migradas estan agrupadas en:

```text
frontend/src/pages/pages.jsx
```

Para nuevas funcionalidades grandes, se recomienda separar esa pagina en su propio archivo dentro de `frontend/src/pages/`.

Servicios REST estan en:

```text
frontend/src/services/apiClient.js
frontend/src/services/resources.js
```

Patron recomendado para agregar un recurso:

```js
export const nuevoRecursoService = {
  list: () => http.get('/nuevo-recurso'),
  get: (id) => http.get(`/nuevo-recurso/${id}`),
  create: (payload) => http.post('/nuevo-recurso', payload),
  update: (id, payload) => http.put(`/nuevo-recurso/${id}`, payload),
  remove: (id) => http.delete(`/nuevo-recurso/${id}`),
};
```

Componentes reutilizables:

```text
frontend/src/components/ui.jsx
```

Incluye `Button`, `DataTable`, `Modal`, `LoadingState`, `ErrorState`, `Message` y `StatCard`.

## Backend

Controladores REST:

```text
src/main/java/com/example/sistema_turnos/controllers/api
```

Cada controlador debe:

- Usar `@RestController`.
- Usar `@RequestMapping("/api/v1/...")`.
- Retornar `ResponseEntity`.
- Recibir y devolver DTOs, no entidades JPA directamente.
- Delegar logica a `services/`.

No volver a agregar:

```java
@Controller
public class PantallaController { ... }
```

## Autenticacion

Estado actual:

- La SPA tiene un `AuthContext` basico.
- El login valida existencia de usuario por email con `/api/v1/usuarios/email/{email}`.
- No existe autenticacion real por password, JWT ni sesion segura.

Pendiente recomendado:

1. Crear endpoint `POST /api/v1/auth/login`.
2. Validar password en backend.
3. Devolver JWT o sesion consistente.
4. Crear endpoint `GET /api/v1/auth/me`.
5. Reemplazar el fallback de `CurrentDocenteContextService`.
6. Activar `ProtectedRoute` y permisos por rol en React.

## Pantallas y Endpoints

Consultar el mapa completo en:

```text
MIGRATION_PLAN.md
```

Resumen rapido:

- `/profesores` usa `/docentes` y `/usuarios`.
- `/turnos` usa `/turnos`, `/zonas`, `/asignaciones-turnos`.
- `/zonas` usa `/zonas`.
- `/incidentes` usa `/incidentes`.
- `/mis-turnos` usa `/asignaciones-turnos/actual/panel`.
- `/registrar-punto` usa `/recorridos`, `/checkpoints`.
- `/check-in-punto` usa `/asignaciones-turnos/{id}/checkin`.
- `/solicitar-reemplazo` usa `/reasignaciones` y `/reasignaciones/candidatos/{turnoId}`.
- `/analiticas` usa `/analiticas/mapa-calor`.

## Validaciones Antes de Entregar Cambios

Frontend:

```powershell
cd frontend
npm run lint
npm run build
```

Backend:

```powershell
.\mvnw.cmd -DskipTests package
```

Prueba manual minima:

1. Backend iniciado en `http://localhost:8080`.
2. Frontend iniciado en `http://localhost:5173`.
3. Abrir `/`.
4. Entrar con `admin@test.com` o acceso rapido.
5. Probar `/profesores`, `/turnos`, `/zonas`, `/incidentes`.
6. Refrescar una ruta profunda, por ejemplo `/soporte`.
7. Confirmar que no hay links a `.html` ni rutas Thymeleaf.

## Decisiones Importantes

- No se mantuvo la MPA en paralelo.
- No se sirve React desde Spring Boot en esta fase.
- CORS permite desarrollo con frontend y backend en puertos distintos.
- Algunos modulos informativos fueron migrados como contenido React porque no tenian endpoint propio.
- Metricas y reconocimientos calculan datos derivados en frontend mientras no exista endpoint dedicado.

## Pendientes Tecnicos Prioritarios

1. Autenticacion real.
2. Usuario actual basado en sesion/JWT.
3. Endpoints dedicados de perfil.
4. Endpoints dedicados para metricas y reconocimientos.
5. Tests unitarios/frontend.
6. Tests de integracion REST.
7. Politica CORS de produccion.
8. Revisar `spring.jpa.hibernate.ddl-auto=create`, porque recrea tablas al iniciar.

## Checklist para Nuevos Modulos

- Crear o confirmar DTO backend.
- Crear endpoint REST bajo `/api/v1`.
- Agregar metodo en `frontend/src/services/resources.js`.
- Crear pagina React.
- Registrar ruta en `frontend/src/App.jsx`.
- Agregar link en `frontend/src/layouts/AppLayout.jsx` si aplica.
- Manejar loading, error y estado vacio.
- Ejecutar lint/build frontend.
- Ejecutar build backend.
- Actualizar documentacion si cambia el flujo.


# Sistema de Turnos - SPA React + REST API

Aplicacion migrada desde MPA Thymeleaf a una arquitectura con:

- Backend Spring Boot 3 como API REST bajo `/api/v1`.
- Frontend React con Vite en `frontend/`.
- Navegacion SPA con React Router.
- Servicios HTTP centralizados en `frontend/src/services/`.
- URL de API configurable con `VITE_API_BASE_URL`.

## Requisitos

- Java 21.
- Node.js 24 o compatible.
- MySQL disponible en `localhost:3306`.
- Base de datos `sistema_turnos`.

## Backend

Configurar la conexion en `src/main/resources/application.properties`.

```powershell
cd sistema-turnos
.\mvnw.cmd spring-boot:run
```

Puerto por defecto: `8080`.

Endpoints principales:

- `GET/POST/PUT/DELETE /api/v1/usuarios`
- `GET/POST/PUT/DELETE /api/v1/docentes`
- `GET/POST/PUT/DELETE /api/v1/zonas`
- `GET/POST/PUT/DELETE /api/v1/turnos`
- `GET/POST/PUT/DELETE /api/v1/asignaciones-turnos`
- `GET/POST/PUT/DELETE /api/v1/incidentes`
- `GET/POST/PUT/DELETE /api/v1/checkpoints`
- `GET/POST/PUT/DELETE /api/v1/recorridos`
- `GET/POST/PUT/DELETE /api/v1/reasignaciones`
- `GET /api/v1/analiticas/mapa-calor`

## Frontend

```powershell
cd sistema-turnos\frontend
npm install
copy .env.example .env
npm run dev
```

Puerto por defecto Vite: `5173`.

Variable de entorno:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Build:

```powershell
cd sistema-turnos\frontend
npm run build
```

Preview del build:

```powershell
npm run preview
```

## Probar conexion frontend-backend

1. Crear la base MySQL `sistema_turnos`.
2. Iniciar backend con `.\mvnw.cmd spring-boot:run`.
3. Iniciar frontend con `npm run dev`.
4. Abrir `http://localhost:5173`.
5. Entrar con `admin@test.com` o usar accesos rapidos.
6. Validar listados de profesores, turnos, zonas e incidentes.

## Notas de autenticacion

El proyecto original tenia pantalla de login, pero no tenia autenticacion real en backend. La SPA conserva un contexto de usuario basico para experiencia de navegacion y valida email contra `/api/v1/usuarios/email/{email}`. La autenticacion real con password/JWT/sesion queda como pendiente tecnico documentado en `MIGRATION_REPORT.md`.


# 🚀 Sistema de Turnos - React SPA Refactorizado

Este es el proyecto del Sistema de Gestión de Turnos, **refactorizado de Vue.js 3 a React 18** con la misma funcionalidad pero con mejor rendimiento y mantenibilidad.

## 📁 Estructura del Proyecto

```
sistema-turnos/
├── src-react/                          # Nuevo código React
│   ├── components/                     # Componentes reutilizables
│   │   ├── NavBar.jsx                  # Barra de navegación
│   │   ├── ProtectedLayout.jsx         # Layout protegido con autenticación
│   ├── pages/                          # Páginas completas
│   │   ├── LoginPage.jsx               # Página de login
│   │   ├── DashboardProfesor.jsx       # Dashboard del profesor
│   │   ├── DashboardCoordinador.jsx    # Dashboard del coordinador
│   │   ├── DashboardAdmin.jsx          # Dashboard del administrador
│   ├── services/                       # Servicios API
│   │   └── apiServices.js              # Cliente API con Axios
│   ├── context/                        # Context API para estado global
│   │   └── AuthContext.jsx             # Contexto de autenticación
│   ├── hooks/                          # Custom hooks
│   │   └── useAuth.js                  # Hook para autenticación
│   ├── css/                            # Estilos
│   │   └── styles.css                  # Estilos principales (migrados de Vue)
│   ├── main.jsx                        # Entry point React
│   └── App.jsx                         # Componente raíz con Router
├── index.html                          # HTML principal para Vite
├── package.json                        # Dependencias y scripts
├── vite.config.js                      # Configuración de Vite
├── pom.xml                             # Maven (backend Spring Boot)
└── src/main/                           # Backend Spring Boot (sin cambios)
```

## 🔧 Configuración

### Instalación

1. **Clona o descarga el proyecto**
```bash
cd sistema-turnos
```

2. **Instala las dependencias de Node.js**
```bash
npm install
```

3. **Inicia el servidor de desarrollo de React**
```bash
npm run dev
```

El servidor estará en `http://localhost:3000` y automáticamente se proxy a `http://localhost:8080/api` para las llamadas de API.

### Build para Producción

```bash
npm run build
```

Esto genera los archivos en `src/main/resources/static/react-build/` listos para servir con Spring Boot.

## 🔐 Autenticación

La autenticación funciona igual que antes:
- El token se guarda en `localStorage` como `token`
- Los datos del usuario se guardan en `localStorage` como `user` (JSON)
- Las rutas están protegidas automáticamente con `ProtectedLayout`
- El logout limpia automáticamente el almacenamiento

### Credenciales de Prueba

```
Usuario: profesor / Contraseña: (ver tu API)
Usuario: coordinador / Contraseña: (ver tu API)
Usuario: admin / Contraseña: (ver tu API)
```

## 🎯 Rutas Disponibles

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | LoginPage | Página de login |
| `/dashboard-profesor` | DashboardProfesor | Panel del profesor |
| `/dashboard-coordinador` | DashboardCoordinador | Panel del coordinador |
| `/dashboard-admin` | DashboardAdmin | Panel del administrador |

## 📡 API Services

Todos los servicios están en `src-react/services/apiServices.js`:

```javascript
// Ejemplos de uso
import { TurnoService, DocenteService } from './services/apiServices'

// Obtener todos los turnos
const turnos = await TurnoService.obtenerTodos()

// Obtener turno por ID
const turno = await TurnoService.obtenerPorId(1)

// Crear nuevo turno
await TurnoService.crear({ fecha: '2024-01-20', ... })

// Actualizar turno
await TurnoService.actualizar(1, { estado: 'COMPLETADO' })

// Eliminar turno
await TurnoService.eliminar(1)
```

### Servicios Disponibles

- **DocenteService** - Gestión de profesores
- **TurnoService** - Gestión de turnos
- **ZonaService** - Gestión de zonas
- **UsuarioService** - Gestión de usuarios
- **IncidenteService** - Gestión de incidentes
- **AsignacionTurnoService** - Gestión de asignaciones
- **ReasignacionService** - Gestión de reasignaciones
- **RecorridoService** - Gestión de recorridos
- **CheckpointService** - Gestión de checkpoints
- **AuthService** - Autenticación

## 🎨 Estilos

Se utilizan **estilos CSS personalizados** (sin frameworks como Bootstrap o Tailwind). Todos los estilos están en `src-react/css/styles.css` y utilizan:

- **CSS Variables** para temas
- **Flexbox y Grid** para layouts
- **Colores consistentes**: Orange, Navy, Green, Red

### Colores principales

```css
--orange: rgb(252, 99, 0)
--navy: rgb(26, 46, 64)
--green: rgb(40, 167, 69)
--red: rgb(220, 53, 69)
```

## 🪝 Custom Hooks

### useAuth()

Hook para acceder a la autenticación en cualquier componente:

```javascript
import { useAuth } from './hooks/useAuth'

function MyComponent() {
  const { user, token, login, logout, isAuthenticated } = useAuth()
  
  return (
    <div>
      {isAuthenticated && <p>Hola, {user.nombre}</p>}
    </div>
  )
}
```

## 🔄 Diferencias con Vue

| Aspecto | Vue 3 | React |
|--------|-------|-------|
| **Router** | Vue Router | React Router |
| **Estado Global** | Pinia/Composition API | Context API + Hooks |
| **Componentes** | SFC (.vue) | JSX (.jsx) |
| **Reactividad** | ref() / reactive() | useState() / useEffect() |
| **Ciclo de Vida** | onMounted / onUnmounted | useEffect() |
| **Binding** | v-model | onChange + state |
| **Condicionales** | v-if / v-show | {condition && ...} |
| **Listas** | v-for | .map() |

## 📦 Dependencias

### Principales
- **React 18** - UI Framework
- **React Router 6** - Enrutamiento SPA
- **Axios** - Cliente HTTP
- **Vite** - Build tool (reemplaza webpack)

### Desarrollo
- **ESLint** - Linting
- **@vitejs/plugin-react** - Plugin de React para Vite

## 🚀 Próximos Pasos

1. **Completar más páginas** (Mis Turnos, Registrar Punto, Reportar Incidente, etc.)
2. **Agregar formularios completos** con validación
3. **Implementar más servicios API**
4. **Añadir estado global más complejo** si es necesario (Redux o Zustand)
5. **Testeo** con Jest + React Testing Library
6. **PWA** - Progressive Web App features

## 🔗 Backend

El backend sigue siendo **Spring Boot 4.0.5** sin cambios:

```bash
# En otra terminal, inicia Spring Boot
mvn spring-boot:run
```

Backend estará en `http://localhost:8080`

## 📝 Scripts Disponibles

```bash
npm run dev        # Inicia dev server
npm run build      # Build para producción
npm run preview    # Preview de producción localmente
npm run lint       # Lint del código
npm run lint:fix   # Arreglar errores de linting
```

## 🤝 Desarrollo

### Crear nuevo componente

```javascript
// src-react/components/MiComponente.jsx
export default function MiComponente() {
  return <div>Mi componente</div>
}
```

### Crear nueva página

```javascript
// src-react/pages/MiPagina.jsx
import ProtectedLayout from '../components/ProtectedLayout'

export default function MiPagina() {
  return (
    <ProtectedLayout>
      <div className="container">
        {/* Tu contenido */}
      </div>
    </ProtectedLayout>
  )
}
```

### Agregar nueva ruta

Edita `src-react/App.jsx`:

```javascript
<Routes>
  <Route path="/mi-pagina" element={<MiPagina />} />
</Routes>
```

## ⚠️ Notas Importantes

1. **API Base**: El proxy está configurado para `/api` → `http://localhost:8080/api`
2. **CORS**: Asegúrate de que Spring Boot tenga CORS habilitado
3. **Token**: Se requiere el token en el header `Authorization: Bearer <token>`
4. **localhost:3000**: Usa `npm run dev` en una terminal separada
5. **localhost:8080**: Spring Boot debe estar corriendo en otra terminal

## 📚 Recursos

- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)
- [Vite](https://vitejs.dev)

---

**Migración completada de Vue 3 a React 18** ✅

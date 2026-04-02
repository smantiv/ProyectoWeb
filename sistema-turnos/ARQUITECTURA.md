# Arquitectura SPA + REST API - Sistema de Turnos

## Descripción General

Esta es la base de arquitectura transversal que permite que todos los desarrolladores integren sus módulos sin conflictos. El sistema está diseñado como una arquitectura de **Single Page Application (SPA)** con un **backend REST API robusto**.

### Características Principales

- ✅ **REST API completa** con endpoints para todos los recursos
- ✅ **DTOs y modelos JSON** claramente definidos
- ✅ **Capa de servicios** con lógica de negocio centralizada
- ✅ **Cliente API JavaScript** reutilizable y modular
- ✅ **Manejo centralizado de errores** y excepciones
- ✅ **CORS configurado** para desarrollo
- ✅ **Estructura escalable** para nuevos módulos

---

## Estructura del Proyecto

```
sistema-turnos/
├── src/
│   └── main/
│       ├── java/com/example/sistema_turnos/
│       │   ├── controllers/
│       │   │   ├── (Controllers Thymeleaf antigüos)
│       │   │   └── api/                          # ⭐ REST Controllers
│       │   │       ├── UsuarioRestController
│       │   │       ├── DocenteRestController
│       │   │       ├── TurnoRestController
│       │   │       ├── ZonaRestController
│       │   │       ├── AsignacionTurnoRestController
│       │   │       ├── IncidenteRestController
│       │   │       ├── CheckpointRestController
│       │   │       ├── RecorridoRestController
│       │   │       └── ReasignacionRestController
│       │   ├── dtos/                            # ⭐ Modelos JSON
│       │   │   ├── UsuarioDTO
│       │   │   ├── DocenteDTO
│       │   │   ├── TurnoDTO
│       │   │   ├── ZonaDTO
│       │   │   ├── AsignacionTurnoDTO
│       │   │   ├── IncidenteDTO
│       │   │   ├── CheckpointDTO
│       │   │   ├── RecorridoDTO
│       │   │   └── ReasignacionDTO
│       │   ├── services/                        # ⭐ Lógica de negocio
│       │   │   ├── UsuarioService
│       │   │   ├── DocenteService
│       │   │   ├── TurnoService
│       │   │   ├── ZonaService
│       │   │   ├── AsignacionTurnoService
│       │   │   ├── IncidenteService
│       │   │   ├── CheckpointService
│       │   │   ├── RecorridoService
│       │   │   └── ReasignacionService
│       │   ├── entities/                        # Entidades JPA
│       │   ├── repositories/                    # Repositorios
│       │   ├── config/                          # ⭐ Configuraciones
│       │   │   └── CorsConfig
│       │   ├── exceptions/                      # ⭐ Manejo de errores
│       │   │   ├── GlobalExceptionHandler
│       │   │   ├── ResourceNotFoundException
│       │   │   ├── BadRequestException
│       │   │   └── ErrorResponse
│       │   └── SistemaTurnosApplication
│       └── resources/
│           ├── static/
│           │   └── js/
│           │       └── api/                    # ⭐ Cliente API JavaScript
│           │           ├── ApiClient.js
│           │           ├── UsuarioService.js
│           │           ├── DocenteService.js
│           │           ├── TurnoService.js
│           │           ├── ZonaService.js
│           │           ├── AsignacionTurnoService.js
│           │           ├── IncidenteService.js
│           │           ├── CheckpointService.js
│           │           ├── RecorridoService.js
│           │           ├── ReasignacionService.js
│           │           └── ApiServices.js
│           └── templates/
└── ARQUITECTURA.md  # Este archivo
```

---

## Patrones Arquitectónicos

### 1. **DTO Pattern (Data Transfer Objects)**
Los DTOs separan la representación de datos que se envía al cliente de las entidades de base de datos.

```
Entidad JPA (BD) → DTO (JSON) → Cliente
```

**Ventajas:**
- Seguridad (no exponer entidades directamente)
- Flexibilidad (cambiar modelos sin afectar BD)
- Claridad en la API

### 2. **Service Pattern**
La lógica de negocio está centralizada en servicios, separada de controllers.

```
Cliente → Controller → Service → Repository → Base de Datos
```

### 3. **Repository Pattern**
Acceso a bases de datos a través de repositorios JPA, permitiendo cambiar implementaciones.

### 4. **Exception Handling**
Manejo centralizado de excepciones con respuestas uniformes.

---

## REST API Endpoints

### Base URL
```
http://localhost:8080/api/v1
```

### Usuarios
```
GET    /usuarios                    # Obtener todos
GET    /usuarios/{id}               # Obtener por ID
GET    /usuarios/email/{email}      # Obtener por email
GET    /usuarios/rol/{rol}          # Obtener por rol
POST   /usuarios                    # Crear
PUT    /usuarios/{id}               # Actualizar
DELETE /usuarios/{id}               # Eliminar
```

### Docentes
```
GET    /docentes                    # Obtener todos
GET    /docentes/{id}               # Obtener por ID
GET    /docentes/codigo/{codigo}    # Obtener por código
GET    /docentes/usuario/{usuarioId}# Obtener por usuario
POST   /docentes                    # Crear
PUT    /docentes/{id}               # Actualizar
DELETE /docentes/{id}               # Eliminar
```

### Turnos
```
GET    /turnos                              # Obtener todos
GET    /turnos/{id}                         # Obtener por ID
GET    /turnos/fecha/{fecha}                # Obtener por fecha (YYYY-MM-DD)
GET    /turnos/estado/{estado}              # Obtener por estado
GET    /turnos/zona/{zonaId}                # Obtener por zona
GET    /turnos/fecha/{fecha}/estado/{estado}# Filtro complejo
POST   /turnos                              # Crear
PUT    /turnos/{id}                         # Actualizar
DELETE /turnos/{id}                         # Eliminar
```

### Zonas
```
GET    /zonas                       # Obtener todas
GET    /zonas/{id}                  # Obtener por ID
GET    /zonas/nombre/{nombre}       # Obtener por nombre
POST   /zonas                       # Crear
PUT    /zonas/{id}                  # Actualizar
DELETE /zonas/{id}                  # Eliminar
```

### Asignaciones de Turnos
```
GET    /asignaciones-turnos               # Obtener todas
GET    /asignaciones-turnos/{id}          # Obtener por ID
GET    /asignaciones-turnos/docente/{docenteId}  # Por docente
POST   /asignaciones-turnos               # Crear
PUT    /asignaciones-turnos/{id}          # Actualizar
DELETE /asignaciones-turnos/{id}          # Eliminar
```

### Incidentes
```
GET    /incidentes                         # Obtener todos
GET    /incidentes/{id}                    # Obtener por ID
GET    /incidentes/asignacion/{asignacionId}  # Por asignación
GET    /incidentes/tipo/{tipo}             # Por tipo
POST   /incidentes                         # Crear
PUT    /incidentes/{id}                    # Actualizar
DELETE /incidentes/{id}                    # Eliminar
```

### Checkpoints
```
GET    /checkpoints                 # Obtener todos
GET    /checkpoints/{id}            # Obtener por ID
GET    /checkpoints/nombre/{nombre} # Obtener por nombre
POST   /checkpoints                 # Crear
PUT    /checkpoints/{id}            # Actualizar
DELETE /checkpoints/{id}            # Eliminar
```

### Recorridos
```
GET    /recorridos                          # Obtener todos
GET    /recorridos/{id}                     # Obtener por ID
GET    /recorridos/asignacion/{asignacionId}   # Por asignación
GET    /recorridos/checkpoint/{checkpointId}   # Por checkpoint
POST   /recorridos                          # Crear
PUT    /recorridos/{id}                     # Actualizar
DELETE /recorridos/{id}                     # Eliminar
```

### Reasignaciones
```
GET    /reasignaciones                          # Obtener todas
GET    /reasignaciones/{id}                     # Obtener por ID
GET    /reasignaciones/docente/{docenteId}     # Por docente
GET    /reasignaciones/estado/{estado}         # Por estado
GET    /reasignaciones/docente/{docenteId}/estado/{estado}  # Filtro
POST   /reasignaciones                          # Crear
PUT    /reasignaciones/{id}                     # Actualizar
DELETE /reasignaciones/{id}                     # Eliminar
```

---

## Modelos JSON (DTOs)

### UsuarioDTO
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "rol": "docente",
  "activo": true
}
```

### TurnoDTO
```json
{
  "id": 1,
  "fecha": "2024-03-24",
  "horaInicio": "08:00:00",
  "horaFin": "12:00:00",
  "estado": "disponible",
  "zonaId": 1
}
```

### AsignacionTurnoDTO
```json
{
  "id": 1,
  "horaCheckin": "2024-03-24T08:15:00",
  "horaCierre": "2024-03-24T12:30:00",
  "calificacionLimpieza": 8,
  "estadoCobertura": "completa",
  "docenteId": 1,
  "turnoId": 1
}
```

### IncidenteDTO
```json
{
  "id": 1,
  "tipo": "rotura",
  "severidad": "media",
  "descripcion": "Vidrio roto en la puerta principal",
  "fechaHora": "2024-03-24T10:30:00",
  "asignacionId": 1
}
```

---

## Cliente API JavaScript

### Instalación  

En HTML, cargar los scripts en orden:

```html
<!-- Cliente base -->
<script src="/js/api/ApiClient.js"></script>

<!-- Servicios individuales -->
<script src="/js/api/UsuarioService.js"></script>
<script src="/js/api/TurnoService.js"></script>
<script src="/js/api/DocenteService.js"></script>
<script src="/js/api/ZonaService.js"></script>
<script src="/js/api/AsignacionTurnoService.js"></script>
<script src="/js/api/IncidenteService.js"></script>
<script src="/js/api/CheckpointService.js"></script>
<script src="/js/api/RecorridoService.js"></script>
<script src="/js/api/ReasignacionService.js"></script>

<!-- Índice centralizado (recomendado) -->
<script src="/js/api/ApiServices.js"></script>
```

### Uso Básico

```javascript
// Obtener todos los turnos
const turnos = await ApiServices.turnoService.obtenerTodos();

// Obtener turno por ID
const turno = await ApiServices.turnoService.obtenerPorId(1);

// Crear nuevo turno
const nuevoTurno = await ApiServices.turnoService.crear({
  fecha: '2024-03-24',
  horaInicio: '08:00:00',
  horaFin: '12:00:00',
  estado: 'disponible',
  zonaId: 1
});

// Actualizar turno
const turnoActualizado = await ApiServices.turnoService.actualizar(1, {
  estado: 'asignado'
});

// Eliminar turno
await ApiServices.turnoService.eliminar(1);
```

### Manejo de Errores

```javascript
try {
  const turno = await ApiServices.turnoService.obtenerPorId(999);
} catch (error) {
  console.error('Error:', error.message);
  console.error('Código:', error.code);
  console.error('Detalles:', error.responseData);
}
```

### Métodos Especiales

```javascript
// Servicios de Docente
await ApiServices.docenteService.obtenerPorCodigo('DOC001');
await ApiServices.docenteService.obtenerPorUsuario(1);

// Servicios de Turno
await ApiServices.turnoService.obtenerPorFecha('2024-03-24');
await ApiServices.turnoService.obtenerPorEstado('disponible');
await ApiServices.turnoService.obtenerDisponibles(); // Helper

// Servicios de AsignacionTurno
await ApiServices.asignacionTurnoService.registrarCheckin(1, new Date());
await ApiServices.asignacionTurnoService.registrarCierre(1, new Date());

// Servicios de Incidente
await ApiServices.incidenteService.reportar(1, 'rotura', 'alta', 'Descripción');

// Servicios de Recorrido
await ApiServices.recorridoService.registrarPaso(1, 1);

// Servicios de Reasignación
await ApiServices.reasignacionService.solicitarReasignacion(1, 'Motivo');
await ApiServices.reasignacionService.obtenerPendientes();
await ApiServices.reasignacionService.aprobar(1);
await ApiServices.reasignacionService.rechazar(1);
```

---

## Cómo Integrar Nuevos Módulos

### Paso 1: Crear Entidad JPA
```java
@Entity
public class MiEntidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // ... propiedades
}
```

### Paso 2: Crear DTO
```java
public class MiEntidadDTO {
    private Long id;
    // ... propiedades
}
```

### Paso 3: Crear Repositorio
```java
@Repository
public interface MiEntidadRepository extends JpaRepository<MiEntidad, Long> {
    // Métodos personalizados
}
```

### Paso 4: Crear Servicio
```java
@Service
public class MiEntidadService {
    @Autowired
    private MiEntidadRepository repository;
    
    // Métodos CRUD
}
```

### Paso 5: Crear REST Controller
```java
@RestController
@RequestMapping("/api/v1/mi-entidad")
@CrossOrigin(origins = "*")
public class MiEntidadRestController {
    @Autowired
    private MiEntidadService service;
    
    // Endpoints REST
}
```

### Paso 6: Crear Cliente JavaScript (opcional)
```javascript
class MiEntidadService {
    constructor(apiClient) {
        this.apiClient = apiClient || new ApiClient();
        this.endpoint = '/mi-entidad';
    }
    
    async obtenerTodos() {
        return (await this.apiClient.get(this.endpoint)).data || [];
    }
}
```

---

## Códigos de Estado HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| **200** | OK | Solicitud exitosa |
| **201** | Created | Recurso creado exitosamente |
| **204** | No Content | Eliminación exitosa |
| **400** | Bad Request | Datos inválidos |
| **404** | Not Found | Recurso no encontrado |
| **500** | Internal Server Error | Error del servidor |

---

## Respuesta de Error Estándar

```json
{
  "status": 404,
  "message": "Usuario no encontrado",
  "error": "Recurso no encontrado",
  "timestamp": "2024-03-24T15:30:45",
  "path": "/api/v1/usuarios/999"
}
```

---

## Configuración CORS

Por defecto, está configurado para:
- Permitir todos los orígenes (`*`)
- Permitir métodos: GET, POST, PUT, DELETE, OPTIONS, PATCH
- Permitir todos los headers
- Max age: 3600 segundos

En producción, modificar `CorsConfig.java` para restringir orígenes.

---

## Variables de Entorno

En `application.properties`:
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/sistema_turnos
spring.datasource.username=root
spring.datasource.password=1234
spring.jpa.hibernate.ddl-auto=create
```

---

## Próximos Pasos

1. **Módulos de UI**: Crear vistas HTML/Vue/React para consumir esta API
2. **Autenticación**: Implementar JWT o OAuth2
3. **Autorización**: Roles y permisos basados en usuarios
4. **Tests**: Unit tests y tests de integración
5. **Documentación Swagger**: Documentar automáticamente la API

---

## Contacto y Soporte

Para preguntas sobre la arquitectura o cómo integrar nuevos módulos, contacatar al equipo de arquitectura.

**Esta es la base transversal que permite que todos los módulos se integren sin conflictos.**

# 📚 ARQUITECTURA COMPLETA - Sistema de Turnos
**Versión 1.0 - April 2026**

**⭐ Guía integral para desarrolladores: setup, arquitectura, API, ejecución y expansión**

---

## 📖 Tabla de Contenidos

1. [Descripción Gen eral](#descripción-general)
2. [Setup Inicial](#setup-inicial)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Patrones Arquitectónicos](#patrones-arquitectónicos)
5. [Ejecución de la Aplicación](#ejecución-de-la-aplicación)
6. [REST API Completa](#rest-api-completa)
7. [Cliente API JavaScript](#cliente-api-javascript)
8. [Cómo Agregar Nuevas Funcionalidades](#cómo-agregar-nuevas-funcionalidades)
9. [Validación y Testing](#validación-y-testing)
10. [Solución de Problemas](#solución-de-problemas)
11. [Mejores Prácticas](#mejores-prácticas)
12. [Roadmap Futuro](#roadmap-fut       uro)

---

## Descripción General

### ¿Qué es Sistema de Turnos?

Sistema de Turnos es una aplicación web para gestionar turnos de vigilancia en instituciones educativas. Está construida como una **Single Page Application (SPA)** con arquitectura **REST API** moderna.

### Características Principales

- ✅ **REST API completa** con endpoints versionados (`/api/v1/*`)
- ✅ **DTOs y modelos JSON** claramente definidos
- ✅ **Capa de servicios** con lógica de negocio centralizada
- ✅ **Cliente API JavaScript** reutilizable y modular
- ✅ **Manejo centralizado de errores** y excepciones
- ✅ **CORS configurado** para desarrollo
- ✅ **Estructura escalable** para nuevos módulos
- ✅ **Vistas HTML con Thymeleaf** para servidor
- ✅ **Base de datos MySQL** con Hibernate ORM

### Stack Tecnológico

**Backend:**
- Java 21
- Spring Boot 4.0.5
- Spring Data JPA
- Hibernate ORM
- MySQL 8.0

**Frontend:**
- HTML5 + Thymeleaf
- CSS3
- JavaScript (ES6+)
- Bootstrap (opcional)

**DevOps:**
- Maven
- Git

---

## Setup Inicial

### Prerrequisitos

```bash
# Java 21
java --version  # Debe mostrar: openjdk 21.0.10

# Maven
mvn --version   # Debe mostrar: Apache Maven 3.x.x

# MySQL 8.0
mysql --version # Debe mostrar: Server version 8.0.x

# Git
git --version   # Debe mostrar: git version x.x.x
```

### Instalación

#### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/sistema-turnos.git
cd sistema-turnos
```

#### 2. Crear Base de Datos
```bash
mysql -u root -p
```

```sql
CREATE DATABASE sistema_turnos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sistema_turnos;
```

#### 3. Verificar Configuración de Base de Datos

Editar `src/main/resources/application.properties`:

```properties
# Puerto
server.port=8080

# Base de datos MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/sistema_turnos
spring.datasource.username=root
spring.datasource.password=1234
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=create  # Crear tablas automáticamente
spring.jpa.show-sql=true
spring.jpa.defer-datasource-initialization=true

# Thymeleaf
spring.thymeleaf.enabled=true
spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.suffix=.html
```

#### 4. Compilar Proyecto
```bash
./mvnw clean install
# En Windows:
mvnw.cmd clean install
```

#### 5. Copiar Assets (CRÍTICO)
```bash
# Linux/Mac
cp -r src/main/resources/templates/assets/* src/main/resources/static/assets/

# Windows PowerShell
Copy-Item -Path "src\main\resources\templates\assets\*" `
          -Destination "src\main\resources\static\assets\" `
          -Force
```

---

## Estructura del Proyecto

### Árbol de Directorios Completo

```
sistema-turnos/
│
├── src/main/java/com/example/sistema_turnos/
│   ├── SistemaTurnosApplication.java           # 🚀 Clase principal
│   │
│   ├── controllers/
│   │   ├── ViewController.java                 # 🎯 MVC: Inicio/dashboards
│   │   ├── PantallaController.java             # 🎯 MVC: Todas las vistas (24+ rutas)
│   │   ├── ProfesorController.java             # ⚠️  DESACTIVADO (redundante)
│   │   ├── TurnoController.java                # ⚠️  DESACTIVADO (redundante)
│   │   ├── PerfilController.java               # ⚠️  DESACTIVADO (redundante)
│   │   └── api/                                # 📡 REST Controllers
│   │       ├── UsuarioRestController.java
│   │       ├── DocenteRestController.java
│   │       ├── TurnoRestController.java
│   │       ├── ZonaRestController.java
│   │       ├── AsignacionTurnoRestController.java
│   │       ├── IncidenteRestController.java
│   │       ├── CheckpointRestController.java
│   │       ├── RecorridoRestController.java
│   │       └── ReasignacionRestController.java
│   │
│   ├── services/                               # 💼 Lógica de negocio
│   │   ├── UsuarioService.java
│   │   ├── DocenteService.java
│   │   ├── TurnoService.java
│   │   ├── ZonaService.java
│   │   ├── AsignacionTurnoService.java
│   │   ├── IncidenteService.java
│   │   ├── CheckpointService.java
│   │   ├── RecorridoService.java
│   │   └── ReasignacionService.java
│   │
│   ├── repositories/                           # 🗄️  Acceso a BD
│   │   ├── UsuarioRepository.java
│   │   ├── DocenteRepository.java
│   │   ├── TurnoRepository.java
│   │   ├── ZonaRepository.java
│   │   ├── AsignacionTurnoRepository.java
│   │   ├── IncidenteRepository.java
│   │   ├── CheckpointRepository.java
│   │   ├── RecorridoRepository.java
│   │   └── ReasignacionRepository.java
│   │
│   ├── entities/                               # 📦 Modelos JPA
│   │   ├── Usuario.java
│   │   ├── Docente.java
│   │   ├── Turno.java
│   │   ├── Zona.java
│   │   ├── AsignacionTurno.java
│   │   ├── Incidente.java
│   │   ├── Checkpoint.java
│   │   ├── Recorrido.java
│   │   └── Reasignacion.java
│   │
│   ├── dtos/                                   # 📋 Modelos JSON/Transfer
│   │   ├── UsuarioDTO.java
│   │   ├── DocenteDTO.java
│   │   ├── TurnoDTO.java
│   │   ├── ZonaDTO.java
│   │   ├── AsignacionTurnoDTO.java
│   │   ├── IncidenteDTO.java
│   │   ├── CheckpointDTO.java
│   │   ├── RecorridoDTO.java
│   │   └── ReasignacionDTO.java
│   │
│   ├── config/                                 # ⚙️  Configuraciones
│   │   └── CorsConfig.java
│   │
│   └── exceptions/                             # 🚨 Manejo de errores
│       ├── GlobalExceptionHandler.java
│       ├── ResourceNotFoundException.java
│       ├── BadRequestException.java
│       └── ErrorResponse.java
│
├── src/main/resources/
│   ├── application.properties                  # 🔧 Configuración
│   ├── data.sql                                # 📊 Datos iniciales
│   │
│   ├── static/                                 # 🎨 Recursos estáticos
│   │   ├── css/
│   │   │   └── styles.css
│   │   ├── js/
│   │   │   ├── app.js
│   │   │   └── api/                           # 📞 Cliente API JS
│   │   │       ├── ApiClient.js
│   │   │       ├── UsuarioService.js
│   │   │       ├── DocenteService.js
│   │   │       ├── TurnoService.js
│   │   │       ├── ZonaService.js
│   │   │       ├── AsignacionTurnoService.js
│   │   │       ├── IncidenteService.js
│   │   │       ├── CheckpointService.js
│   │   │       ├── RecorridoService.js
│   │   │       ├── ReasignacionService.js
│   │   │       └── ApiServices.js
│   │   └── assets/
│   │       └── logo-sfr.png
│   │
│   └── templates/                              # 📄 Vistas HTML
│       ├── index.html
│       ├── dashboard-profesor.html
│       ├── dashboard-coordinador.html
│       ├── dashboard-admin.html
│       ├── gestion-turnos.html
│       ├── gestion-profesores.html
│       ├── gestion-incidentes.html
│       ├── gestion-zonas.html
│       ├── mis-turnos.html
│       ├── perfil-profesor.html
│       ├── perfil-coordinador.html
│       ├── perfil-cuenta.html
│       ├── analiticas.html
│       ├── soporte.html
│       ├── contacto.html
│       ├── [+ 9 vistas más]
│       └── fragments/                         # 🔄 Componentes reutilizables
│           ├── navbar.html
│           ├── footer.html
│           ├── head.html
│           ├── scripts.html
│           └── sidebar.html
│
├── pom.xml                                     # 📦 Dependencias Maven
├── mvnw / mvnw.cmd                             # 🎯 Maven Wrapper
├── ARQUITECTURA_COMPLETA.md                    # 📖 Este archivo
├── README.md                                   # ₍ Descripción proyecto
└── .gitignore                                  # 🚫 Archivos ignorados

```

### Carpetas Importantes

| Carpeta | Función | Qué va aquí |
|---------|---------|-----------|
| `controllers/` | Maneja HTTP requests | Nuevos controladores MVC/REST |
| `services/` | Lógica de negocio | Nuevos servicios de negocios |
| `repositories/` | Acceso a BD | Métodos de consulta SQL |
| `entities/` | Modelos Base de Datos | Nuevas tablas |
| `dtos/` | Modelos JSON | Nuevos DTOs para API |
| `config/` | Configuraciones | CORS, Security, etc. |
| `exceptions/` | Errores | Nuevas excepciones |
| `templates/` | Vistas HTML | Nuevas páginas |
| `static/` | CSS, JS, imágenes | Recursos del cliente |

---

## Patrones Arquitectónicos

### 1. DTO Pattern (Data Transfer Objects)

Los DTOs separan la representación de datos enviada al cliente de las entidades de base de datos.

```
Entidad JPA (BD) → DTO (JSON) → REST API → Cliente JavaScript
```

**Ventajas:**
- ✅ Seguridad (no exponer entidades directamente)
- ✅ Flexibilidad (cambiar modelos sin afectar BD)
- ✅ Claridad en la API
- ✅ Validación de entrada

**Ejemplo:**

```java
// Entidad JPA (Base de Datos)
@Entity
@Table(name = "usuario")
public class Usuario {
    @Id private Long id;
    private String nombre;
    private String email;
    private String password;  // ❌ NUNCA exponer en DTO
}

// DTO (API REST)
public class UsuarioDTO {
    private Long id;
    private String nombre;
    private String email;
    // password NO se incluye aquí
}
```

### 2. Service Pattern

La lógica de negocio está centralizada en servicios, separada de controllers.

```
Cliente HTTP → Controller → Service → Repository → Base de Datos
                                    ↓
                           Reglas de negocio
                           Transformaciones
                           Validaciones
```

**Ventajas:**
- ✅ Reutilización (llamar desde múltiples controllers)
- ✅ Testabilidad (mockear servicios fácilmente)
- ✅ Mantenibilidad (lógica en un lugar)

**Ejemplo:**

```java
// ❌ MAL: Controller con lógica
@PostMapping
public TurnoDTO crear(@RequestBody TurnoDTO dto) {
    // Validación aquí
    // Transformación aquí
    // Lógica de negocio aquí
}

// ✅ BIEN: Controller simple, lógica en Service
@PostMapping
public TurnoDTO crear(@RequestBody TurnoDTO dto) {
    return turnoService.crear(dto);
}

// Service con lógica
@Service
public class TurnoService {
    public TurnoDTO crear(TurnoDTO dto) {
        validarDatos(dto);
        Turno turno = transformarDTOaEntidad(dto);
        aplicarReglasDeTurno(turno);
        turno = turnoRepository.save(turno);
        return transformarEntidadADTO(turno);
    }
}
```

### 3. Repository Pattern

Acceso a bases de datos a través de repositorios JPA.

```java
public interface TurnoRepository extends JpaRepository<Turno, Long> {
    List<Turno> findByZonaId(Long zonaId);
    List<Turno> findByFecha(LocalDate fecha);
    List<Turno> findByEstado(String estado);
}
```

### 4. Exception Handling (Manejo Centralizado de Errores)

Todas las excepciones se manejan en un lugar centralizado.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException e) {
        return ResponseEntity.status(404).body(new ErrorResponse(e.getMessage()));
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(IllegalArgumentException e) {
        return ResponseEntity.status(400).body(new ErrorResponse(e.getMessage()));
    }
}
```

---

## Ejecución de la Aplicación

### Opción 1: Maven (Terminal)

```bash
cd sistema-turnos

# Opción A: Ejecutar directamente
./mvnw spring-boot:run

# Opción B: En Windows
mvnw.cmd spring-boot:run

# Opción C: Compilar y ejecutar
./mvnw clean package
java -jar target/sistema-turnos-0.0.1-SNAPSHOT.jar
```

### Opción 2: IDE (IntelliJ IDEA)

1. Click derecho en `SistemaTurnosApplication.java`
2. Click en "Run 'SistemaTurnosApplication'"
3. Esperar a que inicie

### Opción 3: IDE (Eclipse)

1. Click derecho en el proyecto
2. Run As → Spring Boot App

### Verificación de Startup

Deberías ver en la consola:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

 :: Spring Boot ::                (v4.0.5)

2026-04-03T00:43:11.725-05:00  INFO ... Started SistemaTurnosApplication in X.XXX seconds
```

**✅ Aplicación lista en `http://localhost:8080`**

---

## REST API Completa

### Base URL

```
http://localhost:8080/api/v1
```

### Headers Requeridos

```
Content-Type: application/json
Accept: application/json
```

---

### 👥 Usuarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/usuarios` | Obtener todos |
| GET | `/usuarios/{id}` | Obtener por ID |
| GET | `/usuarios/email/{email}` | Obtener por email |
| GET | `/usuarios/rol/{rol}` | Obtener por rol |
| POST | `/usuarios` | Crear nuevo |
| PUT | `/usuarios/{id}` | Actualizar |
| DELETE | `/usuarios/{id}` | Eliminar |

**Ejemplo:**
```bash
curl -X GET http://localhost:8080/api/v1/usuarios
curl -X POST http://localhost:8080/api/v1/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","email":"juan@example.com","rol":"docente"}'
```

---

### 👨‍🏫 Docentes

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/docentes` | Obtener todos |
| GET | `/docentes/{id}` | Obtener por ID |
| GET | `/docentes/codigo/{codigo}` | Obtener por código |
| GET | `/docentes/usuario/{usuarioId}` | Obtener por usuario |
| POST | `/docentes` | Crear nuevo |
| PUT | `/docentes/{id}` | Actualizar |
| DELETE | `/docentes/{id}` | Eliminar |

---

### 📅 Turnos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/turnos` | Obtener todos |
| GET | `/turnos/{id}` | Obtener por ID |
| GET | `/turnos/fecha/{fecha}` | Obtener por fecha (YYYY-MM-DD) |
| GET | `/turnos/estado/{estado}` | Obtener por estado |
| GET | `/turnos/zona/{zonaId}` | Obtener por zona |
| POST | `/turnos` | Crear nuevo |
| PUT | `/turnos/{id}` | Actualizar |
| DELETE | `/turnos/{id}` | Eliminar |

---

### 🗺️ Zonas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/zonas` | Obtener todas |
| GET | `/zonas/{id}` | Obtener por ID |
| GET | `/zonas/nombre/{nombre}` | Obtener por nombre |
| POST | `/zonas` | Crear nueva |
| PUT | `/zonas/{id}` | Actualizar |
| DELETE | `/zonas/{id}` | Eliminar |

---

### 🎯 Asignaciones de Turnos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/asignaciones-turnos` | Obtener todas |
| GET | `/asignaciones-turnos/{id}` | Obtener por ID |
| GET | `/asignaciones-turnos/docente/{docenteId}` | Por docente |
| POST | `/asignaciones-turnos` | Crear nueva |
| PUT | `/asignaciones-turnos/{id}` | Actualizar |
| DELETE | `/asignaciones-turnos/{id}` | Eliminar |

---

### ⚠️ Incidentes

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/incidentes` | Obtener todos |
| GET | `/incidentes/{id}` | Obtener por ID |
| GET | `/incidentes/asignacion/{asignacionId}` | Por asignación |
| GET | `/incidentes/tipo/{tipo}` | Por tipo |
| POST | `/incidentes` | Crear nuevo |
| PUT | `/incidentes/{id}` | Actualizar |
| DELETE | `/incidentes/{id}` | Eliminar |

---

### ✅ Checkpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/checkpoints` | Obtener todos |
| GET | `/checkpoints/{id}` | Obtener por ID |
| GET | `/checkpoints/nombre/{nombre}` | Por nombre |
| POST | `/checkpoints` | Crear nuevo |
| PUT | `/checkpoints/{id}` | Actualizar |
| DELETE | `/checkpoints/{id}` | Eliminar |

---

### 🛤️ Recorridos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/recorridos` | Obtener todos |
| GET | `/recorridos/{id}` | Obtener por ID |
| GET | `/recorridos/asignacion/{asignacionId}` | Por asignación |
| GET | `/recorridos/checkpoint/{checkpointId}` | Por checkpoint |
| POST | `/recorridos` | Crear nuevo |
| PUT | `/recorridos/{id}` | Actualizar |
| DELETE | `/recorridos/{id}` | Eliminar |

---

### 🔄 Reasignaciones

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/reasignaciones` | Obtener todas |
| GET | `/reasignaciones/{id}` | Obtener por ID |
| GET | `/reasignaciones/docente/{docenteId}` | Por docente |
| GET | `/reasignaciones/estado/{estado}` | Por estado |
| POST | `/reasignaciones` | Crear nueva |
| PUT | `/reasignaciones/{id}` | Actualizar |
| DELETE | `/reasignaciones/{id}` | Eliminar |

---

## Cliente API JavaScript

### Cómo Usar desde HTML

En tus plantillas HTML, cargar los scripts:

```html
<!-- Cliente base -->
<script src="/js/api/ApiClient.js"></script>

<!-- Servicios individuales (o usar ApiServices.js para todos)-->
<script src="/js/api/ApiServices.js"></script>
```

### Ejemplos de Uso

#### Obtener Todos los Turnos
```javascript
TurnoService.obtenerTodos().then(turnos => {
    console.log('Turnos:', turnos);
}).catch(error => {
    console.error('Error:', error);
});
```

#### Obtener Turno por ID
```javascript
TurnoService.obtenerPorId(1).then(turno => {
    console.log('Turno:', turno);
});
```

#### Crear Nuevo Turno
```javascript
const nuevoTurno = {
    fecha: "2024-03-24",
    horaInicio: "08:00:00",
    horaFin: "12:00:00",
    estado: "disponible",
    zonaId: 1
};

TurnoService.crear(nuevoTurno).then(turno => {
    console.log('Turno creado:', turno);
});
```

#### Actualizar Turno
```javascript
const turnoActualizado = {
    ...turno,
    estado: "asignado"
};

TurnoService.actualizar(1, turnoActualizado).then(turno => {
    console.log('Turno actualizado:', turno);
});
```

#### Eliminar Turno
```javascript
TurnoService.eliminar(1).then(() => {
    console.log('Turno eliminado');
});
```

### Servicios Disponibles

```javascript
// Usuarios
UsuarioService.obtenerTodos()
UsuarioService.obtenerPorId(id)
UsuarioService.obtenerPorEmail(email)
UsuarioService.crear(data)
UsuarioService.actualizar(id, data)
UsuarioService.eliminar(id)

// Docentes
DocenteService.obtenerTodos()
DocenteService.obtenerPorId(id)
DocenteService.obtenerPorCodigo(codigo)
DocenteService.crear(data)
DocenteService.actualizar(id, data)
DocenteService.eliminar(id)

// Turnos
TurnoService.obtenerTodos()
TurnoService.obtenerPorId(id)
TurnoService.obtenerPorFecha(fecha)
TurnoService.obtenerPorEstado(estado)
TurnoService.obtenerPorZona(zonaId)
TurnoService.crear(data)
TurnoService.actualizar(id, data)
TurnoService.eliminar(id)

// Zonas
ZonaService.obtenerTodos()
ZonaService.obtenerPorId(id)
ZonaService.crear(data)
ZonaService.actualizar(id, data)
ZonaService.eliminar(id)

// ... Y más para otros recursos
```

---

## Cómo Agregar Nuevas Funcionalidades

### Paso 1: Crear la Entidad JPA

Archivo: `src/main/java/com/example/sistema_turnos/entities/MiEntidad.java`

```java
package com.example.sistema_turnos.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "mi_tabla")
public class MiEntidad {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column
    private String descripcion;
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
```

### Paso 2: Crear el DTO

Archivo: `src/main/java/com/example/sistema_turnos/dtos/MiEntidadDTO.java`

```java
package com.example.sistema_turnos.dtos;

public class MiEntidadDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
```

### Paso 3: Crear el Repositorio

Archivo: `src/main/java/com/example/sistema_turnos/repositories/MiEntidadRepository.java`

```java
package com.example.sistema_turnos.repositories;

import com.example.sistema_turnos.entities.MiEntidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MiEntidadRepository extends JpaRepository<MiEntidad, Long> {
    
    // Métodos de búsqueda personalizados
    List<MiEntidad> findByNombre(String nombre);
    
    // Más métodos según necesites
}
```

### Paso 4: Crear el Servicio

Archivo: `src/main/java/com/example/sistema_turnos/services/MiEntidadService.java`

```java
package com.example.sistema_turnos.services;

import com.example.sistema_turnos.dtos.MiEntidadDTO;
import com.example.sistema_turnos.entities.MiEntidad;
import com.example.sistema_turnos.repositories.MiEntidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MiEntidadService {
    
    @Autowired
    private MiEntidadRepository repository;
    
    // Obtener todos
    public List<MiEntidadDTO> obtenerTodos() {
        return repository.findAll()
            .stream()
            .map(this::transformarADTO)
            .collect(Collectors.toList());
    }
    
    // Obtener por ID
    public MiEntidadDTO obtenerPorId(Long id) {
        return repository.findById(id)
            .map(this::transformarADTO)
            .orElseThrow(() -> new RuntimeException("No encontrado"));
    }
    
    // Crear
    public MiEntidadDTO crear(MiEntidadDTO dto) {
        MiEntidad entidad = new MiEntidad();
        entidad.setNombre(dto.getNombre());
        entidad.setDescripcion(dto.getDescripcion());
        entidad = repository.save(entidad);
        return transformarADTO(entidad);
    }
    
    // Actualizar
    public MiEntidadDTO actualizar(Long id, MiEntidadDTO dto) {
        MiEntidad entidad = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("No encontrado"));
        entidad.setNombre(dto.getNombre());
        entidad.setDescripcion(dto.getDescripcion());
        entidad = repository.save(entidad);
        return transformarADTO(entidad);
    }
    
    // Eliminar
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
    
    // Transformar a DTO
    private MiEntidadDTO transformarADTO(MiEntidad entidad) {
        MiEntidadDTO dto = new MiEntidadDTO();
        dto.setId(entidad.getId());
        dto.setNombre(entidad.getNombre());
        dto.setDescripcion(entidad.getDescripcion());
        return dto;
    }
}
```

### Paso 5: Crear el Controlador REST

Archivo: `src/main/java/com/example/sistema_turnos/controllers/api/MiEntidadRestController.java`

```java
package com.example.sistema_turnos.controllers.api;

import com.example.sistema_turnos.dtos.MiEntidadDTO;
import com.example.sistema_turnos.services.MiEntidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mi-entidades")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MiEntidadRestController {
    
    @Autowired
    private MiEntidadService service;
    
    @GetMapping
    public ResponseEntity<List<MiEntidadDTO>> obtenerTodos() {
        return ResponseEntity.ok(service.obtenerTodos());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MiEntidadDTO> obtenerPorId(@PathVariable Long id) {
        try {
            MiEntidadDTO dto = service.obtenerPorId(id);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<MiEntidadDTO> crear(@RequestBody MiEntidadDTO dto) {
        try {
            MiEntidadDTO creado = service.crear(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(creado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<MiEntidadDTO> actualizar(@PathVariable Long id, @RequestBody MiEntidadDTO dto) {
        try {
            MiEntidadDTO actualizado = service.actualizar(id, dto);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            service.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
```

### Paso 6: Crear Cliente JavaScript (Opcional)

Archivo: `src/main/resources/static/js/api/MiEntidadService.js`

```javascript
const MiEntidadService = (() => {
    const API_BASE = '/api/v1/mi-entidades';
    
    return {
        obtenerTodos() {
            return ApiClient.get(API_BASE);
        },
        
        obtenerPorId(id) {
            return ApiClient.get(`${API_BASE}/${id}`);
        },
        
        crear(data) {
            return ApiClient.post(API_BASE, data);
        },
        
        actualizar(id, data) {
            return ApiClient.put(`${API_BASE}/${id}`, data);
        },
        
        eliminar(id) {
            return ApiClient.delete(`${API_BASE}/${id}`);
        }
    };
})();
```

### Paso 7: Agregar a ApiServices.js

En `src/main/resources/static/js/api/ApiServices.js`, agregar:

```javascript
// Al final del archivo
// <script src="/js/api/MiEntidadService.js"></script>
```

### Checklist de Implementación

- [ ] Crear Entidad JPA
- [ ] Crear DTO
- [ ] Crear Repository
- [ ] Crear Service
- [ ] Crear REST Controller
- [ ] Crear cliente JavaScript (opcional)
- [ ] Compilar: `./mvnw clean compile`
- [ ] Ejecutar: `./mvnw spring-boot:run`
- [ ] Probar: `curl http://localhost:8080/api/v1/mi-entidades`

---

## Validación y Testing

### Verificar Servidor Iniciado

En los logs deberías ver:

```
2026-04-03T00:43:11.725-05:00  INFO ... Started SistemaTurnosApplication in 8.134 seconds
```

### Probar URLs MVC

```bash
# Página de inicio
curl http://localhost:8080/

# Dashboards
curl http://localhost:8080/dashboard-profesor
curl http://localhost:8080/dashboard-coordinador
curl http://localhost:8080/dashboard-admin

# Otras vistas
curl http://localhost:8080/turnos
curl http://localhost:8080/profesores
curl http://localhost:8080/soporte
```

### Probar REST API

```bash
# Obtener todos los turnos
curl -X GET http://localhost:8080/api/v1/turnos

# Crear nuevo turno
curl -X POST http://localhost:8080/api/v1/turnos \
  -H "Content-Type: application/json" \
  -d '{
    "fecha": "2024-03-24",
    "horaInicio": "08:00:00",
    "horaFin": "12:00:00",
    "estado": "disponible",
    "zonaId": 1
  }'

# Obtener por ID
curl -X GET http://localhost:8080/api/v1/turnos/1

# Actualizar
curl -X PUT http://localhost:8080/api/v1/turnos/1 \
  -H "Content-Type: application/json" \
  -d '{"estado": "asignado"}'

# Eliminar
curl -X DELETE http://localhost:8080/api/v1/turnos/1
```

### Verificar Recursos Estáticos

Abre DevTools (F12) → Network tab:

- ✅ `styles.css` debe devolver **200 OK**
- ✅ `logo-sfr.png` debe devolver **200 OK**
- ✅ `app.js` debe devolver **200 OK**

### Testear con Postman

1. Descargar Postman
2. Importar colección (crear request por recurso)
3. Probar cada endpoint
4. Guardar como colección para referencia

---

## Solución de Problemas

### ❌ Error: "Ambiguous mapping" al iniciar

**Causa:** Dos controladores mapeando la misma ruta.

**Solución:**
```bash
# Verificar que solo PantallaController esté activo
# Los siguientes deben tener @Controller comentado:
# - ProfesorController
# - TurnoController
# - PerfilController

./mvnw clean compile
./mvnw spring-boot:run
```

### ❌ Error 404: Plantilla no encontrada

**Síntomas:** `TemplateEngineException: No template for path X.html`

**Solución:**
1. Verificar que el archivo HTML existe en `templates/`
2. Verificar el nombre en el controller: `return "nombre"` → debe coincidir con `nombre.html`
3. Compilar: `./mvnw clean compile`

### ❌ Imágenes no cargan (404)

**Síntomas:** `GET /assets/logo-sfr.png 404`

**Solución:**
```bash
# Copiar assets a static
cp -r src/main/resources/templates/assets/* src/main/resources/static/assets/

# Limpiar caché del navegador: Ctrl+Shift+Del
# Refrescar: Ctrl+F5
```

### ❌ CSS no se aplica (página sin estilos)

**Síntomas:** Página sin CSS aunque no hay 404

**Solución:**
1. Verificar que `styles.css` existe en `static/css/`
2. Limpiar caché: `Ctrl+Shift+Del`
3. Hard refresh: `Ctrl+F5`
4. Compilar: `./mvnw clean compile`

### ❌ Puerto 8080 ya en uso

**Error:** `Port 8080 already in use`

**Solución (Windows):**
```powershell
# Encontrar proceso
netstat -ano | findstr :8080

# Matar proceso
taskkill /PID <PID> /F

# O cambiar puerto en application.properties
# server.port=8081
```

**Solución (Linux/Mac):**
```bash
# Encontrar proceso
lsof -i :8080

# Matar proceso
kill -9 <PID>
```

### ❌ Base de datos no conecta

**Error:** `com.mysql.cj.jdbc.exceptions.CommunicationsException: Communications link failure`

**Solución:**
1. Verificar MySQL está ejecutando: `mysql -u root -p`
2. Verificar base de datos existe: `USE sistema_turnos;`
3. Verificar credenciales en `application.properties`:
   - `spring.datasource.username=root`
   - `spring.datasource.password=1234`

### ❌ POST/PUT devuelven 400 Bad Request

**Causa:** Datos incompletos o formato inválido

**Solución:**
1. Verificar JSON válido (usar `curl -X POST ...`)
2. Verificar Content-Type: `application/json`
3. Verificar campos requeridos en DTO
4. Ver logs de Spring para detalles

---

## Mejores Prácticas

### ✅ DO Hacer

```java
// ✅ Exception handling apropiado
@GetMapping("/{id}")
public ResponseEntity<TurnoDTO> obtener(@PathVariable Long id) {
    try {
        TurnoDTO dto = turnoService.obtenerPorId(id);
        return ResponseEntity.ok(dto);
    } catch (ResourceNotFoundException e) {
        return ResponseEntity.status(404).body(null);
    }
}

// ✅ Usar servicios para lógica
@PostMapping
public ResponseEntity<TurnoDTO> crear(@RequestBody TurnoDTO dto) {
    return ResponseEntity.ok(turnoService.crear(dto));
}

// ✅ DTOs en API, no entidades
public List<TurnoDTO> obtenerTodos() {
    return repository.findAll()
        .stream()
        .map(this::transformarADTO)
        .collect(Collectors.toList());
}

// ✅ Validar datos de entrada
public TurnoDTO crear(TurnoDTO dto) {
    if (dto.getFecha() == null) {
        throw new BadRequestException("Fecha es requerida");
    }
    // ... crear
}

// ✅ Transacciones donde sea necesario
@Transactional
public void asignarTurno(Long turnoId, Long docenteId) {
    // Múltiples operaciones que deben ser atómicas
}
```

### ❌ DON'T NO Hacer

```java
// ❌ Exponer entidades directamente
@GetMapping
public List<Turno> obtenerTodos() {
    return repository.findAll();  // ❌ MAL
}

// ❌ Lógica en controller
@PostMapping
public Turno crear(@RequestBody Turno turno) {
    // Lógica aquí ❌ MAL
    repository.save(turno);
    return turno;
}

// ❌ Ignorar excepciones
try {
    // código
} catch (Exception e) {
    // Solo catches, no logs ❌ MAL
}

// ❌ Llamadas BD en loops
for (Long id : ids) {
    Turno turno = repository.findById(id).get();  // ❌ N+1 queries
}

// ❌ Métodos muy largos
public void procesarTodos() {
    // 200 líneas de código aquí ❌ MAL
}
```

### Nomenclatura

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Clases | PascalCase | `TurnoRestController.java` |
| Métodos | camelCase | `obtenerTodos()` |
| Variables | camelCase | `turnoId`, `lista` |
| Constantes | UPPER_SNAKE_CASE | `API_BASE_URL` |
| Paquetes | lowercase | `com.example.sistema_turnos` |
| Tablas | snake_case | `usuario`, `asignacion_turno` |
| Columnas | snake_case | `fecha_creacion`, `estado` |

### Estructura de Commits

```bash
git commit -m "feat: agregar endpoint para crear turnos"
git commit -m "fix: corregir mapeo de rutas ambiguas"
git commit -m "docs: actualizar README"
git commit -m "refactor: mover lógica a servicio"
```

Tipos: `feat`, `fix`, `docs`, `refactor`, `test`, `style`, `chore`

---

## Roadmap Futuro

### Fase 1: Fundacional (✅ COMPLETADO)
- [x] Setup Spring Boot
- [x] Estructura de paquetes
- [x] REST API básica
- [x] DTOs y modelos
- [x] Thymeleaf views
- [x] CORS configurado

### Fase 2: Autenticación y Seguridad (📋 PRÓXIMO)
- [ ] Spring Security
- [ ] JWT o OAuth2
- [ ] Roles y permisos
- [ ] Validación de entrada
- [ ] Rate limiting

**Estimado:** 2-3 sprints

### Fase 3: Funcionalidades Avanzadas
- [ ] Reportes (PDF, Excel)
- [ ] Notificaciones (email, SMS)
- [ ] Dashboard interactivo
- [ ] Gráficos y analíticas
- [ ] Exportación de datos

**Estimado:** 4-5 sprints

### Fase 4: Optimización y DevOps
- [ ] Tests unitarios y E2E
- [ ] CI/CD (GitHub Actions)
- [ ] Docker containerization
- [ ] Deploy a producción
- [ ] Monitoreo y logs

**Estimado:** 2-3 sprints

### Fase 5: Mejoras Continuas
- [ ] Móvil app (React Native)
- [ ] Calendarios interactivos
- [ ] Integraciones externas
- [ ] API versioning v2
- [ ] Caché y optimización

---

## 📞 Soporte y Contacto

### Reportar Problemas

1. Verificar la sección [Solución de Problemas](#solución-de-problemas)
2. Revisar logs: `./mvnw spring-boot:run` (consola)
3. Crear issue en GitHub con:
   - Descripción clara
   - Pasos para reproducir
   - Logs relevantes
   - Sistema operativo y versión

### Contribuir

1. Fork el repositorio
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Cambios: `git commit -am 'feat: descripción'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Pull Request

---

## 📝 Licencia e Información

- **Proyecto:** Sistema de Turnos - Santa Francisca Romana
- **Versión:** 1.0
- **Última actualización:** April 3, 2026
- **Lenguaje:** Java + JavaScript
- **Base de datos:** MySQL 8.0

---

**⭐ Documento completo. ¡Listo para desarrollar!**

Para dudas específicas, consultar la sección correspondiente o crear un issue.

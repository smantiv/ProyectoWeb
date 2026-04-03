# Guía de Ejecución - Sistema de Turnos (Después de Refactorización)

## Verificación Rápida Pre-Ejecución

### 1. Estructura de Paquetes ✅
```
src/main/java/com/example/sistema_turnos/
├── SistemaTurnosApplication.java          ✅ @SpringBootApplication
├── controllers/
│   ├── ViewController.java                ✅ MVC - Rutas limpias
│   ├── PantallaController.java            ✅ MVC - Todas las vistas
│   ├── PerfilController.java              ⚠️  Redundante (mantener por compatibilidad)
│   ├── ProfesorController.java            ⚠️  Redundante (mantener por compatibilidad)
│   ├── TurnoController.java               ⚠️  Redundante (mantener por compatibilidad)
│   └── api/
│       ├── TurnoRestController.java       ✅ REST API
│       ├── DocenteRestController.java     ✅ REST API
│       ├── UsuarioRestController.java     ✅ REST API
│       ├── IncidenteRestController.java   ✅ REST API
│       └── ... (más REST controllers)
├── services/
├── repositories/
├── entities/
├── dtos/
└── exceptions/
```

### 2. Plantillas HTML ✅
```
src/main/resources/templates/
├── index.html                             ✅ Thymeleaf + rutas limpias
├── dashboard-profesor.html                ✅ Thymeleaf + rutas limpias
├── dashboard-coordinador.html             ✅ Thymeleaf + rutas limpias
├── dashboard-admin.html                   ✅ Thymeleaf + rutas limpias
├── gestion-turnos.html                    ✅ Thymeleaf + rutas limpias
├── gestion-profesores.html                ✅ Thymeleaf + rutas limpias
├── mis-turnos.html                        ✅ Thymeleaf + rutas limpias
├── [+ 17 plantillas más]                  ✅ Todas actualizadas
└── assets/
    └── logo-sfr.png                       ⚠️  COPIAR A static/assets/
```

### 3. Recursos Estáticos ✅
```
src/main/resources/static/
├── css/
│   └── styles.css                         ✅ EXISTE
├── js/
│   ├── api/
│   │   ├── ApiClient.js                   ✅ EXISTE
│   │   ├── DocenteService.js              ✅ EXISTE
│   │   ├── TurnoService.js                ✅ EXISTE
│   │   └── ... (más servicios)
│   └── app.js
└── assets/                                ✅ CARPETA CREADA (vacía)
    └── [COPIAR AQUÍ: logo-sfr.png]        ⚠️  PENDIENTE
```

---

## Pasos Previos Obligatorios

### ⚠️ CRÍTICO: Mover Imágenes/Assets

**Opción 1: Desde Terminal (Linux/Mac)**
```bash
cd src/main/resources
cp -r templates/assets/* static/assets/
ls static/assets/  # Verificar
```

**Opción 2: Desde Terminal (Windows PowerShell)**
```powershell
Copy-Item -Path "src\main\resources\templates\assets\*" `
          -Destination "src\main\resources\static\assets\" `
          -Force
ls src\main\resources\static\assets\  # Verificar
```

**Opción 3: Manualmente**
1. Abre el Explorador de Archivos
2. Navega a: `src/main/resources/templates/assets/`
3. Copia `logo-sfr.png` (y otros archivos si existen)
4. Pega en: `src/main/resources/static/assets/`

---

## Ejecución de la Aplicación

### Opción 1: Maven (Terminal)
```bash
cd sistema-turnos
./mvnw spring-boot:run
```

### Opción 2: Maven (Windows)
```bash
cd sistema-turnos
mvnw.cmd spring-boot:run
```

### Opción 3: IDE (IntelliJ IDEA / Eclipse)
1. Click derecho en `SistemaTurnosApplication.java`
2. Run → Run 'SistemaTurnosApplication'

### Opción 4: Desde JAR compilado
```bash
./mvnw clean package
java -jar target/sistema-turnos-0.0.1-SNAPSHOT.jar
```

---

## Validación Post-Ejecución

### 1. Verificar Servidor Iniciado
```
Application started successfully
Tomcat initialized with port(s): 8080 (http)
```

### 2. Pruebas de Rutas MVC (Abre en navegador)

**Página de Inicio:**
```
http://localhost:8080/
```
Debe mostrar la página de login con acceso rápido a dashboards.

**Dashboards:**
```
http://localhost:8080/dashboard-profesor
http://localhost:8080/dashboard-coordinador
http://localhost:8080/dashboard-admin
```

**Gestión:**
```
http://localhost:8080/profesores
http://localhost:8080/turnos
http://localhost:8080/incidentes
http://localhost:8080/zonas
```

**Información:**
```
http://localhost:8080/soporte
http://localhost:8080/contacto
```

### 3. Verificar Recursos Estáticos

**CSS Cargado:**
- Abre DevTools (F12)
- Ve a la pestaña "Network"
- Comprueba que `styles.css` devuelve **200 OK**

**Imágenes Cargadas:**
- Comprueba que `logo-sfr.png` devuelve **200 OK**
- Si devuelve **404**, verificar paso "Mover Imágenes/Assets"

**JavaScript Cargado:**
- Comprueba que `app.js` y servicios API devuelven **200 OK**

### 4. Pruebas de REST API (Usar Postman/curl)

```bash
# GET Turnos
curl -X GET http://localhost:8080/api/v1/turnos

# GET Docentes
curl -X GET http://localhost:8080/api/v1/docentes

# GET Usuarios
curl -X GET http://localhost:8080/api/v1/usuarios

# GET Incidentes
curl -X GET http://localhost:8080/api/v1/incidentes

# GET Zonas
curl -X GET http://localhost:8080/api/v1/zonas
```

Respuesta esperada: **200 OK** con JSON array

### 5. Verificar Enlaces Internos

1. Desde `/` (index.html):
   - Click en "Profesor" → debe ir a `/dashboard-profesor`
   - Click en "Coordinador" → debe ir a `/dashboard-coordinador`
   - Click en "Administrador" → debe ir a `/dashboard-admin`

2. Desde `/dashboard-profesor`:
   - Links de "Acciones Rápidas" deben funcionar sin errores
   - Links de pie de página ("Soporte", "Contacto") deben funcionar

---

## Solución de Problemas

### Problema 1: Error 404 - Plantilla no encontrada
```
org.springframework.web.servlet.mvc.support.DefaultHandlerExceptionResolver : 
Resolved [org.thymeleaf.exceptions.TemplateEngineException]
```

**Causa:** La ruta no devuelve el nombre correcto del template.

**Solución:**
1. Verificar en `PantallaController.java` que el `return "nombre"` coincida con el archivo HTML
2. Ejemplo: `return "mis-turnos"` debe apuntar a `templates/mis-turnos.html`

### Problema 2: Imágenes no cargan (404)
```
GET http://localhost:8080/assets/logo-sfr.png 404 (Not Found)
```

**Causa:** Los assets no están en `static/assets/`

**Solución:**
```bash
# Copiar assets
cp -r src/main/resources/templates/assets/* src/main/resources/static/assets/

# Reiniciar la aplicación
```

### Problema 3: CSS no carga (404 o sin estilos)
```
GET http://localhost:8080/css/styles.css 404 (Not Found)
```

**Causa:** El archivo `styles.css` no existe o no está correctamente ubicado.

**Verificar:**
```bash
ls -la src/main/resources/static/css/styles.css
```

### Problema 4: JavaScript no funciona (errores en consola)
```
GET http://localhost:8080/js/api/ApiClient.js 404
```

**Causa:** Los servicios JavaScript no están en static

**Verificar:**
```bash
ls -la src/main/resources/static/js/api/
```

### Problema 5: Puerto 8080 ya está en uso
```
Port 8080 already in use
```

**Soluciones:**

Opción A: Cambiar puerto en `application.properties`
```properties
server.port=8081
```

Opción B: Matar proceso en puerto 8080
```bash
# Linux/Mac
sudo lsof -i :8080
kill -9 <PID>

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

---

## Verificación de Configuración

### application.properties
```properties
# Debe contener:
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/sistema_turnos
spring.datasource.username=root
spring.datasource.password=1234
spring.jpa.hibernate.ddl-auto=create
spring.jpa.show-sql=true
spring.thymeleaf.enabled=true
spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.suffix=.html
```

### Verificar Base de Datos
```bash
mysql -u root -p
mysql> USE sistema_turnos;
mysql> SHOW TABLES;
```

---

## URLs de Referencia Rápida

### Vistas Disponibles (GET)
| URL | Descripción | Template |
|-----|-------------|----------|
| `/` | Página de inicio | index.html |
| `/dashboard-profesor` | Dashboard Profesor | dashboard-profesor.html |
| `/dashboard-coordinador` | Dashboard Coordinador | dashboard-coordinador.html |
| `/dashboard-admin` | Dashboard Admin | dashboard-admin.html |
| `/mis-turnos` | Mis Turnos | mis-turnos.html |
| `/turnos` | Gestión de Turnos | gestion-turnos.html |
| `/profesores` | Gestión de Profesores | gestion-profesores.html |
| `/incidentes` | Gestión de Incidentes | gestion-incidentes.html |
| `/zonas` | Gestión de Zonas | gestion-zonas.html |
| `/soporte` | Centro de Soporte | soporte.html |
| `/contacto` | Contacto | contacto.html |
| `/analiticas` | Analíticas | analiticas.html |
| `/cobertura` | Cobertura en Tiempo Real | cobertura-tiempo-real.html |

### API REST
| URL | Método | Descripción |
|-----|--------|-------------|
| `/api/v1/turnos` | GET | Listado de turnos |
| `/api/v1/docentes` | GET | Listado de docentes |
| `/api/v1/usuarios` | GET | Listado de usuarios |
| `/api/v1/incidentes` | GET | Listado de incidentes |
| `/api/v1/zonas` | GET | Listado de zonas |

---

## Próximos Pasos (Opcional)

1. **Seguridad:**
   - Implementar Spring Security
   - Agregar autenticación
   - Validar roles de usuarios

2. **Performance:**
   - Agregar caché
   - Lazy loading en listados
   - Índices en base de datos

3. **Mejoras UI:**
   - Agregar paginación
   - Filtros avanzados
   - Notificaciones en tiempo real

4. **Testing:**
   - Unit tests para controladores
   - Integration tests
   - Tests E2E

---

## Documentación Generada

- `CAMBIOS_MVC_REST.md` - Detalle completo de cambios realizados
- `GUIA_EJECUCION.md` - Esta guía

Ambos archivos están en la raíz del proyecto (`sistema-turnos/`)

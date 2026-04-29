# 🚀 Guía Rápida de Inicio

## 1️⃣ Requisitos Previos

- **Node.js 18+** (incluye npm)
- **Java 21** (para Spring Boot)
- **Maven** (para compilar backend)
- **Visual Studio Code** (recomendado)

Verifica que tienes todo:
```bash
node --version      # Debe ser v18+
npm --version       # Debe ser 9+
java -version       # Debe ser 21
mvn --version       # Cualquier versión reciente
```

---

## 2️⃣ Instalación

### Paso 1: Navega a la carpeta del proyecto
```bash
cd c:\Users\DELL\Documents\GitHub\ProyectoWeb\sistema-turnos
```

### Paso 2: Instala las dependencias de Node.js
```bash
npm install
```

Esto descargará ~500MB en `node_modules/` (aparece en `.gitignore`)

### Paso 3: Verifica que las dependencias se instalaron
```bash
npm list react react-router-dom axios
```

Deberías ver:
```
react@18.2.0
react-router-dom@6.20.0
axios@1.6.2
```

---

## 3️⃣ Iniciando el Proyecto

### Terminal 1: React Dev Server

```bash
npm run dev
```

Verás algo como:
```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

**Accede a `http://localhost:3000`**

### Terminal 2: Spring Boot Backend

```bash
mvn spring-boot:run
```

Espera a que veas:
```
Started Application in 8.234 seconds (JVM running for 8.891)
```

**Backend está en `http://localhost:8080`**

---

## 4️⃣ Testear la Aplicación

1. Abre `http://localhost:3000` en tu navegador
2. Deberías ver la página de login
3. Intenta iniciar sesión con tus credenciales

### Si ves errores:

❌ **"Cannot GET /api/auth/login"**
- Spring Boot no está corriendo → Ejecuta `mvn spring-boot:run` en otra terminal

❌ **"Connection refused"**
- El proxy de Vite no puede conectar con Spring Boot
- Verifica que Spring Boot esté en `http://localhost:8080`

❌ **Componentes no se ven**
- Falta descargar CSS
- Abre DevTools (F12) → Console y verifica errores

---

## 5️⃣ Scripts Disponibles

```bash
npm run dev          # 🚀 Inicia dev server (http://localhost:3000)
npm run build        # 📦 Compila para producción
npm run preview      # 👁️ Preview de producción (requiere build primero)
npm run lint         # 🔍 Verifica código con ESLint
npm run lint:fix     # 🔧 Auto-arregla errores de linting
```

---

## 6️⃣ Estructura de Carpetas

```
src-react/                     ← TODO el código React está aquí
├── pages/                     ← Páginas completas (rutas)
│   ├── LoginPage.jsx
│   ├── DashboardProfesor.jsx
│   ├── DashboardCoordinador.jsx
│   └── DashboardAdmin.jsx
├── components/                ← Componentes reutilizables
│   ├── NavBar.jsx
│   ├── ProtectedLayout.jsx
│   └── ...
├── services/                  ← Llamadas a API
│   └── apiServices.js
├── context/                   ← Estado global
│   └── AuthContext.jsx
├── hooks/                     ← Custom hooks
│   └── useAuth.js
├── css/                       ← Estilos
│   └── styles.css
├── App.jsx                    ← Router principal
└── main.jsx                   ← Entry point
```

---

## 7️⃣ Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `package.json` | Dependencias y scripts |
| `vite.config.js` | Configuración de build y dev server |
| `index.html` | HTML principal |
| `.eslintrc.json` | Configuración de linting |
| `src-react/App.jsx` | App raíz con rutas |
| `src-react/context/AuthContext.jsx` | Estado de autenticación |

---

## 8️⃣ Credenciales de Prueba

Depende de cómo esté configurada tu API en Spring Boot. 

Típicamente:
```
Usuario: profesor@ejemplo.com
Contraseña: password123

Usuario: coordinador@ejemplo.com
Contraseña: password123

Usuario: admin@ejemplo.com
Contraseña: password123
```

Verifica en tu base de datos `data.sql` o tabla `usuarios`.

---

## 9️⃣ Desarrollo

### Crear una nueva página

1. Crea archivo en `src-react/pages/MiPagina.jsx`
2. Importa componentes necesarios
3. Agrega la ruta en `src-react/App.jsx`

Ejemplo:
```jsx
// src-react/pages/MiPagina.jsx
import ProtectedLayout from '../components/ProtectedLayout'

export default function MiPagina() {
  return (
    <ProtectedLayout>
      <div className="container">
        <h1>Mi Página</h1>
      </div>
    </ProtectedLayout>
  )
}
```

Luego en `App.jsx`:
```jsx
<Route path="/mi-pagina" element={<MiPagina />} />
```

---

## 🔟 Deploy a Producción

### Opción 1: Servir desde Spring Boot
```bash
npm run build
```

Esto genera `src/main/resources/static/react-build/`

Spring Boot servirá automáticamente los archivos compilados.

### Opción 2: Deploy independiente
Los archivos compilados pueden subirse a cualquier servidor web (Nginx, Apache, etc.)

---

## 📋 Checklist Inicial

- [ ] Node.js 18+ instalado
- [ ] `npm install` ejecutado
- [ ] `npm run dev` en Terminal 1
- [ ] `mvn spring-boot:run` en Terminal 2
- [ ] Puedo ver http://localhost:3000
- [ ] El login funciona
- [ ] Los dashboards cargan data de la API

---

## 🆘 Solución de Problemas

### "npm: command not found"
→ Node.js no está instalado o no está en PATH
→ Descárgalo de https://nodejs.org/

### "Module not found: axios"
→ Ejecuta `npm install`

### "Error: ENOENT: no such file or directory"
→ Estás en la carpeta equivocada
→ Navega a `c:\Users\DELL\Documents\GitHub\ProyectoWeb\sistema-turnos`

### "Port 3000 already in use"
→ Vite ya está corriendo en otra terminal
→ O mata el proceso: `npx kill-port 3000`

### "Connection refused" en red de API
→ Spring Boot no está corriendo
→ Ejecuta `mvn spring-boot:run` en otra terminal
→ Verifica que esté en `http://localhost:8080`

### No puedo loguearme
→ Verifica las credenciales en tu base de datos
→ Revisa Spring Boot logs en Terminal 2

---

## 📚 Documentación Completa

Una vez que todo funcione, lee:

1. **README_REACT.md** - Funcionalidades y rutas
2. **GUIA_VUE_REACT.md** - Si vienes de Vue
3. **MIGRACION_REACT.md** - Próximos pasos
4. **RESUMEN_REFACTORIZACION.md** - Resumen completo

---

## 💡 Tips Útiles

💡 **DevTools**: Abre con F12 → Console para ver errores
💡 **Hot Reload**: Los cambios se actualizan automáticamente
💡 **Environment**: Los archivos `.env` pueden configurar URLs
💡 **CORS**: Si tienes problemas, revisa Spring Boot config

---

## 🎯 Próximo Paso

Una vez que todo funcione:

1. Explora los componentes en `src-react/`
2. Lee cómo se usan en `src-react/pages/`
3. Intenta crear una nueva página
4. Agrega más rutas según necesites

---

## ✅ ¡Listo!

Si todo funciona, ¡felicidades! 🎉

Tienes React corriendo con:
- ✅ UI completamente funcional
- ✅ Autenticación
- ✅ Llamadas a API
- ✅ Estilos profesionales
- ✅ Hot reload en desarrollo

**¡Ahora a construir más funcionalidades!** 🚀

---

**Última actualización**: Abril 2026
**Versión**: React 18.2.0
**Status**: ✅ Listo para usar

# ACCIÓN REQUERIDA: Mover Assets a Carpeta Estática

## 🔴 CRÍTICO - ESTO DEBE HACERSE ANTES DE EJECUTAR

Los archivos de imagen/assets están en la carpeta incorrecta y no se cargarán correctamente.

---

## Archivos Afectados

**Ubicación actual (PROBLEMA):**
```
src/main/resources/templates/assets/
└── logo-sfr.png
```

**Ubicación correcta:**
```
src/main/resources/static/assets/
└── logo-sfr.png
```

---

## Método 1: Terminal/Command Line (Más Rápido)

### En Linux o macOS:
```bash
# Navegar a la raíz del proyecto
cd sistema-turnos

# Copiar archivos
cp -r src/main/resources/templates/assets/* src/main/resources/static/assets/

# Verificar que se copiaron
ls -la src/main/resources/static/assets/
# Debe mostrar: logo-sfr.png
```

### En Windows (PowerShell como Administrador):
```powershell
# Navegar a la raíz del proyecto
cd sistema-turnos

# Copiar archivos
Copy-Item -Path "src\main\resources\templates\assets\*" `
          -Destination "src\main\resources\static\assets\" `
          -Force

# Verificar
Get-ChildItem src\main\resources\static\assets\
# Debe mostrar: logo-sfr.png
```

### En Windows (CMD como Administrador):
```cmd
cd sistema-turnos
xcopy src\main\resources\templates\assets\* src\main\resources\static\assets\ /Y
dir src\main\resources\static\assets\
```

---

## Método 2: Visualmente (Explorador de Archivos)

### Pasos:
1. **Abre Explorador de Archivos**
2. **Navega a:**
   ```
   C:\...\sistema-turnos\src\main\resources\templates\assets\
   ```
3. **Selecciona:** `logo-sfr.png` (y otros archivos si existen)
4. **Copia:** `Ctrl+C`
5. **Navega a:**
   ```
   C:\...\sistema-turnos\src\main\resources\static\assets\
   ```
6. **Pega:** `Ctrl+V`

### Visualización:
```
ANTES:
templates/
├── assets/
│   └── logo-sfr.png          ← Aquí está (INCORRECTO)
└── ...

DESPUÉS:
templates/
├── assets/
│   └── logo-sfr.png          ← Original (mantener)
└── ...

static/
├── assets/
│   └── logo-sfr.png          ← Copia (CORRECTO)
├── css/
└── js/
```

---

## Método 3: Con IDE (IntelliJ IDEA)

1. **Abre el proyecto en IntelliJ**
2. **En el panel izquierdo, navega a:**
   ```
   src → main → resources → templates → assets
   ```
3. **Click derecho en `logo-sfr.png`**
4. **Selecciona:** `Copy`
5. **Navega a:**
   ```
   src → main → resources → static → assets
   ```
6. **Click derecho --> Paste**
7. **Confirma:** Click en `OK`

---

## Método 4: Gradle/Maven Plugin

Si prefieres un enfoque automatizado, puedes agregar a `pom.xml`:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-resources-plugin</artifactId>
            <version>3.2.0</version>
            <executions>
                <execution>
                    <id>copy-assets</id>
                    <phase>validate</phase>
                    <goals>
                        <goal>copy-resources</goal>
                    </goals>
                    <configuration>
                        <outputDirectory>
                            ${basedir}/src/main/resources/static/assets
                        </outputDirectory>
                        <resources>
                            <resource>
                                <directory>
                                    ${basedir}/src/main/resources/templates/assets
                                </directory>
                            </resource>
                        </resources>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

Luego ejecuta:
```bash
./mvnw clean validate
```

---

## Verificación

### ✅ Después de copiar, verifica:

**Opción 1: Terminal**
```bash
# Linux/Mac
ls -la src/main/resources/static/assets/

# Windows PowerShell
Get-ChildItem src\main\resources\static\assets\

# Salida esperada debe incluir:
# logo-sfr.png (con fecha y tamaño)
```

**Opción 2: Visually**
1. Abre `Explorador de Archivos`
2. Navega a `src/main/resources/static/assets/`
3. Debe contener `logo-sfr.png`

**Opción 3: En Ejecución**
1. Inicia la aplicación: `./mvnw spring-boot:run`
2. Abre: `http://localhost:8080`
3. Abre DevTools (F12 → Network)
4. Busca por `logo-sfr.png`
5. El estado debe ser **200 OK** (no 404)

---

## Datos Técnicos del Archivo

```
Nombre:       logo-sfr.png
Ubicación:    src/main/resources/templates/assets/logo-sfr.png
Tipo:         PNG image
Usado en:     24 plantillas HTML
Ruta en URL:  http://localhost:8080/assets/logo-sfr.png
```

---

## ⚠️ Importante

- **NO elimines** `src/main/resources/templates/assets/`
- **SÍ copia** a `src/main/resources/static/assets/`
- Ambas carpetas pueden coexistir
- Spring servirá desde `static` automáticamente
- Si no haces esto, verás en navegador: logo no cargado (404)

---

## ✓ Verificación Post-Copia

Antes de ejecutar la aplicación, asegúrate:

```
✓ Carpeta existe:                src/main/resources/static/assets/
✓ logo-sfr.png está presente:    src/main/resources/static/assets/logo-sfr.png
✓ Archivo tiene tamaño > 0:      (No vacío)
✓ Permisos de lectura:           (Puedes leer el archivo)
```

---

## ¿Qué Sucede Si No Lo Haces?

```
⚠️ RESULTADO SIN COPIAR:

- Página carga pero sin logo
- Browser console muestra: 404 logo-sfr.png
- Todos los links funcionan
- CSS carga correctamente
- UX deteriorada por falta de branding

✅ RESULTADO DESPUÉS DE COPIAR:

- Página carga con logo visible
- Browser console sin errores 404
- Todos los links funcionan
- CSS y imágenes cargan correctamente
- UX completa
```

---

## Próximos Pasos

Después de copiar los assets:

1. ✅ Assets copiados
2. 🚀 Ejecuta: `./mvnw spring-boot:run`
3. 🌐 Abre: `http://localhost:8080`
4. ✔️ Verifica: Logo visible, sin errores

---

## Preguntas Frecuentes

**P: ¿Debo eliminar la carpeta `templates/assets/`?**
R: No, déjala ahí. Spring no la sirve, thus no afecta.

**P: ¿Se actualiza automáticamente si cambio el archivo?**
R: No, requiere recompilar o restart de la aplicación.

**P: ¿Puedo agregar más imágenes?**
R: Sí, simplemente cópialas a `static/assets/` y referencia con `th:src="@{/assets/tu-imagen.png}"`

**P: ¿Los cambios se perderán después de clean?**
R: No, el comando `clean` solo borra la carpeta `target/`, no afecta `static/`.

---

## Soporte

Si tienes problemas:

1. Verifica permisos: ¿Puedes leer `templates/assets/logo-sfr.png`?
2. Verifica espacio: ¿Disco tiene espacio disponible?
3. Verifica ruta: ¿La ruta es completamente correcta?
4. Verifica aplicación: ¿Spring está ejecutándose en puerto 8080?
5. Verifica navegador: ¿Limpiaste cache (Ctrl+Shift+Del)?

---

**⏱️ Tiempo estimado para completar: 1 minuto**

**🎯 Prioridad: 🔴 CRÍTICA - Hacer antes de ejecutar**

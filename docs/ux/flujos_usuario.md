# Flujos de Usuario

Este documento describe los principales **flujos de interacción de los usuarios dentro del sistema**.  
Cada flujo representa la secuencia de acciones que un usuario puede realizar y las respuestas que genera el sistema.

Los flujos se organizan según las funcionalidades principales de la aplicación y los distintos roles del sistema: **docente, coordinador y administrador**.

---

# 1. Autenticación

```
Login
↓
Usuario ingresa correo y contraseña
↓
Sistema valida credenciales
```

Si las credenciales son incorrectas:

```
Login
↓
Acceso denegado
↓
Intentar nuevamente / Restablecer contraseña
```

Si las credenciales son correctas:

```
Login
↓
Redirección según rol del usuario
├ Home docente
├ Home coordinador
└ Home administrador
```

---

# 2. Consultar turnos (docente)

```
Home docente
↓
Mis turnos / calendario
↓
Lista de turnos
```

Si existen turnos asignados:

```
Lista de turnos
↓
Detalle de turno
```

Si no existen turnos:

```
Mis turnos
↓
Estado vacío (sin turnos)
```

---

# 3. Iniciar turno (check-in)

```
Detalle de turno
↓
Registrar vigilancia
↓
Ingresar PIN / escanear QR
↓
Sistema valida credenciales de check-in
```

Si el PIN o QR es válido:

```
Check-in registrado
↓
Confirmación de check-in exitoso
↓
Turno en curso
```

Si el PIN o QR es inválido:

```
Check-in
↓
Notificación de check-in no exitoso
↓
Intentar nuevamente
```

---

# 4. Registrar recorrido (checkpoint)

```
Detalle de turno
↓
Registrar checkpoint
↓
Ingresar PIN del punto de control
↓
Sistema registra recorrido
```

Resultado:

```
Checkpoint registrado
↓
Confirmación de recorrido
```

Este flujo permite evidenciar que el docente realizó el **recorrido dentro de la zona asignada**.

---

# 5. Registrar incidente

```
Detalle de turno
↓
Registrar incidente
↓
Seleccionar tipo de incidente
↓
Seleccionar severidad
↓
Agregar descripción
↓
Confirmar
↓
Incidente registrado
```

Este flujo permite documentar **eventos o situaciones ocurridas durante el turno de vigilancia**.

---

# 6. Cerrar turno

```
Detalle de turno
↓
Cerrar turno
↓
Registrar estado de limpieza (1–4)
↓
Confirmar cierre
↓
Turno cerrado
```

Este registro permite generar **información sobre el estado de las zonas al finalizar cada turno**.

---

# 7. Solicitar reemplazo

```
Detalle de turno
↓
Solicitar reemplazo
↓
Sistema busca docentes disponibles
↓
Lista de candidatos
↓
Notificación enviada
```

Docente candidato recibe:

```
Notificación de reemplazo
↓
Aceptar reemplazo
   o
Rechazar reemplazo
```

Si el docente acepta:

```
Turno reasignado
↓
Confirmación de reemplazo
```

---

# 8. Supervisión de cobertura (coordinador)

```
Home coordinador
↓
Tablero en vivo
↓
Estado de zonas
├ Verde (zona cubierta)
├ Amarillo (turno por iniciar)
└ Rojo (zona sin cobertura)
```

Si una zona aparece en estado rojo:

```
Zona sin cobertura
↓
Detalle de zona
↓
Reasignar turno
```

Este flujo permite al coordinador **monitorear la cobertura de vigilancia en tiempo real**.

---

# 9. Reasignación de turno (coordinador)

```
Detalle de zona
↓
Lista de docentes candidatos
↓
Seleccionar docente
↓
Confirmar reasignación
↓
Turno reasignado
```

Este flujo garantiza que **las zonas sin cobertura puedan ser atendidas rápidamente**.

---

# 10. Gestión de incidentes (coordinador)

```
Home coordinador
↓
Incidentes
↓
Listado de incidentes
↓
Detalle de incidente
```

Si no existen incidentes registrados:

```
Incidentes
↓
Estado vacío
```

El coordinador puede revisar los incidentes para **analizar situaciones ocurridas durante los turnos**.

---

# 11. Analítica

```
Home coordinador
↓
Analítica
↓
Dashboard
├ Indicadores de desempeño
├ Mapa de calor de incidentes
└ Métricas de docentes
```

Opcionalmente:

```
Exportar reportes
↓
CSV / Excel
```

Este flujo permite obtener **información analítica del funcionamiento del sistema**.

---

# 12. Administración del sistema

Las funcionalidades administrativas permiten configurar los elementos principales del sistema.

---

## Gestión de zonas

```
Home administrador
↓
Gestión de zonas
↓
Crear / editar / eliminar zona
```

---

## Gestión de docentes

```
Home administrador
↓
Gestión de docentes
↓
Crear / editar / eliminar docente
```

---

## Gestión de turnos

```
Home administrador
↓
Gestión de turnos
↓
Crear / editar / eliminar turno
```

---

## Configuración del sistema

```
Home administrador
↓
Reglas operativas
↓
Configurar:
• tiempos de alerta
• umbral de cobertura
• reglas de escalamiento
```

Estas configuraciones permiten adaptar el comportamiento del sistema a las **necesidades operativas de la institución**.
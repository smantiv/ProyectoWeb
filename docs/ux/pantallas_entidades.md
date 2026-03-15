# Pantallas del Sistema y Entidades del Modelo

Este documento describe las **pantallas principales del sistema** y las **entidades conceptuales** que soportan el funcionamiento de la aplicación.

Las pantallas representan la forma en que los usuarios interactúan con el sistema, mientras que las entidades corresponden a los elementos de información que deben persistirse o gestionarse dentro de la aplicación.

---

# Pantallas del sistema

A partir del análisis del enunciado y del diagrama de navegación diseñado para la aplicación, se identifican las siguientes pantallas del sistema. Estas pantallas representan las diferentes interfaces a través de las cuales interactúan los distintos tipos de usuarios (docente, coordinador y administrador) con el sistema.

---

# 1. Pantallas de acceso

Estas pantallas corresponden al acceso inicial al sistema y a la gestión de autenticación.

- **Registrarse**
- **Login**
- **Acceso denegado**
- **Restablecimiento de contraseña**

Una vez el usuario inicia sesión correctamente, el sistema realiza una **redirección automática según el rol del usuario**.

---

# 2. Pantallas del docente

Estas pantallas permiten al docente consultar sus turnos, realizar el registro de vigilancia, reportar incidentes y gestionar reemplazos.

### Pantallas principales

- **Home docente**
- **Perfil / cuenta**
- **Mis turnos / calendario**
- **Historial de turnos**
- **Detalle de turno**

### Gestión del turno

Dentro del detalle de turno el docente puede realizar diferentes acciones:

- **Registrar vigilancia**
- **Ingresar PIN (check-in)**
- **Confirmación de check-in exitoso**
- **Notificación de check-in no exitoso**
- **Registrar checkpoint (recorrido)**

### Registro de incidentes

- **Registrar incidente**
- **Selección de tipo de incidente**
- **Selección de severidad**
- **Descripción / observación del incidente**

### Cierre del turno

- **Cerrar turno**
- **Registrar limpieza**

### Gestión de reemplazos

- **Solicitar reemplazo**
- **Notificación de propuesta de reemplazo**
- **Aceptar reemplazo**
- **Rechazar reemplazo**

### Estados y notificaciones

- **Notificación de recordatorio de turno**
- **Estado vacío (sin turnos)**

---

# 3. Pantallas del coordinador

El coordinador supervisa la cobertura de zonas, gestiona alertas, revisa incidentes y consulta analítica del sistema.

### Pantallas principales

- **Home coordinador**
- **Perfil / cuenta**

### Supervisión de cobertura

- **Tablero en vivo**
- **Vista alerta zona sin cobertura**
- **Detalle de la zona**

### Gestión de reemplazos

- **Lista de candidatos**
- **Reasignar turno**
- **Historial de reasignaciones**

### Gestión de incidentes

- **Incidentes**
- **Listado de incidentes**
- **Detalle de incidente**
- **Estado vacío (sin incidentes)**

---

# 4. Pantallas de analítica

Estas pantallas permiten analizar el comportamiento del sistema y apoyar la toma de decisiones.

- **Analítica**
- **Dashboard analítico**
- **Indicadores de desempeño**
- **Mapa de calor**
- **Exportar reportes**
- **Métricas positivas de docentes**
- **Reconocimientos institucionales**
- **Estado vacío (sin datos analíticos)**

---

# 5. Pantallas del administrador

El administrador gestiona la configuración general del sistema, incluyendo zonas, docentes, turnos y reglas operativas.

### Pantallas principales

- **Home administrador**
- **Perfil / cuenta**

### Gestión de zonas

- **Gestión de zonas**
- **Crear zona**
- **Editar zona**
- **Eliminar zona**

### Gestión de docentes

- **Gestión de docentes**
- **Crear docente**
- **Editar docente**
- **Eliminar docente**

### Gestión de turnos

- **Gestión de turnos**
- **Crear turno**
- **Editar turno**
- **Eliminar turno**

### Configuración del sistema

- **Reglas operativas**
- **Configurar tiempos de alerta**
- **Configurar umbrales de cobertura**
- **Configurar escalamiento**

---

# Resumen de organización de pantallas

Las pantallas del sistema se agrupan en cinco grandes categorías:

- Pantallas de acceso
- Pantallas del docente
- Pantallas del coordinador
- Pantallas de analítica
- Pantallas del administrador

Esta estructura permite organizar la navegación del sistema de acuerdo con los diferentes roles y responsabilidades definidos para la aplicación.

---

# Entidades del sistema

A partir del análisis del enunciado y de las funcionalidades definidas para el sistema, se identifican las siguientes **entidades conceptuales** que permiten modelar la información gestionada por la aplicación.

Estas entidades representan los elementos de información necesarios para soportar la gestión de turnos, el registro de vigilancia, el reporte de incidentes, la reasignación de turnos y la generación de analítica.

---

# Entidades principales del modelo

Las entidades centrales del sistema incluyen:

- Usuario
- Zona
- Turno
- Incidente
- Reporte

Estas entidades constituyen el núcleo del modelo de datos representado en el **diagrama de clases del sistema**.

---

# Entidades de apoyo

Adicionalmente, el sistema considera entidades o estructuras de información que permiten soportar funcionalidades específicas como registros de vigilancia, recorridos, notificaciones o analítica.

Estas incluyen:

- RegistroVigilancia
- PuntoRecorrido
- Recorrido
- RegistroLimpieza
- Reasignacion
- Notificacion
- ReglaOperativa
- Metrica
- Reconocimiento

---

# Relación general entre entidades

De forma general, las relaciones principales del sistema son:

- Un **usuario** puede tener distintos roles dentro del sistema.
- Un **docente** puede tener múltiples **turnos asignados**.
- Cada **turno** pertenece a una **zona**.
- Un **turno** puede registrar múltiples **incidentes**, **recorridos** y **registros de vigilancia**.
- Un **turno** puede generar un **registro de limpieza** al finalizar.
- Un **turno** puede ser objeto de una **reasignación**.
- Las **notificaciones** se envían a los usuarios según eventos del sistema.
- Las **métricas** y **reconocimientos** se calculan a partir del desempeño de los docentes.
# Sitemap del Sistema

Este documento corresponde al **texto base de un sitemap generado con la herramienta Relume**.  
El sitemap describe la **estructura de páginas y sub-páginas de la aplicación**, así como las principales secciones que componen cada pantalla del sistema.

Su propósito es **servir como referencia para el diseño de la interfaz y la navegación del sistema**, facilitando la construcción de wireframes, prototipos y la implementación de las distintas vistas de la aplicación.

Cada página incluye:
- Las **secciones principales de la interfaz** (header, formularios, estadísticas, tablas, etc.).
- Los **componentes funcionales clave** que aparecen en cada pantalla.
- Las **sub-páginas relacionadas** dentro del flujo de navegación.

---

Page: **Login**
 - Barra de Navegación
 - Sección de Encabezado: Título y subtítulo de bienvenida al sistema interno
 - Sección de Formulario de Contacto: Campos para email/usuario, contraseña, botón "Ingresar", y enlace "¿Olvidaste tu contraseña?"
 - Pie de Página

Sub-pages: Panel de Profesor, Panel de Coordinador, Panel de Administrador, Ayuda, Contacto
añade a este md como una intro diciendo que este es el txt de un sitemap creado con relum
Page: **Login**
 - Barra de Navegación
 - Sección de Encabezado: Título y subtítulo de bienvenida al sistema interno
 - Sección de Formulario de Contacto: Campos para email/usuario, contraseña, botón "Ingresar", y enlace "¿Olvidaste tu contraseña?"
 - Pie de Página

Sub-pages: Panel de Profesor, Panel de Coordinador, Panel de Administrador, Ayuda, Contacto


Page: **Panel de Profesor**
 - Barra de Navegación
 - Sección de Encabezado: Mensaje personalizado de bienvenida con el nombre del profesor, próximo turno agendado, zona asignada y la hora de inicio del siguiente turno.
 - Sección de Lista de Características: Acciones rápidas: Ver Mis Turnos, Iniciar Turno (Check-in), Registrar Punto de Control, Reportar Incidente, Solicitar Reemplazo, Cerrar Turno. Cada acción presentada como botón o tarjeta.
 - Sección de Estadísticas: Resumen de turnos completados esta semana, estado del turno activo, incidentes reportados y puntos de control registrados.
 - Sección de Linea de Tiempo: Lista de próximos turnos con zona, fecha, hora, estado y botón para ver detalles del turno.
 - Sección de CTA: Botón principal destacado: “Iniciar Turno” o “Ir a Mis Turnos”.
 - Pie de Página

Sub-pages: Mis Turnos, Registrar Punto de Control, Reportar Incidente, Solicitar Reemplazo


Page: **Mis Turnos**
 - Barra de Navegación
 - Sección de Encabezado: Encabezado con el título "Mis Turnos" y una breve explicación: "Consulta y gestiona tus turnos asignados de vigilancia escolar. Aquí puedes ver detalles, estados y acceder rápidamente a la información de cada turno."
 - Sección de Estadísticas: Resumen con métricas clave: total de turnos esta semana, turnos completados, próximos turnos.
 - Sección de Lista de Características: Filtros opcionales: por fecha, zona y estado del turno.
 - Sección de Características: Tabla principal de turnos con columnas: zona, fecha, hora de inicio, hora de fin, estado (pendiente, activo, completado), botón de acción "Ver Turno".
 - Sección de Linea de Tiempo: Vista visual tipo calendario o línea de tiempo con los turnos programados para facilitar la planificación y referencia rápida.
 - Pie de Página

Sub-pages: Detalle Turno


Page: **Detalle Turno**
 - Barra de Navegación
 - Sección de Encabezado: Título: "Detalle del Turno". Subtítulo: Visualiza la información de tu turno de vigilancia asignado y realiza acciones como registrar checkpoints, reportar incidentes, solicitar reemplazos o cerrar el turno.
 - Sección de Estadísticas: Información clave del turno: Zona asignada, Fecha, Hora de inicio, Hora de fin, Estado actual, Profesor responsable.
 - Sección de Linea de Tiempo: Cronología de eventos: Checkpoints registrados, Incidentes reportados, Solicitudes de reemplazo, Notificaciones.
 - Sección de Lista de Características: Botones de acción principales: Registrar vigilancia, Registrar checkpoint, Reportar incidente, Solicitar reemplazo, Cerrar turno. Acciones agrupadas y destacadas.
 - Sección de Galería: Lista de checkpoints recientes durante el turno, con ubicación, hora de registro y estado.
 - Pie de Página

Sub-pages: Cerrar Turno


Page: **Cerrar Turno**
 - Barra de Navegación
 - Sección de Encabezado: Título destacado: "Cerrar Turno" con breve instrucción para finalizar el turno de vigilancia.
 - Sección de Características: Resumen del turno: zona asignada, hora de inicio, hora de finalización, puntos de control completados, incidentes reportados.
 - Sección de Formulario de Contacto: Formulario de cierre de turno:
 - Sección de CTA: Mensaje/alerta de confirmación: "El turno se ha cerrado exitosamente. ¡Gracias por tu colaboración!"
 - Pie de Página

Sub-pages: Registrar Limpieza


Page: **Registrar Limpieza**
 - Barra de Navegación
 - Sección de Encabezado: Título: Registrar Limpieza. Subtítulo: Confirma que el área de vigilancia asignada ha sido limpiada y organizada correctamente al finalizar el turno.
 - Sección de Contenido de Elemento del Portafolio: Resumen breve del turno cerrado: zona asignada, fecha, hora de inicio, hora de fin y docente responsable.
 - Sección de Formulario de Contacto: Formulario para registrar el estado de limpieza:
 - Sección de CTA: Mensaje de confirmación tras enviar el formulario: “La limpieza de la zona ha sido registrada correctamente. Gracias por contribuir al mantenimiento del espacio.”
 - Pie de Página

Page: **Registrar Punto de Control**
 - Barra de Navegación
 - Sección de Encabezado: Título "Registrar Punto de Control" y breve explicación: "Confirma tu ubicación ingresando el PIN del punto de control o escaneando el código QR durante tu recorrido de vigilancia."
 - Sección de Formulario de Contacto: Formulario con los campos: PIN del punto de control (input numérico), O escanear código QR (botón o área de activación de cámara), Notas (opcional, textarea), Botón principal: "Registrar checkpoint"
 - Sección de CTA: Mensaje de confirmación/aprobación: "¡Checkpoint registrado exitosamente!" visible tras registro exitoso.
 - Sección de Lista de Características: Lista opcional de checkpoints recientes: muestra ubicación, hora registrada de los últimos puntos registrados por el usuario en el turno activo.
 - Pie de Página

Page: **Reportar Incidente**
 - Barra de Navegación
 - Sección de Encabezado: Título "Reportar Incidente" y breve explicación: "Utiliza este formulario para reportar cualquier incidente ocurrido durante tu turno de vigilancia."
 - Sección de Formulario de Contacto: Formulario de reporte de incidente:
 - Sección de CTA: Mensaje de confirmación tras el envío: "El incidente ha sido registrado exitosamente."
 - Sección de Lista de Actualizaciones: Listado opcional: "Incidentes recientes reportados por ti" (muestra los últimos reportes del profesor con fecha, tipo y estado).
 - Pie de Página

Page: **Solicitar Reemplazo**
 - Barra de Navegación
 - Sección de Encabezado: Título "Solicitar Reemplazo" y breve explicación: "Solicita que otro profesor cubra uno de tus turnos asignados en caso de necesidad imprevista."
 - Sección de Formulario de Solicitud: Formulario con los siguientes campos:
 - Sección de Lista de Actualizaciones: Lista de solicitudes de reemplazo realizadas, mostrando para cada una: turno, fecha, motivo, profesor sugerido (si aplica), y estado (pendiente, aceptada o rechazada).
 - Pie de Página

Page: **Panel de Coordinador**
 - Barra de Navegación
 - Sección de Encabezado: Mensaje de bienvenida personalizado para el coordinador, con breve resumen del estado actual del sistema (ej: "Bienvenido, Laura. 3 zonas sin cobertura, 2 incidentes críticos abiertos").
 - Sección de Lista de Características: Acciones rápidas: tarjetas/botones para acceder a Cobertura en Tiempo Real, Gestión de Incidentes, Reasignar Turnos, Analíticas.
 - Sección de Estadísticas: Métricas clave en tarjetas: zonas cubiertas actualmente, turnos activos, incidentes abiertos, turnos pendientes de reasignación.
 - Sección de Características: Sección de alertas del sistema: lista de zonas sin cobertura, turnos no iniciados, incidentes críticos que requieren atención inmediata.
 - Sección de CTA: Botón destacado: "Abrir Cobertura en Tiempo Real".
 - Pie de Página

Sub-pages: Cobertura en Tiempo Real, Gestión de Incidentes, Reasignar Turnos, Analíticas


Page: **Cobertura en Tiempo Real**
 - Barra de Navegación
 - Sección de Encabezado: Título: "Cobertura en Tiempo Real". Breve descripción: "Monitorea en tiempo real la cobertura de vigilancia en las distintas zonas del colegio. Visualiza el estado actual de cada zona y actúa rápidamente ante incidencias o brechas de cobertura."
 - Sección de Características: Mapa interactivo del campus con zonas resaltadas por estado: cubierto, parcialmente cubierto, sin cobertura.
 - Sección de Lista de Características: Lista de estado de zonas: nombre de zona, guardia asignado, estado del turno, última actualización.
 - Sección de Estadísticas: Tarjetas con: total de zonas cubiertas, turnos activos, zonas sin cobertura, alertas detectadas.
 - Sección de Lista de Actualizaciones: Lista de alertas: zonas sin guardias, turnos no iniciados, brechas de cobertura detectadas.
 - Sección de CTA: Botón principal: "Gestionar incidentes / Reasignar guardia".
 - Pie de Página

Page: **Gestión de Incidentes**
 - Barra de Navegación
 - Sección de Encabezado: Título: "Gestión de Incidentes". Breve descripción: "Como coordinador, aquí puedes visualizar, priorizar y resolver los incidentes reportados dentro del colegio."
 - Sección de Lista de Características: Navegación interna para acceder a otras herramientas del sistema (desplegable o lateral para cambiar entre módulos).
 - Sección de Características: Tabla principal con listado de incidentes mostrando: tipo de incidente, ubicación, reportado por, estado (pendiente, en progreso, resuelto), prioridad y fecha/hora de reporte.
 - Sección de Lista de Características: Filtros interactivos para buscar por estado, zona, prioridad y rango de fechas.
 - Sección de Características: Panel lateral/detalle al seleccionar un incidente: descripción completa, ubicación exacta, adjuntos/notas, guardia o responsable asignado.
 - Sección de Servicios: Controles para asignar o reasignar un guardia/responsable al incidente.
 - Sección de Características: Botones de acción para marcar como "En progreso", "Resuelto" o "Escalar incidente".
 - Pie de Página

Page: **Reasignar Turnos**
 - Barra de Navegación
 - Sección de Encabezado: Título "Reasignar Turnos" y breve descripción: "Como coordinador, gestiona y reasigna turnos de vigilancia para cubrir ausencias y resolver conflictos de horarios."
 - Sección de Características: Lista de turnos problemáticos: muestra turnos sin cubrir, ausencias y conflictos de horario.
 - Sección de Lista de Características: Lista de guardias disponibles para reasignación: nombre, disponibilidad, zona actual y horario de turno.
 - Sección de Lista de Características: Búsqueda y filtros: filtra guardias por disponibilidad, zona y horario.
 - Sección de Características: Acción de reasignación: selecciona un guardia y asígnalo a un turno descubierto.
 - Sección de Características: Paso de confirmación: confirma la reasignación antes de aplicar el cambio.
 - Sección de Lista de Características: Historial de cambios: muestra las acciones previas de reasignación de turnos realizadas por el coordinador.
 - Pie de Página

Page: **Analíticas**
 - Barra de Navegación
 - Sección de Encabezado: Título: "Analíticas". Breve descripción: "Esta sección proporciona insights sobre la cobertura de vigilancia, incidentes y desempeño de los guardias."
 - Sección de Lista de Características: Filtros: selector de rango de fechas, zona, tipo de incidente.
 - Sección de Características: Tarjetas de estadísticas clave: total de incidentes, incidentes resueltos, zonas activas, tiempo promedio de respuesta.
 - Sección de Características: Cobertura por zona: mapa o gráfico de barras de distribución de cobertura.
 - Sección de Características: Incidentes por tipo: gráfico de barras o pastel mostrando frecuencia por categoría.
 - Sección de Características: Desempeño de guardias: gráfico con métricas como turnos completados y puntualidad.
 - Sección de Características: Tendencias de incidentes: gráfico de líneas mostrando evolución temporal.
 - Sección de CTA: Botón para exportar datos o generar reportes de analíticas.
 - Pie de Página

Page: **Panel de Administrador**
 - Barra de Navegación
 - Sección de Encabezado: Título: "Panel de Administrador". Breve descripción sobre la gestión total del sistema de turnos de vigilancia escolar.
 - Sección de Lista de Características: Accesos rápidos (cards/botones) a: Gestión de Profesores, Gestión de Zonas, Gestión de Turnos, Reglas Operativas, Configuración del Sistema.
 - Sección de Estadísticas: Métricas clave: profesores activos, zonas registradas, turnos programados, reglas operativas activas.
 - Sección de Alertas Administrativas: Alertas administrativas: zonas sin asignación, turnos mal configurados, conflictos de reglas.
 - Sección de CTA: Acciones primarias: agregar profesor, crear nueva zona, crear/editar regla operativa.
 - Sección de Lista de Actualizaciones: Actividad reciente: lista de cambios administrativos recientes en el sistema.
 - Pie de Página

Sub-pages: Gestión de Profesores, Gestión de Zonas, Gestión de Turnos, Reglas Operativas


Page: **Gestión de Profesores**
 - Barra de Navegación
 - Sección de Encabezado: Título "Gestión de Profesores" y breve explicación sobre la administración de profesores y sus asignaciones.
 - Sección de Lista de Características: Navegación principal del sistema administrativo (enlaces a gestión de profesores, zonas, turnos, reglas, etc.).
 - Sección de Características: Buscador y filtros para buscar profesores por nombre, filtrar por rol, zona asignada y estado de cuenta (activo/inactivo).
 - Sección de Características: Tabla principal con lista de profesores mostrando nombre, email, rol, zonas asignadas y estado.
 - Sección de Características: Panel lateral o modal con información completa del profesor seleccionado (nombre, email, rol, zonas, estado, historial, etc.).
 - Sección de Características: Botones para crear nuevo profesor, editar información, activar/desactivar cuenta y asignar zonas.
 - Sección de Características: Opción para exportar la lista de profesores (por ejemplo, a Excel/CSV).
 - Pie de Página

Page: **Gestión de Zonas**
 - Barra de Navegación
 - Sección de Encabezado: Título: "Gestión de Zonas". Breve descripción: "Administre y configure las áreas de vigilancia escolar. Defina responsables, horarios y cobertura de cada zona."
 - Sección de Estadísticas: Tarjetas: zonas totales, zonas activas, zonas sin cobertura, cobertura promedio por zona.
 - Sección de Lista de Características: Listado: Crear nueva zona, editar zona, asignar responsable, configurar horarios de cobertura.
 - Sección de Características: Tabla de zonas: nombre de zona, responsable asignado, estado de cobertura, horario operativo.
 - Sección de Filtros: Filtros para buscar zonas por estado o responsable.
 - Sección de Galería: Vista de mapa interactivo con las zonas resaltadas en el campus (opcional).
 - Pie de Página

Page: **Gestión de Turnos**
 - Barra de Navegación
 - Sección de Encabezado: Título: "Gestión de Turnos". Breve descripción: "Como administrador, aquí puedes crear, editar y monitorizar los turnos de vigilancia de la escuela."
 - Sección de Estadísticas: Tarjetas con: total de turnos activos, turnos completados, ausencias, solicitudes de reemplazo.
 - Sección de Lista de Características: Sistema de filtros: por fecha, zona, guardia y estado del turno.
 - Sección de Características: Tabla de turnos mostrando: ID de turno, guardia asignado, zona, hora de inicio, hora de fin, estado.
 - Sección de Características: Acciones por turno: crear nuevo turno, editar, asignar guardia, eliminar turno.
 - Sección de Linea de Tiempo: Historial de turnos (opcional), muestra registros de turnos anteriores.
 - Pie de Página

Page: **Reglas Operativas**
 - Barra de Navegación
 - Sección de Encabezado: Título: "Reglas Operativas". Breve descripción: "Los administradores pueden definir y gestionar las reglas que rigen el sistema de turnos de vigilancia escolar."
 - Sección de Características: Sistema de navegación interna con pestañas o menú lateral para acceder rápidamente a: Lista de reglas, Configuración, Validación, Historial.
 - Sección de Lista de Características: Tabla con listado de reglas operativas mostrando: nombre de la regla, tipo, estado (activo/inactivo), última actualización. Acciones rápidas (editar, habilitar/deshabilitar).
 - Sección de Características: Interfaz de configuración de reglas: formulario para crear/modificar reglas (ej. máximo de horas por turno, requisitos de check-in, reglas de escalamiento, políticas de reemplazo).
 - Sección de Características: Panel de validación de reglas: muestra advertencias o errores si existen conflictos o inconsistencias entre reglas.
 - Sección de Linea de Tiempo: Historial de reglas: timeline de cambios realizados sobre cada regla para fines de auditoría.
 - Sección de Características: Barra de acciones: botones destacados para crear nueva regla, editar, habilitar/deshabilitar.
 - Pie de Página

Page: **Ayuda**
 - Barra de Navegación
 - Sección de Encabezado: Título “Centro de Ayuda” con breve introducción: Encuentra respuestas y soporte sobre el uso del sistema de gestión de turnos de vigilancia escolar.
 - Sección de Lista de Características: Índice con enlaces rápidos a temas frecuentes: turnos, registro de puntos de control, reporte de incidentes, roles de usuario, administración, seguridad.
 - Sección de Preguntas Frecuentes: Listado de preguntas y respuestas organizadas por categoría (profesor, coordinador, administrador).
 - Sección Cómo Funciona: Guía paso a paso ilustrada para realizar las acciones más comunes: iniciar turno, registrar punto de control, reportar incidente, solicitar reemplazo, reasignar turno.
 - Sección de Contacto: Información de contacto adicional: correo, teléfono, horario de atención y enlace a soporte en tiempo real.
 - Pie de Página

Page: **Contacto**
 - Barra de Navegación
 - Sección de Encabezado: Título atractivo invitando a los usuarios a contactar al equipo, con un breve texto introductorio sobre canales de soporte y atención personalizada.
 - Sección de Formulario de Contacto: Formulario para enviar consultas: nombre, correo electrónico, asunto, mensaje y opción para adjuntar archivos si es necesario.
 - Sección de Contacto: Información de contacto directa: correo electrónico oficial, teléfono, dirección física (si aplica), horarios de atención y enlaces a redes sociales.
 - Sección de Preguntas Frecuentes: Listado breve de preguntas y respuestas rápidas sobre contacto y soporte.
 - Pie de Página
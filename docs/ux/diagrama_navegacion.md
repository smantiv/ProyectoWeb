# Diagrama de Navegación

El diagrama de navegación representa el flujo de interacción entre las diferentes pantallas del sistema y las acciones que pueden realizar los usuarios dentro de la aplicación.

Este diagrama permite visualizar cómo se desplaza un usuario a través de la aplicación y cómo se relacionan las distintas funcionalidades del sistema.

Para facilitar su comprensión, se utilizaron **colores para diferenciar los distintos tipos de elementos dentro del flujo de navegación**.

---

## Diagrama

El diagrama completo puede consultarse en el siguiente enlace:

https://drive.google.com/file/d/1PeJGeT0NP1KTvrXlg6dWeCyYPylZ9zq8/view?usp=sharing

---

# Convenciones del diagrama

Para que el diagrama de navegación sea más fácil de entender, se utilizan los siguientes colores:

---

## 🟧 Naranja — Pantallas

Representa **pantallas reales del sistema** a las que el usuario puede navegar.

Ejemplos:

- Home docente / coordinador / administrador
- Mis turnos
- Detalle de turno
- Analítica
- Detalle de incidente

En general, cualquier elemento que corresponda a una **vista completa dentro de la aplicación** se representa con este color.

---

## 🟨 Amarillo — Acciones del usuario

Representa **acciones que el usuario puede ejecutar desde una pantalla**.

Estas acciones normalmente corresponden a **botones o interacciones directas del usuario**.

Ejemplos:

- Registrar vigilancia
- Cerrar turno
- Solicitar reemplazo
- Reasignar turno
- Aceptar o rechazar reemplazo

Si es algo que el usuario **ejecuta activamente dentro del sistema**, se representa con este color.

---

## 🟩 Verde — Confirmaciones exitosas

Representa **mensajes o estados que indican que una acción se completó correctamente**.

Ejemplos:

- Confirmación de check-in exitoso
- Confirmación de incidente registrado
- Confirmación de cierre de turno
- Confirmación de reasignación

Este color indica que **la operación realizada por el usuario fue exitosa**.

---

## 🟥 Rojo — Errores

Representa **errores o validaciones fallidas dentro del sistema**.

Ejemplos:

- QR inválido
- PIN inválido
- Check-in no exitoso

Se utiliza cuando **una acción no puede completarse o falla alguna validación del sistema**.

---

## 🟪 Morado — Notificaciones del sistema

Representa **eventos o notificaciones generadas automáticamente por el sistema**.

Estas notificaciones informan a los usuarios sobre situaciones relevantes.

Ejemplos:

- Recordatorio de turno
- Propuesta de reemplazo
- Ausencia de cobertura en una zona

Corresponden a mensajes que **el sistema comunica al usuario sin que este haya iniciado directamente la acción**.

---

# Objetivo del diagrama

El objetivo del diagrama de navegación es mostrar de manera clara:

- Las **pantallas principales del sistema**
- Las **acciones que pueden realizar los usuarios**
- Los **estados de éxito o error**
- Las **notificaciones generadas por el sistema**
- El **flujo general de interacción dentro de la aplicación**

Esto permite comprender rápidamente cómo se comporta la aplicación desde el punto de vista de la experiencia de usuario.
# Batch Scope

Este documento debe describir **el alcance del programa Batch** que carga datos iniciales en la base de datos del sistema.

La persona encargada del Batch debe completar aquí:

## 1. Objetivo del Batch
- Qué problema resuelve
- Por qué se usa un proceso Batch

## 2. Datos que carga
Listar las entidades que el Batch inserta en la base de datos.

Ejemplo:
- zonas
- docentes
- turnos iniciales
- configuraciones del sistema

## 3. Fuente de datos
Explicar de dónde salen los datos:

- CSV
- JSON
- hardcoded
- otro sistema

## 4. Flujo general del proceso
Explicar brevemente qué hace el Batch al ejecutarse.

Ejemplo:

1. Leer archivo de datos
2. Validar información
3. Mapear a entidades
4. Insertar en base de datos

## 5. Cómo se ejecuta
Indicar cómo correr el Batch.

Ejemplo:
- comando
- clase principal
- job de Spring Batch

---

Este documento es **solo una referencia rápida del funcionamiento del Batch**, no requiere entrar en detalles de implementación.
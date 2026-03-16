# Relaciones del modelo

## Zona – Turno
Una zona puede tener múltiples turnos asignados.

Zona (1) → Turno (0..*)

## Usuario – AsignacionTurno
Un usuario puede estar asignado a múltiples turnos.

Usuario (1) → AsignacionTurno (0..*)

## Turno – AsignacionTurno
Un turno puede tener múltiples asignaciones.

Turno (1) → AsignacionTurno (0..*)

## AsignacionTurno – Incidente
Durante una asignación de turno pueden registrarse incidentes.

AsignacionTurno (1) → Incidente (0..*)

## Zona – Incidente
Los incidentes ocurren dentro de una zona específica.

Zona (1) → Incidente (0..*)

## Reporte – Incidente
Los reportes utilizan los incidentes para generar estadísticas.
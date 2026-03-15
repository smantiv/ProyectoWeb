
INSERT INTO usuario (id, nombre, email, password, rol, activo)
VALUES (1, 'Administrador', 'admin@correo.com', '1234', 'ADMIN', true);

INSERT INTO usuario (id, nombre, email, password, rol, activo)
VALUES (2, 'Coordinador', 'coord@correo.com', '1234', 'COORDINADOR', true);

INSERT INTO usuario (id, nombre, email, password, rol, activo)
VALUES (3, 'Docente 1', 'doc1@correo.com', '1234', 'DOCENTE', true);

INSERT INTO usuario (id, nombre, email, password, rol, activo)
VALUES (4, 'Docente 2', 'doc2@correo.com', '1234', 'DOCENTE', true);

INSERT INTO usuario (id, nombre, email, password, rol, activo)
VALUES (5, 'Docente 3', 'doc3@correo.com', '1234', 'DOCENTE', true);

INSERT INTO docente (id, codigo_institucional, usuario_id)
VALUES (1, 'DOC001', 3);

INSERT INTO docente (id, codigo_institucional, usuario_id)
VALUES (2, 'DOC002', 4);

INSERT INTO docente (id, codigo_institucional, usuario_id)
VALUES (3, 'DOC003', 5);

INSERT INTO zona (id, nombre, descripcion)
VALUES (1, 'Patio', 'Zona principal del colegio');

INSERT INTO zona (id, nombre, descripcion)
VALUES (2, 'Cancha', 'Zona deportiva');

INSERT INTO zona (id, nombre, descripcion)
VALUES (3, 'Pasillo', 'Pasillo central');

INSERT INTO turno (id, fecha, hora_inicio, hora_fin, estado, zona_id)
VALUES (1, '2026-06-01', '10:00:00', '10:30:00', 'PROGRAMADO', 1);

INSERT INTO turno (id, fecha, hora_inicio, hora_fin, estado, zona_id)
VALUES (2, '2026-06-01', '10:30:00', '11:00:00', 'PROGRAMADO', 2);

INSERT INTO asignacion_turno (id, docente_id, turno_id, estado_cobertura)
VALUES (1, 1, 1, 'PENDIENTE');

INSERT INTO asignacion_turno (id, docente_id, turno_id, estado_cobertura)
VALUES (2, 2, 2, 'PENDIENTE');

INSERT INTO checkpoint (id, nombre)
VALUES (1, 'Entrada principal');

INSERT INTO checkpoint (id, nombre)
VALUES (2, 'Pasillo norte');

INSERT INTO recorrido (id, fecha_hora, checkpoint_id, asignacion_id)
VALUES (1, '2026-06-01 10:05:00', 1, 1);

INSERT INTO incidente (id, tipo, severidad, descripcion, fecha_hora, asignacion_id)
VALUES (1, 'RUIDO', 'BAJO', 'Estudiantes haciendo ruido', '2026-06-01 10:10:00', 1);
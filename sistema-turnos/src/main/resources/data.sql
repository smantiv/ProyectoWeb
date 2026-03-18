
INSERT INTO usuario (nombre, email, password, rol, activo) VALUES
('Admin Sistema', 'admin@test.com', '1234', 'ADMIN', true),
('Juan Perez', 'juan@test.com', '1234', 'DOCENTE', true),
('Maria Gomez', 'maria@test.com', '1234', 'DOCENTE', true);

INSERT INTO docente (codigo_institucional, usuario_id) VALUES
('DOC001', 2),
('DOC002', 3);

INSERT INTO zona (nombre, descripcion) VALUES
('Zona A', 'Entrada principal'),
('Zona B', 'Patio central'),
('Zona C', 'Bloque académico');

INSERT INTO turno (fecha, hora_inicio, hora_fin, estado, zona_id) VALUES
('2026-03-18', '07:00:00', '09:00:00', 'PENDIENTE', 1),
('2026-03-18', '09:00:00', '11:00:00', 'PENDIENTE', 2),
('2026-03-18', '11:00:00', '13:00:00', 'PENDIENTE', 3);

INSERT INTO asignacion_turno (hora_checkin, hora_cierre, calificacion_limpieza, estado_cobertura, docente_id, turno_id) VALUES
(NULL, NULL, NULL, 'PENDIENTE', 1, 1),
(NULL, NULL, NULL, 'PENDIENTE', 2, 2);


INSERT INTO checkpoint (nombre) VALUES
('Entrada principal'),
('Patio'),
('Pasillo bloque A'),
('Zona deportiva');


INSERT INTO recorrido (fecha_hora, checkpoint_id, asignacion_id) VALUES
('2026-03-18 07:15:00', 1, 1),
('2026-03-18 07:30:00', 2, 1),
('2026-03-18 09:20:00', 3, 2);


INSERT INTO incidente (tipo, severidad, descripcion, fecha_hora, asignacion_id) VALUES
('PELEA', 'ALTA', 'Discusión entre estudiantes', '2026-03-18 07:45:00', 1),
('ACCIDENTE', 'MEDIA', 'Caída en el patio', '2026-03-18 09:40:00', 2);


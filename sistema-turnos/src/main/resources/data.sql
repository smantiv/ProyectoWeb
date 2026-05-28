
INSERT INTO usuario (nombre, email, password, rol, activo) VALUES
('Admin Sistema', 'admin@test.com', '1234', 'ADMIN', true),
('Coordinador Operativo', 'coordinador@test.com', '1234', 'COORDINADOR', true),
('Juan Perez', 'juan@test.com', '1234', 'DOCENTE', true),
('Maria Gomez', 'maria@test.com', '1234', 'DOCENTE', true);

INSERT INTO docente (codigo_institucional, usuario_id) VALUES
('DOC001', 3),
('DOC002', 4);

INSERT INTO zona (nombre, descripcion) VALUES
('Patio principal', 'Zona central de recreo'),
('Biblioteca', 'Área de estudio y consulta'),
('Cafetería', 'Zona de alimentación'),
('Entrada principal', 'Acceso principal al colegio'),
('Zona de juegos', 'Área recreativa'),
('Pasillo académico', 'Corredor de aulas');

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


INSERT INTO incidente (tipo, severidad, descripcion, fecha_hora, estado, ubicacion, asignacion_id) VALUES
('PELEA', 'alta', 'Discusión entre estudiantes', '2026-04-20 07:45:00', 'reportado', 'Patio principal', 1),
('ACCIDENTE', 'media', 'Caída en el patio', '2026-04-20 09:40:00', 'en_revision', 'Biblioteca', 2),
('ACCIDENTE', 'media', 'Caída en el patio', '2026-04-20 09:40:00', 'en_revision', 'Biblioteca', 2),
('BULLYING', 'critica', 'Agresión física en pasillo', '2026-04-20 10:10:00', 'reportado', 'Patio principal', 1),
('INFRAESTRUCTURA', 'baja', 'Silla rota en aula', '2026-04-20 11:30:00', 'resuelto', 'Biblioteca', 2);

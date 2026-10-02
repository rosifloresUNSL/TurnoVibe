-- Datos de ejemplo (los mismos que usaba la versión en memoria).
INSERT INTO peluqueros (nombre) VALUES ('Franco'), ('Mateo'), ('Lucas');

INSERT INTO servicios (id, nombre, duracion_minutos, precio) VALUES
  ('corte',        'Corte de Cabello',   30,  8000),
  ('barba',        'Perfilado de Barba', 30,  5000),
  ('decoloracion', 'Decoloración',       30, 15000);

INSERT INTO turnos
  (peluquero_id, fecha, hora_inicio, hora_fin, duracion_minutos,
   cliente_nombre, cliente_email, cliente_telefono, estado)
VALUES
  (1, '2026-10-02', '09:00', '09:30', 30, 'Ana Gómez',  'ana@ejemplo.com',   '1122334455', 'confirmado'),
  (1, '2026-10-02', '10:00', '11:00', 60, 'Bruno Díaz', 'bruno@ejemplo.com', '1155667788', 'confirmado'),
  (2, '2026-10-02', '09:30', '10:00', 30, 'Carla Ruiz', 'carla@ejemplo.com', '1199887766', 'cancelado');

INSERT INTO turno_servicios (turno_id, servicio_id) VALUES
  (1, 'corte'),
  (2, 'corte'),
  (2, 'barba'),
  (3, 'decoloracion');
-- Esquema de TurnoVibe. Postgres lo ejecuta SOLO la primera vez que se crea el volumen
-- (carpeta /docker-entrypoint-initdb.d). Para recrearlo: npm run db:reset

-- Necesaria para poder combinar "=" sobre enteros con "&&" sobre rangos en una restricción gist.
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE peluqueros (
  id     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre TEXT NOT NULL
);

CREATE TABLE servicios (
  id               TEXT PRIMARY KEY,                       -- 'corte', 'barba', 'decoloracion'
  nombre           TEXT NOT NULL,
  duracion_minutos INTEGER NOT NULL CHECK (duracion_minutos > 0),
  precio           INTEGER NOT NULL CHECK (precio >= 0)
);

CREATE TABLE turnos (
  id               INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  peluquero_id     INTEGER NOT NULL,
  fecha            DATE NOT NULL,
  hora_inicio      TIME NOT NULL,
  hora_fin         TIME NOT NULL,
  duracion_minutos INTEGER NOT NULL CHECK (duracion_minutos > 0),
  cliente_nombre   TEXT NOT NULL,
  cliente_email    TEXT NOT NULL,
  cliente_telefono TEXT NOT NULL,
  estado           TEXT NOT NULL DEFAULT 'confirmado',
  creado_en        TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT turnos_peluquero_fk FOREIGN KEY (peluquero_id) REFERENCES peluqueros (id),
  CONSTRAINT turnos_estado_ck    CHECK (estado IN ('pendiente_pago', 'confirmado', 'cancelado')),
  CONSTRAINT turnos_horas_ck     CHECK (hora_fin > hora_inicio),

  -- Anti double-booking A NIVEL BASE DE DATOS: para un mismo peluquero no puede haber dos
  -- turnos activos cuyos intervalos [inicio, fin) se pisen. Es seguro ante concurrencia
  -- (dos solicitudes simultáneas): Postgres rechaza la segunda con el código 23P01.
  -- Los turnos cancelados quedan fuera de la regla.
  CONSTRAINT turnos_sin_solapamiento EXCLUDE USING gist (
    peluquero_id WITH =,
    (tsrange(fecha + hora_inicio, fecha + hora_fin)) WITH &&
  ) WHERE (estado <> 'cancelado')
);

CREATE INDEX turnos_fecha_idx ON turnos (fecha);

-- Relación muchos-a-muchos: un turno incluye 1, 2 o 3 servicios.
CREATE TABLE turno_servicios (
  turno_id    INTEGER NOT NULL REFERENCES turnos (id) ON DELETE CASCADE,
  servicio_id TEXT    NOT NULL REFERENCES servicios (id),
  PRIMARY KEY (turno_id, servicio_id)
);
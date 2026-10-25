-- MIGRACIÓN para bases que ya existen (con datos). Si podés recrear la base, alcanza con
-- "npm run db:reset" y no hace falta este archivo.
--
-- Cómo aplicarla (con el contenedor levantado):
--   docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < db/migrations/001_precio_unitario.sql
--
-- Los turnos ya existentes quedan con el precio de catálogo de HOY (es lo único que se sabe).
BEGIN;
ALTER TABLE turno_servicios ADD COLUMN precio_unitario INTEGER;
UPDATE turno_servicios ts SET precio_unitario = s.precio FROM servicios s WHERE s.id = ts.servicio_id;
ALTER TABLE turno_servicios ALTER COLUMN precio_unitario SET NOT NULL;
ALTER TABLE turno_servicios ADD CONSTRAINT turno_servicios_precio_ck CHECK (precio_unitario >= 0);
COMMIT;
-- Usuarios que inician sesión (admin y staff). Los clientes NO tienen cuenta.
-- Las contraseñas NO se guardan: solo su hash bcrypt. Los usuarios de ejemplo se crean
-- con "npm run db:seed" (así no hay contraseñas ni hashes escritos en el repositorio).
CREATE TABLE usuarios (
  id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre        TEXT NOT NULL,
  email         TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  rol           TEXT NOT NULL,
  peluquero_id  INTEGER,
  activo        BOOLEAN NOT NULL DEFAULT true,
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT usuarios_rol_ck CHECK (rol IN ('admin', 'staff')),
  -- Si se borra el peluquero, se borra su cuenta de acceso.
  CONSTRAINT usuarios_peluquero_fk FOREIGN KEY (peluquero_id)
    REFERENCES peluqueros (id) ON DELETE CASCADE,
  -- Un staff DEBE estar vinculado a un peluquero; un admin NO.
  CONSTRAINT usuarios_rol_peluquero_ck CHECK ((rol = 'staff') = (peluquero_id IS NOT NULL))
);

-- Email único sin distinguir mayúsculas ("Franco@x.com" y "franco@x.com" son el mismo).
CREATE UNIQUE INDEX usuarios_email_uk ON usuarios (lower(email));
-- Un peluquero tiene como máximo una cuenta.
CREATE UNIQUE INDEX usuarios_peluquero_uk ON usuarios (peluquero_id) WHERE peluquero_id IS NOT NULL;
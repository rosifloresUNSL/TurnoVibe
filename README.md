# TurnoVibe

Plataforma web para reservas de barbería sin registro, con prevención de *double-booking* y control de ausentismo.  
**Materia:** Laboratorio de Tecnologías (2026) | **Alumnos:** Diego Cuello — Rosa María Flores - Alexis Rodriguez

---

## Características

* **Stack:** React 19, Vite, Bootstrap 5, React Router v7 · Node.js, Express 5 · PostgreSQL 17 (Docker).
* **Reserva sin login:**
  * Multiselección de servicios (Corte, Barba, Decoloración de 30 min c/u).
  * Bloques continuos de 30, 60 o 90 min, calculados por el servidor.
  * Modalidades: **Por Peluquero** o **Siguiente Disponible**.
  * Sin doble reserva: lo garantiza la base de datos (restricción `EXCLUDE`), incluso con solicitudes simultáneas.
* **Roles y seguridad (JWT + bcrypt):**
  * **Admin:** indicadores globales, CRUD de peluqueros (con su cuenta de acceso) y agenda consolidada.
  * **Staff:** indicadores propios, agenda personal y carga manual de turnos. Solo ve y modifica su agenda.
* **Checkout (en progreso):** bloqueo temporal de 15 minutos con Mercado Pago.

---

## Inicio rápido

Requisitos: Node 22 y Docker Desktop.

```bash
# 1) Backend + base de datos
cd backend
cp .env.example .env          # completar claves y JWT_SECRET (ver comentarios del archivo)
npm install
npm run db:up                 # levanta PostgreSQL en Docker
npm run db:seed               # crea las cuentas de ejemplo (claves de .env)
npm run dev                   # API en http://localhost:3000

# 2) Frontend (en otra terminal)
cd frontend
cp .env.example .env          # VITE_API_URL=http://localhost:3000
npm install
npm run dev                   # http://localhost:5173
```

## Usuarios de prueba

Se crean con `npm run db:seed`; las contraseñas son las de `SEED_ADMIN_PASSWORD` y `SEED_STAFF_PASSWORD` en `backend/.env`.

* **Admin:** `admin@turnovibe.com`
* **Staff:** `franco@turnovibe.com`, `mateo@turnovibe.com`, `lucas@turnovibe.com`

## Documentación

* API y base de datos: [`backend/README.md`](backend/README.md)
* Colecciones de Postman: `backend/postman/`
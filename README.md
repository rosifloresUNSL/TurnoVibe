# TurnoVibe

Plataforma web para reservas de barbería sin registro, con prevención de *double-booking* y control de ausentismo.  
**Materia:** Laboratorio de Tecnologías (2026) | **Alumnos:** Diego Cuello — Rosa María Flores - Alexis Rodriguez

---

## Características

* **Stack:** React, Vite, Bootstrap 5, React Router v8.
* **Reserva sin login:** 
  * Multiselección de servicios (Corte, Barba, Decoloración de 30 min c/u).
  * Cálculo dinámico de bloques continuos (30, 60 o 90 min).
  * Modalidades: **Por Peluquero** o **Siguiente Disponible**.
* **Roles y Seguridad:**
  * **Admin:** Métricas globales, CRUD de peluqueros y agenda unificada.
  * **Staff:** Métricas propias, agenda personal y bloqueo manual de turnos.
* **Checkout (En progreso):** Bloqueo temporal de 15 minutos con Mercado Pago.

---

## Usuarios de Prueba

* **Admin:** `admin@turnovibe.com` / `admin`
* **Staff:** `franco@turnovibe.com` / `staff`

---

## Inicio Rápido

```bash
npm install
npm run dev
* **Páginas Secundarias e Interactividad:**
  * `index.html`: Página principal con el formulario de reserva e imagen de fondo full screen.
  * `servicios.html`: Tabla de datos con precios y tiempos por servicio.
  * `peluqueros.html`: Lista de miembros del equipo con índice ordenado y marcadores internos para saltar de sección.
  * `admin.html`: Vista previa del inicio de sesión y panel de control para el administrador.

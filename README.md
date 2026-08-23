# turnoVibe

Bienvenidos al repositorio de **TurnoVibe**, una plataforma web pensada para digitalizar y simplificar la reserva de turnos en peluquerías y barberías. 

Este proyecto nace como trabajo práctico para la materia **Laboratorio de Tecnologías** (Ingeniería en Informática, 2026).
Alumnos: Diego Cuello - Flores Rosa Maria

---

## De qué trata el proyecto.

El objetivo principal es resolver dos problemas típicos que sufren las peluquerías: los turnos de última hora (*no-shows*) y los turnos pisados (*double-booking*). 

Para solucionar esto, **TurnoVibe** le permite a cualquier cliente agendar una cita al instante **sin necesidad de registrarse o crearse una cuenta**. Cuando elegís un horario, el sistema lo bloquea automáticamente durante 15 minutos mientras realizás el pago obligatorio por Mercado Pago. Si el pago se aprueba, la cita queda confirmada. Además, el dueño tiene un panel de administración para controlar a los peluqueros, los horarios y las reservas del día.

---

## Lo que tenemos hecho hasta ahora (Fase Actual)

Actualmente completamos la **etapa inicial de maquetado estático**, cumpliendo con los requerimientos académicos de HTML5 y CSS3 nativo antes de pasar a React:

* **Estructura HTML5 Semántica:** Usamos `<header>`, `<nav>`, `<main>`, `<section>`, `<article>` y `<footer>` sin meter `<div>` innecesarios para las regiones principales.
* **Variables CSS (`:root`) & Diseño Responsive:** Manejo centralizado de colores, sombras y radios de borde en `./src/estilos.css`.
* **Formulario Completo:** Con validaciones nativas de HTML5 (campos requeridos, selección de fecha con límites `min/max`, teléfono, correo, etc.).
* **Páginas Secundarias e Interactividad:**
  * `index.html`: Página principal con el formulario de reserva e imagen de fondo full screen.
  * `servicios.html`: Tabla de datos con precios y tiempos por servicio.
  * `peluqueros.html`: Lista de miembros del equipo con índice ordenado y marcadores internos para saltar de sección.
  * `admin.html`: Vista previa del inicio de sesión y panel de control para el administrador.

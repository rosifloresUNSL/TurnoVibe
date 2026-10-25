// Una función por cada endpoint del backend. Las pantallas llaman a estas funciones
// y nunca arman URLs ni usan fetch directamente.
import { solicitar, aQueryString } from './apiClient';

export const authApi = {
  login: (email, password) =>
    solicitar('/api/auth/login', { metodo: 'POST', cuerpo: { email, password }, conToken: false }),
  usuarioActual: () => solicitar('/api/auth/me')
};

export const serviciosApi = {
  listar: () => solicitar('/api/servicios', { conToken: false })
};

export const peluquerosApi = {
  listar: () => solicitar('/api/peluqueros', { conToken: false }),
  crear: ({ nombre, email, password }) =>
    solicitar('/api/peluqueros', { metodo: 'POST', cuerpo: { nombre, email, password } }),
  renombrar: (id, nombre) => solicitar(`/api/peluqueros/${id}`, { metodo: 'PUT', cuerpo: { nombre } }),
  eliminar: (id) => solicitar(`/api/peluqueros/${id}`, { metodo: 'DELETE' })
};

export const disponibilidadApi = {
  // { fecha, servicios: 'corte,barba', peluqueroId? } -> { duracionMinutos, modo, slots }
  consultar: (parametros) => solicitar(`/api/disponibilidad${aQueryString(parametros)}`, { conToken: false })
};

export const turnosApi = {
  // Admin: todos. Staff: el servidor devuelve solo los de su agenda.
  listar: (filtros) => solicitar(`/api/turnos${aQueryString(filtros)}`),
  // Reserva del CLIENTE: va sin token a propósito (si hubiera un staff con sesión abierta en el
  // mismo navegador, igual se trata como una reserva pública).
  reservar: (datos) => solicitar('/api/turnos', { metodo: 'POST', cuerpo: datos, conToken: false }),
  // Carga manual del staff/admin: va con token.
  crearManual: (datos) => solicitar('/api/turnos', { metodo: 'POST', cuerpo: datos }),
  eliminar: (id) => solicitar(`/api/turnos/${id}`, { metodo: 'DELETE' })
};

export const estadisticasApi = {
  obtener: (periodo) => solicitar(`/api/estadisticas${aQueryString(periodo)}`)
};
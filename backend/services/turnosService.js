// Lógica de negocio de los turnos, separada de las rutas para poder reutilizarla
// (la usan routes/turnos.js y routes/peluqueros.js).
const { turnos } = require('../data/turnos');
const catalogo = require('../data/servicios');
const { horaAMinutos, minutosAHora, haySolapamiento } = require('../utils/horarios');

// Regla 1.3 del negocio: la duración total es la suma de los servicios elegidos.
function calcularDuracion(idsServicios) {
  return idsServicios.reduce((total, id) => {
    const servicio = catalogo.find((s) => s.id === id);
    return total + (servicio ? servicio.duracionMinutos : 0);
  }, 0);
}

function calcularHoraFin(horaInicio, duracionMinutos) {
  return minutosAHora(horaAMinutos(horaInicio) + duracionMinutos);
}

// Construye el turno a partir del body usando una lista blanca de campos:
// si el cliente manda "id", "horaFin" o cualquier otro campo, se ignora.
// horaFin y duracionMinutos los calcula el servidor.
function construirTurno(datos) {
  const duracionMinutos = calcularDuracion(datos.servicios);
  return {
    peluqueroId: datos.peluqueroId,
    servicios: datos.servicios,
    fecha: datos.fecha,
    horaInicio: datos.horaInicio,
    horaFin: calcularHoraFin(datos.horaInicio, duracionMinutos),
    duracionMinutos,
    clienteNombre: datos.clienteNombre.trim(),
    clienteEmail: datos.clienteEmail.trim(),
    clienteTelefono: String(datos.clienteTelefono).trim(),
    estado: datos.estado || 'confirmado'
  };
}

// Filtros opcionales por query params: ?fecha=...&estado=...&peluqueroId=...
function filtrarTurnos({ fecha, estado, peluqueroId } = {}, lista = turnos) {
  return lista.filter(
    (t) =>
      (!fecha || t.fecha === fecha) &&
      (!estado || t.estado === estado) &&
      (!peluqueroId || t.peluqueroId === Number(peluqueroId))
  );
}

// Prevención de double-booking: devuelve el turno que se pisa con el nuevo (o undefined).
// - Los turnos cancelados no bloquean la agenda.
// - idAIgnorar sirve para el PUT: un turno no puede entrar en conflicto consigo mismo.
function buscarConflicto({ peluqueroId, fecha, horaInicio, horaFin }, idAIgnorar = null) {
  const inicio = horaAMinutos(horaInicio);
  const fin = horaAMinutos(horaFin);

  return turnos.find(
    (t) =>
      t.id !== idAIgnorar &&
      t.peluqueroId === peluqueroId &&
      t.fecha === fecha &&
      t.estado !== 'cancelado' &&
      haySolapamiento(inicio, fin, horaAMinutos(t.horaInicio), horaAMinutos(t.horaFin))
  );
}

module.exports = {
  calcularDuracion,
  construirTurno,
  filtrarTurnos,
  buscarConflicto
};
// Lógica de negocio PURA de los turnos (sin base de datos ni Express).
// El catálogo de servicios se recibe como parámetro: viene de la base de datos.
const { horaAMinutos, minutosAHora } = require('../utils/horarios');

// Regla del negocio: la duración total es la suma de los servicios elegidos.
function calcularDuracion(idsServicios, catalogo) {
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
function construirTurno(datos, catalogo) {
  const duracionMinutos = calcularDuracion(datos.servicios, catalogo);
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

module.exports = { calcularDuracion, calcularHoraFin, construirTurno };
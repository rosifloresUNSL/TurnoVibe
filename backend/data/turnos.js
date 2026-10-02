// "Base de datos" en memoria. IMPORTANTE: las rutas modifican este mismo array
// (push / splice / asignación por índice). Nunca hay que reasignar `turnos = [...]`,
// porque los demás archivos seguirían apuntando al array viejo.
const turnos = [
  {
    id: 1,
    peluqueroId: 1,
    servicios: ['corte'],
    fecha: '2026-10-02',
    horaInicio: '09:00',
    horaFin: '09:30',
    duracionMinutos: 30,
    clienteNombre: 'Ana Gómez',
    clienteEmail: 'ana@ejemplo.com',
    clienteTelefono: '1122334455',
    estado: 'confirmado',
    creadoEn: '2026-10-01T12:00:00.000Z'
  },
  {
    id: 2,
    peluqueroId: 1,
    servicios: ['corte', 'barba'],
    fecha: '2026-10-02',
    horaInicio: '10:00',
    horaFin: '11:00',
    duracionMinutos: 60,
    clienteNombre: 'Bruno Díaz',
    clienteEmail: 'bruno@ejemplo.com',
    clienteTelefono: '1155667788',
    estado: 'confirmado',
    creadoEn: '2026-10-01T12:05:00.000Z'
  },
  {
    id: 3,
    peluqueroId: 2,
    servicios: ['decoloracion'],
    fecha: '2026-10-02',
    horaInicio: '09:30',
    horaFin: '10:00',
    duracionMinutos: 30,
    clienteNombre: 'Carla Ruiz',
    clienteEmail: 'carla@ejemplo.com',
    clienteTelefono: '1199887766',
    estado: 'cancelado',
    creadoEn: '2026-10-01T12:10:00.000Z'
  }
];

let ultimoId = Math.max(...turnos.map((t) => t.id));

// Los ids los genera el servidor, nunca el cliente.
function generarId() {
  ultimoId += 1;
  return ultimoId;
}

module.exports = { turnos, generarId };
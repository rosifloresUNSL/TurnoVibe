// Arma la respuesta de estadísticas a partir de las filas de la base (función pura).
const ESTADOS = ['confirmado', 'pendiente_pago', 'cancelado'];

function armarEstadisticas({ alcance, peluqueroId, desde, hasta, filasEstado, filasServicio, filasPeluquero }) {
  // Todos los estados aparecen siempre, aunque no haya turnos (con 0).
  const porEstado = Object.fromEntries(ESTADOS.map((e) => [e, 0]));
  for (const fila of filasEstado) porEstado[fila.estado] = fila.cantidad;

  const respuesta = {
    alcance, // 'global' (admin) o 'peluquero' (staff)
    peluqueroId: peluqueroId ?? null,
    periodo: { desde: desde ?? null, hasta: hasta ?? null },
    totales: {
      turnos: ESTADOS.reduce((total, e) => total + porEstado[e], 0),
      confirmados: porEstado.confirmado,
      pendientesPago: porEstado.pendiente_pago,
      cancelados: porEstado.cancelado,
      ingresos: filasServicio.reduce((total, s) => total + s.ingresos, 0)
    },
    porServicio: filasServicio
  };

  // El desglose por peluquero es información global: el staff NO recibe la propiedad "peluqueros".
  if (alcance === 'global') respuesta.peluqueros = filasPeluquero;
  return respuesta;
}

module.exports = { armarEstadisticas };
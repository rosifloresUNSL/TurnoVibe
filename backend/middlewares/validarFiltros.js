// Valida los query params de GET /api/turnos (y del endpoint anidado).
// Sin esto, un ?fecha=hola llegaría a Postgres y explotaría con un error 500.
const { ESTADOS_VALIDOS, esFechaValida } = require('../utils/validaciones');

function validarFiltros(req, res, next) {
  const { fecha, estado, peluqueroId } = req.query;
  const detalles = {};

  if (fecha !== undefined && !esFechaValida(fecha)) {
    detalles.fecha = 'Debe tener formato AAAA-MM-DD y ser una fecha real.';
  }
  if (estado !== undefined && !ESTADOS_VALIDOS.includes(estado)) {
    detalles.estado = `Debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}.`;
  }
  // typeof: ?peluqueroId=1&peluqueroId=2 llega como arreglo.
  if (peluqueroId !== undefined && (typeof peluqueroId !== 'string' || !/^\d{1,9}$/.test(peluqueroId))) {
    detalles.peluqueroId = 'Debe ser un entero positivo.';
  }

  if (Object.keys(detalles).length > 0) {
    return res.status(400).json({ error: 'Filtros inválidos.', detalles });
  }
  next();
}

module.exports = validarFiltros;
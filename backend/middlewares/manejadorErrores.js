// Middleware de errores centralizado.
// Express lo reconoce como "de errores" por tener EXACTAMENTE 4 parámetros,
// aunque `next` solo se use en un caso.
// Debe ir al final de server.js, después de todas las rutas y middlewares.

// Traduce errores de PostgreSQL a respuestas HTTP. Postgres identifica cada error con un código
// (SQLSTATE) y, cuando corresponde, el nombre de la restricción que falló (err.constraint).
// Los mensajes son fijos a propósito: err.detail de Postgres incluye datos de la fila.
function traducirErrorPostgres(err) {
  switch (err.code) {
    case '23P01': // exclusion_violation: el peluquero ya tiene un turno que se pisa
      return { status: 409, error: 'El peluquero ya tiene un turno en ese horario.' };
    case '23503': // foreign_key_violation
      return {
        status: 400,
        error:
          err.constraint === 'turnos_peluquero_fk'
            ? 'El peluquero indicado no existe.'
            : 'Se hace referencia a un recurso que no existe.'
      };
    case '23505': // unique_violation
      return { status: 409, error: 'Ya existe un registro con esos datos.' };
    case '23514': // check_violation
      return { status: 400, error: 'Los datos no cumplen una regla de la base de datos.' };
    case '22003': // numeric_value_out_of_range
      return { status: 400, error: 'Un valor numérico está fuera de rango.' };
    default:
      break;
  }

  // Base caída o conexión perdida: no es culpa del cliente ni un bug de la ruta (503).
  const sinConexion =
    err.code === 'ECONNREFUSED' ||
    err.code === '57P01' || // admin_shutdown
    (typeof err.code === 'string' && err.code.startsWith('08')) ||
    (Array.isArray(err.errors) && err.errors.some((e) => e.code === 'ECONNREFUSED'));
  if (sinConexion) {
    return { status: 503, error: 'La base de datos no está disponible. Intentá de nuevo en un momento.' };
  }

  return null;
}

function manejadorErrores(err, req, res, next) {
  // Si ya se empezó a responder no se puede enviar otra respuesta
  // ("Cannot set headers after they are sent").
  if (res.headersSent) {
    return next(err);
  }

  // express.json() lanza este error cuando el body no es JSON válido: es culpa del cliente (400).
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El body no es un JSON válido.' });
  }

  const traducido = traducirErrorPostgres(err);
  const status = traducido ? traducido.status : err.status || err.statusCode || 500;

  // El detalle técnico va a la consola del servidor, solo para errores del servidor.
  if (status >= 500) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} ->`, err);
  }

  const mensaje = traducido
    ? traducido.error
    : status >= 500
      ? 'Error interno del servidor.'
      : err.message;

  res.status(status).json({ error: mensaje });
}

module.exports = manejadorErrores;
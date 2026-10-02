// Middleware de errores centralizado (Parte E, ejercicio 1).
// Express lo reconoce como "de errores" por tener EXACTAMENTE 4 parámetros,
// aunque `next` solo se use en un caso.
// Debe ir al final de server.js, después de todas las rutas y middlewares.
function manejadorErrores(err, req, res, next) {
  // Si ya se empezó a responder no se puede enviar otra respuesta
  // ("Cannot set headers after they are sent", visto en la Unidad 6).
  if (res.headersSent) {
    return next(err);
  }

  // express.json() lanza este error cuando el body no es JSON válido: es culpa del cliente (400).
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El body no es un JSON válido.' });
  }

  const status = err.status || err.statusCode || 500;

  // El detalle técnico va a la consola del servidor, no al cliente.
  console.error(`[ERROR] ${req.method} ${req.originalUrl} ->`, err);

  res.status(status).json({
    error: status >= 500 ? 'Error interno del servidor.' : err.message
  });
}

module.exports = manejadorErrores;
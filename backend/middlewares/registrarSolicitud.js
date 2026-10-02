// Middleware propio (Parte D, ejercicio 2): registra cada solicitud.
// Se aplica con app.use() ANTES de las rutas.
function registrarSolicitud(req, res, next) {
  const inicio = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);

  // 'finish' es el evento que emite res cuando la respuesta termina de enviarse
  // (el mismo patrón EventEmitter visto en la Unidad 6).
  res.on('finish', () => {
    console.log(`   -> ${res.statusCode} (${Date.now() - inicio} ms)`);
  });

  next();
}

module.exports = registrarSolicitud;
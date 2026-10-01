// Se ubica DESPUÉS de todas las rutas: si nadie respondió, la ruta no existe.
// Sin esto, Express responde con una página HTML en vez de JSON.
function noEncontrado(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

module.exports = noEncontrado;
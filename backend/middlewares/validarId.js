// Se usa con router.param('id', validarId): Express lo ejecuta automáticamente
// en toda ruta que tenga el parámetro :id, antes del handler.
function validarId(req, res, next, valor) {
  if (!/^\d+$/.test(valor)) {
    return res.status(400).json({ error: `El id "${valor}" no es válido: debe ser un número entero.` });
  }
  req.idRecurso = Number(valor);
  next();
}

module.exports = validarId;
const { esIdValido } = require('../utils/validaciones');

// Se usa con router.param('id', validarId): Express lo ejecuta automáticamente
// en toda ruta que tenga el parámetro :id, antes del handler.
function validarId(req, res, next, valor) {
  const numero = Number(valor);
  if (!/^\d+$/.test(valor) || !esIdValido(numero)) {
    return res.status(400).json({ error: `El id "${valor}" no es válido: debe ser un entero positivo.` });
  }
  req.idRecurso = numero;
  next();
}

module.exports = validarId;
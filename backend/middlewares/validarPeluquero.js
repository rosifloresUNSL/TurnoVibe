const { estaVacio, REGEX_EMAIL } = require('../utils/validaciones');

function cuerpoSeguro(req) {
  return req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
}

function validarNombre(nombre, detalles) {
  if (typeof nombre !== 'string' || nombre.trim().length < 2 || nombre.trim().length > 60) {
    detalles.nombre = 'Debe ser un texto de entre 2 y 60 caracteres.';
  }
}

// POST /api/peluqueros: nombre + credenciales de la cuenta de acceso.
function validarAltaPeluquero(req, res, next) {
  const { nombre, email, password } = cuerpoSeguro(req);
  const faltantes = ['nombre', 'email', 'password'].filter((c) => estaVacio(cuerpoSeguro(req)[c]));
  if (faltantes.length > 0) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.', camposFaltantes: faltantes });
  }

  const detalles = {};
  validarNombre(nombre, detalles);
  if (typeof email !== 'string' || !REGEX_EMAIL.test(email.trim())) {
    detalles.email = 'Formato de email inválido.';
  }
  // Máximo 128: bcrypt solo usa los primeros 72 bytes y un texto enorme sería un abuso de CPU.
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    detalles.password = 'Debe tener entre 8 y 128 caracteres.';
  }

  if (Object.keys(detalles).length > 0) {
    return res.status(400).json({ error: 'Hay campos con valores inválidos.', detalles });
  }
  next();
}

// PUT /api/peluqueros/:id: solo el nombre.
function validarEdicionPeluquero(req, res, next) {
  const { nombre } = cuerpoSeguro(req);
  if (estaVacio(nombre)) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.', camposFaltantes: ['nombre'] });
  }
  const detalles = {};
  validarNombre(nombre, detalles);
  if (Object.keys(detalles).length > 0) {
    return res.status(400).json({ error: 'Hay campos con valores inválidos.', detalles });
  }
  next();
}

module.exports = { validarAltaPeluquero, validarEdicionPeluquero };
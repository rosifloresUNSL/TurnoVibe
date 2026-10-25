// Contraseñas (bcrypt) y tokens (JWT). Es el único archivo que usa esas dos librerías.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

// Costo del hash: cada +1 duplica el tiempo. 10 es el valor habitual (~50-100 ms).
const COSTO_BCRYPT = 10;

// Hash de una contraseña que nadie conoce, calculado una vez al arrancar (bloqueante ~80 ms).
// Lo usa el login cuando el email no existe, para que tarde lo mismo que con un email real.
const HASH_FALSO = bcrypt.hashSync('contraseña-que-nadie-conoce', COSTO_BCRYPT);

function hashearPassword(password) {
  return bcrypt.hash(password, COSTO_BCRYPT);
}

function verificarPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// El token solo lleva el id del usuario ("sub"). El rol NO viaja en el token: se lee de la
// base en cada solicitud, así un cambio de rol o una baja se aplican de inmediato.
function firmarToken(usuarioId) {
  return jwt.sign({ sub: String(usuarioId) }, config.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: config.jwtExpiresIn
  });
}

// Lanza un error si el token está vencido, alterado o firmado con otro algoritmo.
// "algorithms" fija el algoritmo aceptado: evita ataques que cambian el algoritmo del token.
function verificarToken(token) {
  return jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] });
}

module.exports = { HASH_FALSO, hashearPassword, verificarPassword, firmarToken, verificarToken };
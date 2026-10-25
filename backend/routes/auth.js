const express = require('express');
const usuariosRepository = require('../repositories/usuariosRepository');
const authService = require('../services/authService');
const { autenticar } = require('../middlewares/autenticar');
const { crearLimitador } = require('../middlewares/limitarIntentosLogin');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
const limitador = crearLimitador();

function datosPublicos(usuario) {
  const { id, nombre, email, rol, peluqueroId } = usuario;
  return { id, nombre, email, rol, peluqueroId };
}

// POST /api/auth/login  { email, password } -> { token, usuario }
router.post(
  '/login',
  limitador.middleware,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body ?? {};

    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
    }
    if (password.length > 128) {
      return res.status(400).json({ error: 'La contraseña es demasiado larga.' });
    }

    // Si el email no existe igual se ejecuta bcrypt (contra un hash falso): así "email inexistente"
    // y "clave incorrecta" tardan lo mismo y nadie puede descubrir qué emails están registrados
    // midiendo tiempos de respuesta.
    const usuario = await usuariosRepository.buscarPorEmail(email.trim());
    const coincide = await authService.verificarPassword(
      password,
      usuario ? usuario.passwordHash : authService.HASH_FALSO
    );

    // Mismo mensaje para "no existe", "clave incorrecta" y "cuenta inactiva".
    if (!usuario || !usuario.activo || !coincide) {
      limitador.registrarFallo(req);
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    limitador.reiniciar(req);
    res.status(200).json({ token: authService.firmarToken(usuario.id), usuario: datosPublicos(usuario) });
  })
);

// GET /api/auth/me -> el usuario de la sesión actual (el frontend lo usa al recargar la página)
router.get('/me', autenticar, (req, res) => {
  res.status(200).json(datosPublicos(req.usuario));
});

module.exports = router;
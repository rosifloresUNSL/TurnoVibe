const express = require('express');
const peluquerosRepository = require('../repositories/peluquerosRepository');
const turnosRepository = require('../repositories/turnosRepository');
const authService = require('../services/authService');
const { puedeGestionarPeluquero } = require('../services/permisos');
const { autenticar, autorizar } = require('../middlewares/autenticar');
const { validarAltaPeluquero, validarEdicionPeluquero } = require('../middlewares/validarPeluquero');
const validarFiltros = require('../middlewares/validarFiltros');
const validarId = require('../middlewares/validarId');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.param('id', validarId);

// GET /api/peluqueros  -> PÚBLICO (el cliente elige peluquero al reservar)
router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.status(200).json(await peluquerosRepository.listar());
  })
);

// POST /api/peluqueros  (solo admin) -> crea el peluquero Y su cuenta de acceso
router.post(
  '/',
  autenticar,
  autorizar('admin'),
  validarAltaPeluquero,
  asyncHandler(async (req, res) => {
    const passwordHash = await authService.hashearPassword(req.body.password);
    const nuevo = await peluquerosRepository.crearConUsuario({
      nombre: req.body.nombre.trim(),
      email: req.body.email.trim().toLowerCase(),
      passwordHash
    });
    res.status(201).location(`/api/peluqueros/${nuevo.id}`).json(nuevo);
  })
);

// PUT /api/peluqueros/:id  (solo admin) -> cambia el nombre
router.put(
  '/:id',
  autenticar,
  autorizar('admin'),
  validarEdicionPeluquero,
  asyncHandler(async (req, res) => {
    const actualizado = await peluquerosRepository.actualizarNombre(req.idRecurso, req.body.nombre.trim());
    if (!actualizado) {
      return res.status(404).json({ error: `No existe el peluquero ${req.idRecurso}.` });
    }
    res.status(200).json(actualizado);
  })
);

// DELETE /api/peluqueros/:id  (solo admin) -> 409 si tiene turnos
router.delete(
  '/:id',
  autenticar,
  autorizar('admin'),
  asyncHandler(async (req, res) => {
    const borrado = await peluquerosRepository.eliminar(req.idRecurso);
    if (!borrado) {
      return res.status(404).json({ error: `No existe el peluquero ${req.idRecurso}.` });
    }
    res.sendStatus(204);
  })
);

// GET /api/peluqueros/:id/turnos  -> anidado. Admin: cualquiera. Staff: solo el suyo.
router.get(
  '/:id/turnos',
  autenticar,
  validarFiltros,
  asyncHandler(async (req, res) => {
    if (!puedeGestionarPeluquero(req.usuario, req.idRecurso)) {
      return res.status(403).json({ error: 'No tenés permiso para ver la agenda de otro peluquero.' });
    }

    const peluquero = await peluquerosRepository.obtenerPorId(req.idRecurso);
    if (!peluquero) {
      return res.status(404).json({ error: `No existe el peluquero ${req.idRecurso}.` });
    }

    // peluqueroId se fuerza desde la URL: no se puede pisar con un query param.
    const filtros = { ...req.query, peluqueroId: peluquero.id };
    res.status(200).json(await turnosRepository.listar(filtros));
  })
);

module.exports = router;
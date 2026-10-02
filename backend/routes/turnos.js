const express = require('express');
const turnosRepository = require('../repositories/turnosRepository');
const { construirTurno } = require('../services/turnosService');
const { validarTurno } = require('../middlewares/validarTurno');
const validarFiltros = require('../middlewares/validarFiltros');
const validarId = require('../middlewares/validarId');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// Valida el :id una sola vez para todas las rutas que lo usan.
router.param('id', validarId);

// Los errores de la base (horario ocupado, peluquero inexistente...) NO se manejan acá:
// se dejan subir y manejadorErrores los traduce a 409 / 400. Las rutas quedan simples.

// GET /api/turnos            -> lista todos
// GET /api/turnos?fecha=2026-10-02&estado=confirmado&peluqueroId=1  -> filtra (query params)
router.get(
  '/',
  validarFiltros,
  asyncHandler(async (req, res) => {
    res.status(200).json(await turnosRepository.listar(req.query));
  })
);

// GET /api/turnos/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const turno = await turnosRepository.obtenerPorId(req.idRecurso);
    if (!turno) {
      return res.status(404).json({ error: `No existe el turno ${req.idRecurso}.` });
    }
    res.status(200).json(turno);
  })
);

// POST /api/turnos  (validarTurno corre antes y responde 400 si el body no sirve)
router.post(
  '/',
  validarTurno,
  asyncHandler(async (req, res) => {
    const datos = construirTurno(req.body, req.catalogoServicios);
    const nuevo = await turnosRepository.crear(datos);

    // Buena práctica REST: 201 + header Location apuntando al nuevo recurso.
    res.status(201).location(`/api/turnos/${nuevo.id}`).json(nuevo);
  })
);

// PUT /api/turnos/:id  -> reemplaza el turno completo (por eso exige todos los campos)
router.put(
  '/:id',
  validarTurno,
  asyncHandler(async (req, res) => {
    const datos = construirTurno(req.body, req.catalogoServicios);
    const actualizado = await turnosRepository.reemplazar(req.idRecurso, datos);
    if (!actualizado) {
      return res.status(404).json({ error: `No existe el turno ${req.idRecurso}.` });
    }
    res.status(200).json(actualizado);
  })
);

// DELETE /api/turnos/:id  -> 204 sin cuerpo
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const borrado = await turnosRepository.eliminar(req.idRecurso);
    if (!borrado) {
      return res.status(404).json({ error: `No existe el turno ${req.idRecurso}.` });
    }
    res.sendStatus(204);
  })
);

module.exports = router;
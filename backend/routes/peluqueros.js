const express = require('express');
const peluquerosRepository = require('../repositories/peluquerosRepository');
const turnosRepository = require('../repositories/turnosRepository');
const validarFiltros = require('../middlewares/validarFiltros');
const validarId = require('../middlewares/validarId');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.param('id', validarId);

// GET /api/peluqueros
router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.status(200).json(await peluquerosRepository.listar());
  })
);

// GET /api/peluqueros/:id/turnos  -> endpoint ANIDADO: los turnos de un peluquero.
// También acepta filtros: /api/peluqueros/1/turnos?fecha=2026-10-02
router.get(
  '/:id/turnos',
  validarFiltros,
  asyncHandler(async (req, res) => {
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
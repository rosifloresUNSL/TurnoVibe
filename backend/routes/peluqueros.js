const express = require('express');
const peluqueros = require('../data/peluqueros');
const { filtrarTurnos } = require('../services/turnosService');
const validarId = require('../middlewares/validarId');

const router = express.Router();

router.param('id', validarId);

// GET /api/peluqueros
router.get('/', (req, res) => {
  res.status(200).json(peluqueros);
});

// GET /api/peluqueros/:id/turnos  -> endpoint ANIDADO: los turnos de un peluquero.
// También acepta filtros: /api/peluqueros/1/turnos?fecha=2026-10-02
router.get('/:id/turnos', (req, res) => {
  const peluquero = peluqueros.find((p) => p.id === req.idRecurso);
  if (!peluquero) {
    return res.status(404).json({ error: `No existe el peluquero ${req.idRecurso}.` });
  }

  // peluqueroId se fuerza desde la URL: no se puede pisar con un query param.
  const filtros = { ...req.query, peluqueroId: peluquero.id };
  res.status(200).json(filtrarTurnos(filtros));
});

module.exports = router;
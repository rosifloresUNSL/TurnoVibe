const express = require('express');
const { turnos, generarId } = require('../data/turnos');
const peluqueros = require('../data/peluqueros');
const { construirTurno, filtrarTurnos, buscarConflicto } = require('../services/turnosService');
const { validarTurno } = require('../middlewares/validarTurno');
const validarId = require('../middlewares/validarId');

const router = express.Router();

// Valida el :id una sola vez para todas las rutas que lo usan.
router.param('id', validarId);

// Respuestas de error repetidas en POST y PUT.
const errorPeluqueroInexistente = { error: 'El peluquero indicado no existe.' };
const errorConflicto = (conflicto) => ({
  error: 'El peluquero ya tiene un turno en ese horario.',
  conflictoConTurnoId: conflicto.id
});

// GET /api/turnos            -> lista todos
// GET /api/turnos?fecha=2026-10-02&estado=confirmado&peluqueroId=1  -> filtra (query params)
router.get('/', (req, res) => {
  res.status(200).json(filtrarTurnos(req.query));
});

// GET /api/turnos/:id
router.get('/:id', (req, res) => {
  const turno = turnos.find((t) => t.id === req.idRecurso);
  if (!turno) {
    return res.status(404).json({ error: `No existe el turno ${req.idRecurso}.` });
  }
  res.status(200).json(turno);
});

// POST /api/turnos  (validarTurno corre antes y responde 400 si el body no sirve)
router.post('/', validarTurno, (req, res) => {
  const datos = construirTurno(req.body);

  if (!peluqueros.some((p) => p.id === datos.peluqueroId)) {
    return res.status(400).json(errorPeluqueroInexistente);
  }

  const conflicto = buscarConflicto(datos);
  if (conflicto) {
    return res.status(409).json(errorConflicto(conflicto));
  }

  const nuevo = { id: generarId(), ...datos, creadoEn: new Date().toISOString() };
  turnos.push(nuevo);

  // Buena práctica REST: 201 + header Location apuntando al nuevo recurso.
  res.status(201).location(`/api/turnos/${nuevo.id}`).json(nuevo);
});

// PUT /api/turnos/:id  -> reemplaza el turno completo (por eso exige todos los campos)
router.put('/:id', validarTurno, (req, res) => {
  const indice = turnos.findIndex((t) => t.id === req.idRecurso);
  if (indice === -1) {
    return res.status(404).json({ error: `No existe el turno ${req.idRecurso}.` });
  }

  const datos = construirTurno(req.body);

  if (!peluqueros.some((p) => p.id === datos.peluqueroId)) {
    return res.status(400).json(errorPeluqueroInexistente);
  }

  // Se ignora a sí mismo: mover un turno dentro de su propio horario no es conflicto.
  const conflicto = buscarConflicto(datos, req.idRecurso);
  if (conflicto) {
    return res.status(409).json(errorConflicto(conflicto));
  }

  turnos[indice] = { id: req.idRecurso, ...datos, creadoEn: turnos[indice].creadoEn };
  res.status(200).json(turnos[indice]);
});

// DELETE /api/turnos/:id  -> 204 sin cuerpo
router.delete('/:id', (req, res) => {
  const indice = turnos.findIndex((t) => t.id === req.idRecurso);
  if (indice === -1) {
    return res.status(404).json({ error: `No existe el turno ${req.idRecurso}.` });
  }
  turnos.splice(indice, 1);
  res.sendStatus(204);
});

module.exports = router;
const express = require('express');
const turnosRepository = require('../repositories/turnosRepository');
const { construirTurno } = require('../services/turnosService');
const { puedeGestionarPeluquero, esAdmin } = require('../services/permisos');
const { autenticar, autenticarOpcional } = require('../middlewares/autenticar');
const { validarTurno } = require('../middlewares/validarTurno');
const validarFiltros = require('../middlewares/validarFiltros');
const validarId = require('../middlewares/validarId');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// Valida el :id una sola vez para todas las rutas que lo usan.
router.param('id', validarId);

const respuesta403 = { error: 'No tenés permiso sobre los turnos de otro peluquero.' };

// Los errores de la base (horario ocupado, peluquero inexistente...) NO se manejan acá:
// se dejan subir y manejadorErrores los traduce a 409 / 400.

// GET /api/turnos  (requiere login) -> contiene datos personales de clientes.
// Admin: todos (con filtros opcionales). Staff: SIEMPRE solo los de su agenda.
router.get(
  '/',
  autenticar,
  validarFiltros,
  asyncHandler(async (req, res) => {
    const filtros = esAdmin(req.usuario) ? req.query : { ...req.query, peluqueroId: req.usuario.peluqueroId };
    res.status(200).json(await turnosRepository.listar(filtros));
  })
);

// GET /api/turnos/:id
router.get(
  '/:id',
  autenticar,
  asyncHandler(async (req, res) => {
    const turno = await turnosRepository.obtenerPorId(req.idRecurso);
    if (!turno) {
      return res.status(404).json({ error: `No existe el turno ${req.idRecurso}.` });
    }
    if (!puedeGestionarPeluquero(req.usuario, turno.peluqueroId)) {
      return res.status(403).json(respuesta403);
    }
    res.status(200).json(turno);
  })
);

// POST /api/turnos
// - Cliente SIN login: crea su reserva. El estado lo decide el servidor (no el cliente).
// - Staff/admin con token: asignación manual. El staff solo puede cargar en SU agenda.
router.post(
  '/',
  autenticarOpcional,
  validarTurno,
  asyncHandler(async (req, res) => {
    const datos = construirTurno(req.body, req.catalogoServicios);

    if (req.usuario) {
      if (!puedeGestionarPeluquero(req.usuario, datos.peluqueroId)) {
        return res.status(403).json(respuesta403);
      }
    } else {
      // Un anónimo no puede crear turnos "cancelado" ni "pendiente_pago" a su gusto.
      // (Etapa 4: acá pasará a 'pendiente_pago' hasta que Mercado Pago confirme el pago.)
      datos.estado = 'confirmado';
    }

    const nuevo = await turnosRepository.crear(datos);

    // Buena práctica REST: 201 + header Location apuntando al nuevo recurso.
    res.status(201).location(`/api/turnos/${nuevo.id}`).json(nuevo);
  })
);

// PUT /api/turnos/:id  (requiere login) -> reemplaza el turno completo
router.put(
  '/:id',
  autenticar,
  validarTurno,
  asyncHandler(async (req, res) => {
    const existente = await turnosRepository.obtenerPorId(req.idRecurso);
    if (!existente) {
      return res.status(404).json({ error: `No existe el turno ${req.idRecurso}.` });
    }

    const datos = construirTurno(req.body, req.catalogoServicios);

    // Debe poder gestionar el turno ACTUAL y también el destino (no puede "pasárselo" a otro).
    if (
      !puedeGestionarPeluquero(req.usuario, existente.peluqueroId) ||
      !puedeGestionarPeluquero(req.usuario, datos.peluqueroId)
    ) {
      return res.status(403).json(respuesta403);
    }

    const actualizado = await turnosRepository.reemplazar(req.idRecurso, datos);
    res.status(200).json(actualizado);
  })
);

// DELETE /api/turnos/:id  (requiere login) -> 204 sin cuerpo
router.delete(
  '/:id',
  autenticar,
  asyncHandler(async (req, res) => {
    const existente = await turnosRepository.obtenerPorId(req.idRecurso);
    if (!existente) {
      return res.status(404).json({ error: `No existe el turno ${req.idRecurso}.` });
    }
    if (!puedeGestionarPeluquero(req.usuario, existente.peluqueroId)) {
      return res.status(403).json(respuesta403);
    }

    await turnosRepository.eliminar(req.idRecurso);
    res.sendStatus(204);
  })
);

module.exports = router;
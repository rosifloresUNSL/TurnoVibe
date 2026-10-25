const express = require('express');
const estadisticasRepository = require('../repositories/estadisticasRepository');
const { armarEstadisticas } = require('../services/estadisticasService');
const { esAdmin } = require('../services/permisos');
const { autenticar } = require('../middlewares/autenticar');
const { esFechaValida } = require('../utils/validaciones');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// ?desde=AAAA-MM-DD&hasta=AAAA-MM-DD (ambos opcionales). Se valida antes de llegar a la base.
function validarPeriodo(req, res, next) {
  const { desde, hasta } = req.query;
  const detalles = {};
  if (desde !== undefined && !esFechaValida(desde)) detalles.desde = 'Debe tener formato AAAA-MM-DD y ser una fecha real.';
  if (hasta !== undefined && !esFechaValida(hasta)) detalles.hasta = 'Debe tener formato AAAA-MM-DD y ser una fecha real.';
  if (Object.keys(detalles).length === 0 && desde && hasta && desde > hasta) {
    detalles.desde = '"desde" no puede ser posterior a "hasta".';
  }
  if (Object.keys(detalles).length > 0) {
    return res.status(400).json({ error: 'Período inválido.', detalles });
  }
  next();
}

// GET /api/estadisticas  (requiere login)
// - Admin: alcance global (todos los peluqueros) + desglose en "peluqueros".
// - Staff: alcance 'peluquero', SOLO sus propios números y sin la propiedad "peluqueros".
// Los ingresos suman el precio guardado al reservar (precio_unitario) de los turnos confirmados.
router.get(
  '/',
  autenticar,
  validarPeriodo,
  asyncHandler(async (req, res) => {
    const global = esAdmin(req.usuario);
    const { desde, hasta } = req.query;
    const filtros = { desde, hasta, peluqueroId: global ? null : req.usuario.peluqueroId };

    const [filasEstado, filasServicio, filasPeluquero] = await Promise.all([
      estadisticasRepository.turnosPorEstado(filtros),
      estadisticasRepository.serviciosContratados(filtros),
      global ? estadisticasRepository.resumenPorPeluquero(filtros) : []
    ]);

    res.status(200).json(
      armarEstadisticas({
        alcance: global ? 'global' : 'peluquero',
        peluqueroId: filtros.peluqueroId,
        desde,
        hasta,
        filasEstado,
        filasServicio,
        filasPeluquero
      })
    );
  })
);

module.exports = router;
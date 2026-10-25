const express = require('express');
const serviciosRepository = require('../repositories/serviciosRepository');
const peluquerosRepository = require('../repositories/peluquerosRepository');
const turnosRepository = require('../repositories/turnosRepository');
const { calcularDuracion } = require('../services/turnosService');
const { slotsDePeluquero, slotsSiguienteDisponible } = require('../services/disponibilidadService');
const { esFechaValida, esIdValido } = require('../utils/validaciones');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// GET /api/disponibilidad?fecha=2026-10-02&servicios=corte,barba            -> "siguiente disponible"
// GET /api/disponibilidad?fecha=2026-10-02&servicios=corte,barba&peluqueroId=1  -> agenda de ese peluquero
// PÚBLICO: devuelve solo horarios libres, nunca datos de clientes.
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { fecha, servicios, peluqueroId } = req.query;
    const detalles = {};

    if (!esFechaValida(fecha)) {
      detalles.fecha = 'Obligatoria, con formato AAAA-MM-DD y fecha real.';
    }

    const catalogo = await serviciosRepository.listar();
    const ids = typeof servicios === 'string' ? servicios.split(',').map((s) => s.trim()) : [];
    const idsCatalogo = catalogo.map((s) => s.id);
    if (ids.length === 0 || ids.some((id) => !idsCatalogo.includes(id)) || new Set(ids).size !== ids.length) {
      detalles.servicios = `Obligatorio: ids separados por coma, sin repetir. Válidos: ${idsCatalogo.join(', ')}.`;
    }

    let idPeluquero = null;
    if (peluqueroId !== undefined) {
      idPeluquero = Number(peluqueroId);
      if (typeof peluqueroId !== 'string' || !/^\d+$/.test(peluqueroId) || !esIdValido(idPeluquero)) {
        detalles.peluqueroId = 'Debe ser un entero positivo.';
      }
    }

    if (Object.keys(detalles).length > 0) {
      return res.status(400).json({ error: 'Parámetros inválidos.', detalles });
    }

    const duracionMinutos = calcularDuracion(ids, catalogo);
    const ocupados = await turnosRepository.listarOcupados({ fecha });

    // Agrupa los horarios ocupados por peluquero.
    const ocupadosPorPeluquero = new Map();
    for (const o of ocupados) {
      if (!ocupadosPorPeluquero.has(o.peluqueroId)) ocupadosPorPeluquero.set(o.peluqueroId, []);
      ocupadosPorPeluquero.get(o.peluqueroId).push(o);
    }

    if (idPeluquero !== null) {
      const peluquero = await peluquerosRepository.obtenerPorId(idPeluquero);
      if (!peluquero) {
        return res.status(404).json({ error: `No existe el peluquero ${idPeluquero}.` });
      }
      const slots = slotsDePeluquero(peluquero, duracionMinutos, ocupadosPorPeluquero.get(peluquero.id) ?? []);
      return res.status(200).json({ fecha, duracionMinutos, modo: 'por_peluquero', slots });
    }

    const peluqueros = await peluquerosRepository.listar();
    const slots = slotsSiguienteDisponible(peluqueros, duracionMinutos, ocupadosPorPeluquero);
    res.status(200).json({ fecha, duracionMinutos, modo: 'siguiente_disponible', slots });
  })
);

module.exports = router;
const express = require('express');
const serviciosRepository = require('../repositories/serviciosRepository');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// GET /api/servicios  (catálogo de solo lectura)
router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.status(200).json(await serviciosRepository.listar());
  })
);

module.exports = router;
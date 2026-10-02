const express = require('express');
const servicios = require('../data/servicios');

const router = express.Router();

// GET /api/servicios  (catálogo de solo lectura)
router.get('/', (req, res) => {
  res.status(200).json(servicios);
});

module.exports = router;
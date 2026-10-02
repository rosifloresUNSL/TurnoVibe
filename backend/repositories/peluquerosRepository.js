const { query } = require('../db/pool');

async function listar() {
  const { rows } = await query('SELECT id, nombre FROM peluqueros ORDER BY id');
  return rows;
}

async function obtenerPorId(id) {
  const { rows } = await query('SELECT id, nombre FROM peluqueros WHERE id = $1', [id]);
  return rows[0] ?? null;
}

module.exports = { listar, obtenerPorId };
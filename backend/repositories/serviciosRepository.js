const { query } = require('../db/pool');

async function listar() {
  const { rows } = await query(
    `SELECT id,
            nombre,
            duracion_minutos AS "duracionMinutos",
            precio
       FROM servicios
      ORDER BY id`
  );
  return rows;
}

module.exports = { listar };
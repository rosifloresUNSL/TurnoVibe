const { query } = require('../db/pool');

const COLUMNAS_PUBLICAS = `id, nombre, email, rol, peluquero_id AS "peluqueroId", activo`;

// Solo para el login: es el ÚNICO lugar que devuelve el hash de la contraseña.
async function buscarPorEmail(email) {
  const { rows } = await query(
    `SELECT ${COLUMNAS_PUBLICAS}, password_hash AS "passwordHash"
       FROM usuarios
      WHERE lower(email) = lower($1)`,
    [email]
  );
  return rows[0] ?? null;
}

async function obtenerPorId(id) {
  const { rows } = await query(`SELECT ${COLUMNAS_PUBLICAS} FROM usuarios WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

module.exports = { buscarPorEmail, obtenerPorId };
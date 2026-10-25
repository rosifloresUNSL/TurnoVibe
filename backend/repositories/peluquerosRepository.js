const { query, conTransaccion } = require('../db/pool');

async function listar() {
  const { rows } = await query('SELECT id, nombre FROM peluqueros ORDER BY id');
  return rows;
}

async function obtenerPorId(id) {
  const { rows } = await query('SELECT id, nombre FROM peluqueros WHERE id = $1', [id]);
  return rows[0] ?? null;
}

// Alta de un peluquero + su cuenta de acceso (staff) en una sola transacción:
// nunca queda un peluquero sin cuenta ni una cuenta sin peluquero.
function crearConUsuario({ nombre, email, passwordHash }) {
  return conTransaccion(async (client) => {
    const { rows } = await client.query(
      'INSERT INTO peluqueros (nombre) VALUES ($1) RETURNING id, nombre',
      [nombre]
    );
    const peluquero = rows[0];

    await client.query(
      `INSERT INTO usuarios (nombre, email, password_hash, rol, peluquero_id)
       VALUES ($1, $2, $3, 'staff', $4)`,
      [nombre, email, passwordHash, peluquero.id]
    );
    return { ...peluquero, email };
  });
}

// Devuelve el peluquero actualizado, o null si el id no existe.
async function actualizarNombre(id, nombre) {
  const { rows } = await query(
    'UPDATE peluqueros SET nombre = $2 WHERE id = $1 RETURNING id, nombre',
    [id, nombre]
  );
  if (rows.length === 0) return null;
  // Se mantiene sincronizado el nombre que muestra su cuenta.
  await query('UPDATE usuarios SET nombre = $2 WHERE peluquero_id = $1', [id, nombre]);
  return rows[0];
}

// Devuelve true si borró. Su cuenta de acceso se borra sola (ON DELETE CASCADE).
// Si tiene turnos, la base lo impide (23503) y se responde 409.
async function eliminar(id) {
  try {
    const { rowCount } = await query('DELETE FROM peluqueros WHERE id = $1', [id]);
    return rowCount > 0;
  } catch (error) {
    if (error.code === '23503') {
      throw Object.assign(new Error('No se puede eliminar un peluquero que tiene turnos.'), {
        status: 409
      });
    }
    throw error;
  }
}

module.exports = { listar, obtenerPorId, crearConUsuario, actualizarNombre, eliminar };
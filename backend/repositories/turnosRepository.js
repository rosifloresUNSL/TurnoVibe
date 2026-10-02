// Acceso a datos de turnos: es el ÚNICO archivo que conoce el SQL de esta entidad.
// Las rutas y los servicios no saben si abajo hay Postgres, MySQL o un array.
const { query, conTransaccion } = require('../db/pool');

// Las comillas dobles en los alias ("peluqueroId") hacen que Postgres devuelva
// las columnas ya con los nombres que usa la API (camelCase): no hace falta mapear filas.
// - fecha::text           -> '2026-10-02' (sin esto, "pg" devuelve un Date de JavaScript con zona horaria)
// - left(hora::text, 5)   -> '09:30' (sin los segundos)
// - array_agg(...)        -> los ids de servicio del turno como arreglo
const SELECT_TURNOS = `
  SELECT t.id,
         t.peluquero_id                      AS "peluqueroId",
         COALESCE(
           array_agg(ts.servicio_id ORDER BY ts.servicio_id)
             FILTER (WHERE ts.servicio_id IS NOT NULL),
           '{}'::text[]
         )                                   AS servicios,
         t.fecha::text                       AS fecha,
         left(t.hora_inicio::text, 5)        AS "horaInicio",
         left(t.hora_fin::text, 5)           AS "horaFin",
         t.duracion_minutos                  AS "duracionMinutos",
         t.cliente_nombre                    AS "clienteNombre",
         t.cliente_email                     AS "clienteEmail",
         t.cliente_telefono                  AS "clienteTelefono",
         t.estado,
         t.creado_en                         AS "creadoEn"
    FROM turnos t
    LEFT JOIN turno_servicios ts ON ts.turno_id = t.id`;

const AGRUPAR_Y_ORDENAR = 'GROUP BY t.id ORDER BY t.fecha, t.hora_inicio, t.id';

async function listar({ fecha, estado, peluqueroId } = {}) {
  // El WHERE se arma con condiciones fijas (texto propio) y los valores van aparte,
  // como parámetros: así los filtros del usuario no pueden inyectar SQL.
  const condiciones = [];
  const valores = [];

  if (fecha) {
    valores.push(fecha);
    condiciones.push(`t.fecha = $${valores.length}`);
  }
  if (estado) {
    valores.push(estado);
    condiciones.push(`t.estado = $${valores.length}`);
  }
  if (peluqueroId) {
    valores.push(Number(peluqueroId));
    condiciones.push(`t.peluquero_id = $${valores.length}`);
  }

  const where = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';
  const { rows } = await query(`${SELECT_TURNOS} ${where} ${AGRUPAR_Y_ORDENAR}`, valores);
  return rows;
}

async function obtenerPorId(id) {
  const { rows } = await query(`${SELECT_TURNOS} WHERE t.id = $1 ${AGRUPAR_Y_ORDENAR}`, [id]);
  return rows[0] ?? null;
}

// Inserta los servicios de un turno con una sola consulta: unnest convierte el arreglo en filas.
function insertarServicios(client, turnoId, idsServicios) {
  return client.query(
    'INSERT INTO turno_servicios (turno_id, servicio_id) SELECT $1, unnest($2::text[])',
    [turnoId, idsServicios]
  );
}

// Crear un turno toca DOS tablas (turnos y turno_servicios): va en una transacción
// para que nunca quede un turno sin sus servicios.
async function crear(turno) {
  const id = await conTransaccion(async (client) => {
    const { rows } = await client.query(
      `INSERT INTO turnos
         (peluquero_id, fecha, hora_inicio, hora_fin, duracion_minutos,
          cliente_nombre, cliente_email, cliente_telefono, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [
        turno.peluqueroId,
        turno.fecha,
        turno.horaInicio,
        turno.horaFin,
        turno.duracionMinutos,
        turno.clienteNombre,
        turno.clienteEmail,
        turno.clienteTelefono,
        turno.estado
      ]
    );
    await insertarServicios(client, rows[0].id, turno.servicios);
    return rows[0].id;
  });
  return obtenerPorId(id);
}

// Devuelve el turno actualizado, o null si el id no existe.
async function reemplazar(id, turno) {
  const existe = await conTransaccion(async (client) => {
    const { rowCount } = await client.query(
      `UPDATE turnos
          SET peluquero_id = $2, fecha = $3, hora_inicio = $4, hora_fin = $5,
              duracion_minutos = $6, cliente_nombre = $7, cliente_email = $8,
              cliente_telefono = $9, estado = $10
        WHERE id = $1`,
      [
        id,
        turno.peluqueroId,
        turno.fecha,
        turno.horaInicio,
        turno.horaFin,
        turno.duracionMinutos,
        turno.clienteNombre,
        turno.clienteEmail,
        turno.clienteTelefono,
        turno.estado
      ]
    );
    if (rowCount === 0) return false;

    await client.query('DELETE FROM turno_servicios WHERE turno_id = $1', [id]);
    await insertarServicios(client, id, turno.servicios);
    return true;
  });
  return existe ? obtenerPorId(id) : null;
}

// Devuelve true si borró algo. Los turno_servicios se borran solos (ON DELETE CASCADE).
async function eliminar(id) {
  const { rowCount } = await query('DELETE FROM turnos WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = { listar, obtenerPorId, crear, reemplazar, eliminar };
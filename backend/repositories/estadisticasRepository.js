// Consultas de agregación para los dashboards. Todo se calcula en la base (COUNT / SUM / GROUP BY):
// traer todos los turnos a Node para sumarlos allá sería lento y desperdiciaría la base.
const { query } = require('../db/pool');

// Los tres filtros son opcionales: un parámetro NULL significa "sin filtro".
// Los valores siempre viajan como parámetros ($1, $2, $3), nunca pegados en el texto del SQL.
const FILTROS = `($1::date IS NULL OR t.fecha >= $1::date)
             AND ($2::date IS NULL OR t.fecha <= $2::date)
             AND ($3::int  IS NULL OR t.peluquero_id = $3::int)`;

const valores = ({ desde, hasta, peluqueroId }) => [desde ?? null, hasta ?? null, peluqueroId ?? null];

// Cantidad de turnos por estado (confirmado, pendiente_pago, cancelado).
async function turnosPorEstado(filtros) {
  const { rows } = await query(
    `SELECT t.estado, COUNT(*)::int AS cantidad
       FROM turnos t
      WHERE ${FILTROS}
      GROUP BY t.estado`,
    valores(filtros)
  );
  return rows;
}

// Servicios más contratados e ingresos que generan. Solo cuentan los turnos confirmados:
// un turno pendiente de pago o cancelado todavía no es dinero cobrado.
// Los ingresos suman ts.precio_unitario (el precio al momento de reservar), NO el precio actual
// del catálogo: así un cambio de precio no altera lo ya facturado.
async function serviciosContratados(filtros) {
  const { rows } = await query(
    `SELECT s.id                                 AS "servicioId",
            s.nombre,
            COUNT(*)::int                        AS cantidad,
            COALESCE(SUM(ts.precio_unitario), 0)::int AS ingresos
       FROM turnos t
       JOIN turno_servicios ts ON ts.turno_id = t.id
       JOIN servicios s        ON s.id = ts.servicio_id
      WHERE t.estado = 'confirmado' AND ${FILTROS}
      GROUP BY s.id, s.nombre
      ORDER BY cantidad DESC, s.id`,
    valores(filtros)
  );
  return rows;
}

// Desglose por peluquero (solo para el admin). LEFT JOIN: un peluquero sin turnos aparece igual,
// con ceros. Por eso las condiciones sobre los turnos van en el ON y no en un WHERE
// (en el WHERE descartarían a los peluqueros sin turnos).
async function resumenPorPeluquero({ desde, hasta }) {
  const { rows } = await query(
    `SELECT p.id                                 AS "peluqueroId",
            p.nombre,
            COUNT(DISTINCT t.id)::int            AS turnos,
            COALESCE(SUM(ts.precio_unitario), 0)::int AS ingresos
       FROM peluqueros p
       LEFT JOIN turnos t ON t.peluquero_id = p.id
                         AND t.estado = 'confirmado'
                         AND ($1::date IS NULL OR t.fecha >= $1::date)
                         AND ($2::date IS NULL OR t.fecha <= $2::date)
       LEFT JOIN turno_servicios ts ON ts.turno_id = t.id
      GROUP BY p.id, p.nombre
      ORDER BY p.id`,
    [desde ?? null, hasta ?? null]
  );
  return rows;
}

module.exports = { turnosPorEstado, serviciosContratados, resumenPorPeluquero };
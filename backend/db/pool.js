// Conexión a PostgreSQL. Un Pool mantiene varias conexiones abiertas y las reutiliza:
// abrir una conexión por solicitud sería lento.
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error(
    'Falta la variable DATABASE_URL. Copiá .env.example a .env y ejecutá con "npm run dev".'
  );
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Sin este listener, un error en una conexión inactiva (por ejemplo, si cae la base)
// tira abajo todo el proceso de Node.
pool.on('error', (err) => {
  console.error('[pg] Error inesperado en una conexión inactiva:', err.message);
});

// Atajo: pool.query toma una conexión, ejecuta y la devuelve al pool.
// Siempre con parámetros ($1, $2...): NUNCA concatenar datos del usuario dentro del SQL.
function query(texto, valores) {
  return pool.query(texto, valores);
}

// Ejecuta varias consultas como UNA unidad: o se aplican todas (COMMIT) o ninguna (ROLLBACK).
// Hace falta una conexión dedicada (client), porque BEGIN y COMMIT deben ir por la misma.
async function conTransaccion(trabajo) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const resultado = await trabajo(client);
    await client.query('COMMIT');
    return resultado;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release(); // siempre devolver la conexión al pool
  }
}

module.exports = { pool, query, conTransaccion };
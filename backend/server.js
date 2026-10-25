const app = require('./app');
const { pool } = require('./db/pool');

const PUERTO = process.env.PORT || 3000;

// ---------- Arranque ----------
async function iniciar() {
  // Verificar la conexión ANTES de aceptar solicitudes: si la base no está, es mejor fallar
  // con un mensaje claro que arrancar y devolver 503 en todo.
  try {
    await pool.query('SELECT 1');
  } catch (error) {
    console.error(
      'No se pudo conectar a PostgreSQL. ¿Está levantado el contenedor? (npm run db:up)',
      error.code || error.message
    );
    process.exit(1);
  }

  const servidor = app.listen(PUERTO, () => {
    console.log(`TurnoVibe API escuchando en http://localhost:${PUERTO}`);
  });

  // "docker stop" envía SIGTERM. Dentro de un contenedor, Node es el proceso 1 y NO se cierra
  // solo con esa señal: Docker esperaría 10 segundos y lo mataría a la fuerza.
  // Se cierra ordenadamente: dejar de aceptar solicitudes y liberar las conexiones a la base.
  const apagar = (senal) => {
    console.log(`${senal} recibido: cerrando servidor...`);
    servidor.close(async () => {
      await pool.end();
      process.exit(0);
    });
  };
  process.on('SIGTERM', () => apagar('SIGTERM'));
  process.on('SIGINT', () => apagar('SIGINT'));
}

iniciar();
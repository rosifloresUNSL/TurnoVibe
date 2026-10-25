const express = require('express');

const { pool } = require('./db/pool');
const { middlewareCors } = require('./middlewares/cors');
const registrarSolicitud = require('./middlewares/registrarSolicitud');
const noEncontrado = require('./middlewares/noEncontrado');
const manejadorErrores = require('./middlewares/manejadorErrores');
const authRouter = require('./routes/auth');
const disponibilidadRouter = require('./routes/disponibilidad');
const turnosRouter = require('./routes/turnos');
const peluquerosRouter = require('./routes/peluqueros');
const serviciosRouter = require('./routes/servicios');

const app = express();
const PUERTO = process.env.PORT || 3000;

// ---------- 1. Middlewares previos a las rutas (el ORDEN importa) ----------
app.use(registrarSolicitud); // propio: va primero para registrar incluso las solicitudes que fallan
app.use(middlewareCors); // antes de las rutas: responde también los preflight (OPTIONS)
app.use(express.json()); // lee el body JSON y lo deja en req.body

// ---------- 2. Rutas ----------
app.get('/', (req, res) => {
  res.json({
    nombre: 'TurnoVibe API',
    version: '3.0.0',
    recursos: ['/api/auth', '/api/turnos', '/api/peluqueros', '/api/servicios', '/api/disponibilidad']
  });
});

app.use('/api/auth', authRouter);
app.use('/api/disponibilidad', disponibilidadRouter);
app.use('/api/turnos', turnosRouter);
app.use('/api/peluqueros', peluquerosRouter);
app.use('/api/servicios', serviciosRouter);

// Ruta TEMPORAL para probar el manejo de errores: provoca un error a propósito.
// Solo existe fuera de producción. No es un recurso REST: borrarla al terminar.
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/debug/error', () => {
    throw new Error('Error provocado a propósito para probar el middleware de errores');
  });
}

// ---------- 3. Al final: 404 y manejo centralizado de errores ----------
app.use(noEncontrado);
app.use(manejadorErrores); // siempre el último

// ---------- 4. Arranque ----------
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
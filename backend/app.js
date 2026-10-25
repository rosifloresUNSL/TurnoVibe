// Arma la aplicación Express (middlewares + rutas). NO abre el puerto ni la base de datos:
// de eso se ocupa server.js. Separarlos permite probar la API sin levantar PostgreSQL.
const express = require('express');

const { middlewareCors } = require('./middlewares/cors');
const registrarSolicitud = require('./middlewares/registrarSolicitud');
const noEncontrado = require('./middlewares/noEncontrado');
const manejadorErrores = require('./middlewares/manejadorErrores');
const authRouter = require('./routes/auth');
const disponibilidadRouter = require('./routes/disponibilidad');
const estadisticasRouter = require('./routes/estadisticas');
const turnosRouter = require('./routes/turnos');
const peluquerosRouter = require('./routes/peluqueros');
const serviciosRouter = require('./routes/servicios');

const app = express();

// ---------- 1. Middlewares previos a las rutas (el ORDEN importa) ----------
app.use(registrarSolicitud); // propio: va primero para registrar incluso las solicitudes que fallan
app.use(middlewareCors); // antes de las rutas: responde también los preflight (OPTIONS)
app.use(express.json()); // lee el body JSON y lo deja en req.body

// ---------- 2. Rutas ----------
app.get('/', (req, res) => {
  res.json({
    nombre: 'TurnoVibe API',
    version: '3.0.0',
    recursos: ['/api/auth', '/api/turnos', '/api/peluqueros', '/api/servicios', '/api/disponibilidad', '/api/estadisticas']
  });
});

app.use('/api/auth', authRouter);
app.use('/api/disponibilidad', disponibilidadRouter);
app.use('/api/estadisticas', estadisticasRouter);
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

module.exports = app;
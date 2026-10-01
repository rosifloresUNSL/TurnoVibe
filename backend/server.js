const express = require('express');

const registrarSolicitud = require('./middlewares/registrarSolicitud');
const noEncontrado = require('./middlewares/noEncontrado');
const manejadorErrores = require('./middlewares/manejadorErrores');
const turnosRouter = require('./routes/turnos');
const peluquerosRouter = require('./routes/peluqueros');
const serviciosRouter = require('./routes/servicios');

const app = express();
const PUERTO = process.env.PORT || 3000;

// ---------- 1. Middlewares previos a las rutas (el ORDEN importa) ----------
app.use(registrarSolicitud); // propio: va primero para registrar incluso las solicitudes que fallan
app.use(express.json()); // lee el body JSON y lo deja en req.body

// ---------- 2. Rutas ----------
app.get('/', (req, res) => {
  res.json({
    nombre: 'TurnoVibe API',
    version: '1.0.0',
    recursos: ['/api/turnos', '/api/peluqueros', '/api/servicios']
  });
});

app.use('/api/turnos', turnosRouter);
app.use('/api/peluqueros', peluquerosRouter);
app.use('/api/servicios', serviciosRouter);

// Ruta TEMPORAL para el ejercicio de la Parte E: provoca un error a propósito.
// Solo existe fuera de producción. No es un recurso REST: borrarla al terminar el TP.
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/debug/error', () => {
    throw new Error('Error provocado a propósito para probar el middleware de errores');
  });
}

// ---------- 3. Al final: 404 y manejo centralizado de errores ----------
app.use(noEncontrado);
app.use(manejadorErrores); // siempre el último

app.listen(PUERTO, () => {
  console.log(`TurnoVibe API escuchando en http://localhost:${PUERTO}`);
});
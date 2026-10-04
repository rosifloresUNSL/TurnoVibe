// CORS: indica al NAVEGADOR qué sitios web pueden llamar a esta API.
// El frontend (localhost:5173) y la API (localhost:3000) son "orígenes" distintos (puerto
// distinto): sin esto el navegador bloquea las respuestas.
// Ojo: CORS NO protege la API. Postman o curl lo ignoran; lo que protege es la autenticación.
const cors = require('cors');
const config = require('../config');

const opcionesCors = {
  origin(origen, callback) {
    // Sin header Origin no es un navegador (Postman, curl, otro servidor): CORS no aplica.
    if (!origen || config.corsOrigins.includes(origen)) {
      return callback(null, true);
    }
    // Origen no autorizado: no se agregan headers CORS y el navegador bloquea la respuesta.
    callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // Content-Type: application/json y Authorization hacen que el navegador mande antes una
  // solicitud "preflight" (OPTIONS); este middleware la responde solo.
  allowedHeaders: ['Content-Type', 'Authorization'],
  // Headers que el JavaScript del frontend puede leer (por defecto, ninguno de estos).
  exposedHeaders: ['Location', 'Retry-After'],
  maxAge: 600 // el navegador recuerda el preflight 10 minutos
};

module.exports = { middlewareCors: cors(opcionesCors), opcionesCors };
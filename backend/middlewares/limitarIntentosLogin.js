// Freno a la fuerza bruta: tras N logins fallidos desde una IP, se bloquea esa IP un rato.
// Está en memoria: sirve para una sola instancia del servidor (en producción se usaría Redis
// o un paquete como express-rate-limit). Si el servidor está detrás de un proxy, hay que
// configurar app.set('trust proxy', ...) para que req.ip sea la IP real del cliente.
function crearLimitador({ maximo = 10, ventanaMs = 15 * 60 * 1000 } = {}) {
  const intentos = new Map(); // ip -> { cantidad, vence }

  function vigente(ip, ahora) {
    const entrada = intentos.get(ip);
    if (entrada && entrada.vence <= ahora) {
      intentos.delete(ip);
      return undefined;
    }
    return entrada;
  }

  function middleware(req, res, next) {
    const ahora = Date.now();
    const entrada = vigente(req.ip, ahora);
    if (entrada && entrada.cantidad >= maximo) {
      res.set('Retry-After', String(Math.ceil((entrada.vence - ahora) / 1000)));
      return res.status(429).json({ error: 'Demasiados intentos fallidos. Probá de nuevo más tarde.' });
    }
    next();
  }

  function registrarFallo(req) {
    const ahora = Date.now();
    const entrada = vigente(req.ip, ahora);
    if (entrada) {
      entrada.cantidad += 1;
    } else {
      intentos.set(req.ip, { cantidad: 1, vence: ahora + ventanaMs });
    }
  }

  function reiniciar(req) {
    intentos.delete(req.ip);
  }

  // Limpieza periódica para que el Map no crezca sin límite. unref(): no impide cerrar el proceso.
  setInterval(() => {
    const ahora = Date.now();
    for (const [ip, entrada] of intentos) {
      if (entrada.vence <= ahora) intentos.delete(ip);
    }
  }, ventanaMs).unref();

  return { middleware, registrarFallo, reiniciar };
}

module.exports = { crearLimitador };
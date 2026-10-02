// Las rutas ahora son async (esperan a la base). En Express 4 un error dentro de una
// función async NO llega al middleware de errores; este envoltorio lo reenvía con next(error).
// En Express 5 ya es automático, pero así funciona igual en ambas versiones.
function asyncHandler(funcion) {
  return (req, res, next) => {
    Promise.resolve(funcion(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
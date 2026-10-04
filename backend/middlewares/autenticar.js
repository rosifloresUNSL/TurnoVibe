// Autenticación (¿quién sos?) y autorización (¿qué podés hacer?).
const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');
const usuariosRepository = require('../repositories/usuariosRepository');
const { esIdValido } = require('../utils/validaciones');

function responder401(res, mensaje) {
  res.set('WWW-Authenticate', 'Bearer');
  return res.status(401).json({ error: mensaje });
}

// Header esperado:  Authorization: Bearer <token>
// Devuelve el usuario o null si el token no sirve (formato, firma, vencimiento o usuario dado de baja).
async function usuarioDesdeCabecera(cabecera) {
  const [esquema, token, ...resto] = cabecera.split(' ');
  if (!/^bearer$/i.test(esquema) || !token || resto.length > 0) return null;

  let payload;
  try {
    payload = authService.verificarToken(token);
  } catch {
    return null; // alterado, vencido o de otro algoritmo
  }

  const id = Number(payload.sub);
  if (!esIdValido(id)) return null;

  // Se consulta la base en cada solicitud: si el usuario fue desactivado o borrado,
  // su token deja de servir aunque todavía no haya vencido.
  const usuario = await usuariosRepository.obtenerPorId(id);
  return usuario && usuario.activo ? usuario : null;
}

// Exige estar logueado. Deja el usuario en req.usuario.
const autenticar = asyncHandler(async (req, res, next) => {
  const cabecera = req.headers.authorization;
  if (!cabecera) return responder401(res, 'Falta el token. Iniciá sesión.');

  const usuario = await usuarioDesdeCabecera(cabecera);
  if (!usuario) return responder401(res, 'Token inválido o vencido. Iniciá sesión de nuevo.');

  req.usuario = usuario;
  next();
});

// Para endpoints públicos que se comportan distinto si hay sesión (ej: POST /api/turnos).
// Sin header -> sigue como anónimo. Con header inválido -> 401 (no se lo trata como anónimo
// en silencio: sería confuso para quien manda un token vencido).
const autenticarOpcional = asyncHandler(async (req, res, next) => {
  const cabecera = req.headers.authorization;
  if (!cabecera) return next();

  const usuario = await usuarioDesdeCabecera(cabecera);
  if (!usuario) return responder401(res, 'Token inválido o vencido. Iniciá sesión de nuevo.');

  req.usuario = usuario;
  next();
});

// Exige uno de los roles indicados. Va DESPUÉS de autenticar.
function autorizar(...roles) {
  return (req, res, next) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tenés permiso para realizar esta acción.' });
    }
    next();
  };
}

module.exports = { autenticar, autenticarOpcional, autorizar };
// Reglas de "quién puede tocar qué" (funciones puras).
function esAdmin(usuario) {
  return usuario?.rol === 'admin';
}

// El admin gestiona todas las agendas; el staff solo la de su propio peluquero.
function puedeGestionarPeluquero(usuario, peluqueroId) {
  if (!usuario) return false;
  return usuario.rol === 'admin' || (usuario.rol === 'staff' && usuario.peluqueroId === peluqueroId);
}

module.exports = { esAdmin, puedeGestionarPeluquero };
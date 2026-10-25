// Dónde se guarda el token de sesión (JWT).
//
// Se usa localStorage: es simple y sobrevive a recargar la página. Contrapartida: cualquier
// script que corra en la página (por ejemplo, por una vulnerabilidad XSS) podría leerlo.
// Por eso nunca se inyecta HTML crudo en la interfaz y el token vence a las 8 horas.
//
// Todo va en try/catch porque localStorage puede lanzar un error (modo privado, almacenamiento
// bloqueado o lleno): en ese caso la sesión simplemente no se recuerda.
const CLAVE = 'turnovibe_token';

export function obtenerToken() {
  try {
    return localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

export function guardarToken(token) {
  try {
    localStorage.setItem(CLAVE, token);
  } catch {
    // Sin almacenamiento disponible: la sesión dura hasta que se cierre la pestaña.
  }
}

export function borrarToken() {
  try {
    localStorage.removeItem(CLAVE);
  } catch {
    // Nada que borrar.
  }
}
// Cliente HTTP central: TODA comunicación con el backend pasa por acá.
// Se ocupa de: la URL base, enviar/recibir JSON, agregar el token, traducir los errores a un
// formato único (ApiError) y cerrar la sesión cuando el servidor responde 401.
import { obtenerToken, borrarToken } from './tokenStorage';

// En desarrollo apunta al backend local. Se puede cambiar con VITE_API_URL (ver .env.example).
const URL_BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');

// Error que lanzan todas las funciones de la API. Los componentes solo necesitan
// error.message (texto para mostrar) y, si hace falta, error.status o error.detalles.
export class ApiError extends Error {
  constructor(status, mensaje, datos = {}) {
    super(mensaje);
    this.name = 'ApiError';
    this.status = status; // 0 = no hubo respuesta (servidor caído, sin conexión, CORS)
    this.camposFaltantes = datos.camposFaltantes;
    this.detalles = datos.detalles; // { campo: 'mensaje' } en las validaciones (400)
  }
}

// El AuthContext se registra acá para enterarse cuando la sesión deja de ser válida.
let alSesionInvalida = null;
export function registrarAlSesionInvalida(funcion) {
  alSesionInvalida = funcion;
  return () => {
    if (alSesionInvalida === funcion) alSesionInvalida = null;
  };
}

// conToken: false -> no se envía el token (login y reserva pública del cliente).
export async function solicitar(ruta, { metodo = 'GET', cuerpo, conToken = true } = {}) {
  const headers = { Accept: 'application/json' };
  const token = conToken ? obtenerToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;
  if (cuerpo !== undefined) headers['Content-Type'] = 'application/json';

  let respuesta;
  try {
    respuesta = await fetch(`${URL_BASE}${ruta}`, {
      method: metodo,
      headers,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.');
  }

  if (respuesta.status === 204) return null; // éxito sin contenido (DELETE)

  let datos = null;
  try {
    datos = await respuesta.json();
  } catch {
    // La respuesta no era JSON: se usa un mensaje genérico más abajo.
  }

  if (!respuesta.ok) {
    // 401 CON token enviado = el token venció o ya no es válido: se cierra la sesión.
    // (El 401 del login no entra acá porque ese pedido no envía token.)
    if (respuesta.status === 401 && token) {
      borrarToken();
      if (alSesionInvalida) alSesionInvalida();
    }
    throw new ApiError(respuesta.status, datos?.error ?? `Error inesperado (${respuesta.status}).`, datos ?? {});
  }

  return datos;
}

// Arma "?a=1&b=2" ignorando los valores vacíos.
export function aQueryString(parametros = {}) {
  const query = new URLSearchParams();
  for (const [clave, valor] of Object.entries(parametros)) {
    if (valor !== undefined && valor !== null && valor !== '') query.set(clave, String(valor));
  }
  const texto = query.toString();
  return texto ? `?${texto}` : '';
}
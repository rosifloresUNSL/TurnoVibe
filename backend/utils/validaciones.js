// Validaciones genéricas reutilizables (funciones puras).
const ESTADOS_VALIDOS = ['pendiente_pago', 'confirmado', 'cancelado'];
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Máximo valor de un INTEGER de Postgres: pasarse produce un error de la base.
const MAX_ENTERO_POSTGRES = 2147483647;

function estaVacio(valor) {
  return (
    valor === undefined ||
    valor === null ||
    (typeof valor === 'string' && valor.trim() === '') ||
    (Array.isArray(valor) && valor.length === 0)
  );
}

function esFechaValida(texto) {
  if (typeof texto !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  // Rechaza fechas inexistentes como 2026-02-31: al reconvertir, el texto cambiaría.
  const fecha = new Date(`${texto}T00:00:00Z`);
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === texto;
}

function esIdValido(numero) {
  return Number.isInteger(numero) && numero >= 1 && numero <= MAX_ENTERO_POSTGRES;
}

module.exports = {
  ESTADOS_VALIDOS,
  REGEX_EMAIL,
  MAX_ENTERO_POSTGRES,
  estaVacio,
  esFechaValida,
  esIdValido
};
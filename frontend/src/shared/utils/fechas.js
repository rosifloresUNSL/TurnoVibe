// Fechas siempre en HORA LOCAL del navegador (toISOString() usa UTC y de noche
// puede devolver el día siguiente en Argentina).
const dos = (n) => String(n).padStart(2, '0');

export function fechaLocalISO(fecha = new Date()) {
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`;
}

export function primerDiaDelMes(fecha = new Date()) {
  return fechaLocalISO(new Date(fecha.getFullYear(), fecha.getMonth(), 1));
}

export function ultimoDiaDelMes(fecha = new Date()) {
  return fechaLocalISO(new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0));
}

// '2026-10-02' -> '02/10/2026'
export function formatearFecha(iso) {
  const [anio, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${anio}`;
}

export function formatearPesos(numero) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(numero);
}

// Hora actual como 'HH:MM' (para no ofrecer horarios que ya pasaron el día de hoy).
export function horaLocalActual(fecha = new Date()) {
  return `${dos(fecha.getHours())}:${dos(fecha.getMinutes())}`;
}
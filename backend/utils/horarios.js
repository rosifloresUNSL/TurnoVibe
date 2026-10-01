// Constantes y funciones puras para trabajar con horas "HH:MM".
// No dependen de Express ni de los datos: se pueden probar solas.

const HORA_APERTURA = '09:00';
const HORA_CIERRE = '13:00';
const INTERVALO_MINUTOS = 30;

const REGEX_HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

function esHoraValida(texto) {
  return typeof texto === 'string' && REGEX_HORA.test(texto);
}

// "09:30" -> 570
function horaAMinutos(texto) {
  const [horas, minutos] = texto.split(':').map(Number);
  return horas * 60 + minutos;
}

// 570 -> "09:30"
function minutosAHora(totalMinutos) {
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
}

// Dos intervalos [inicio, fin) se pisan si cada uno empieza antes de que termine el otro.
// Que uno termine justo cuando empieza el otro NO es solapamiento (09:00-09:30 y 09:30-10:00).
function haySolapamiento(inicioA, finA, inicioB, finB) {
  return inicioA < finB && inicioB < finA;
}

module.exports = {
  HORA_APERTURA,
  HORA_CIERRE,
  INTERVALO_MINUTOS,
  esHoraValida,
  horaAMinutos,
  minutosAHora,
  haySolapamiento
};
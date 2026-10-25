// Horario de atención. Son los MISMOS valores que usa el backend (backend/utils/horarios.js):
// si el local cambia su horario, hay que cambiarlo en los dos lugares.
export const HORA_APERTURA = '09:00';
export const HORA_CIERRE = '13:00';
export const INTERVALO_MINUTOS = 30;

export const horaAMinutos = (texto) => {
  const [horas, minutos] = texto.split(':').map(Number);
  return horas * 60 + minutos;
};

export const minutosAHora = (total) =>
  `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;

// ['09:00', '09:30', ..., '12:30']
export function generarHoras() {
  const horas = [];
  for (let m = horaAMinutos(HORA_APERTURA); m < horaAMinutos(HORA_CIERRE); m += INTERVALO_MINUTOS) {
    horas.push(minutosAHora(m));
  }
  return horas;
}
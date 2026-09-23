function horaAMinutos(horaStr) {
  const [horas, minutos] = horaStr.split(':').map(Number);
  return horas * 60 + minutos;
}

function minutosAHora(minutosTotales) {
  const horas = Math.floor(minutosTotales / 60);
  const mins = minutosTotales % 60;
  return `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

export function calcularDuracionTotal(serviciosSeleccionados) {
  return serviciosSeleccionados.reduce((total, s) => total + s.duracionMinutos, 0);
}

/**
 * Filtra los bloques de inicio donde hay N intervalos consecutivos desocupados.
 * @param {Array} agenda - Lista de { hora: "09:00", ocupado: boolean }
 * @param {number} duracionRequeridaMinutos - Ej: 30, 60 o 90
 * @returns {Array} Slots validos con hora de inicio y fin.
 */
export function obtenerSlotsDisponibles(agenda, duracionRequeridaMinutos) {
  if (!agenda || agenda.length === 0 || duracionRequeridaMinutos <= 0) return [];

  const slotsValidos = [];
  const bloquesNecesarios = duracionRequeridaMinutos / 30; 

  for (let i = 0; i <= agenda.length - bloquesNecesarios; i++) {
    let esBloqueValido = true;

    for (let j = 0; j < bloquesNecesarios; j++) {
      const actual = agenda[i + j];
      const anterior = j > 0 ? agenda[i + j - 1] : null;

      if (actual.ocupado) {
        esBloqueValido = false;
        break;
      }

      if (anterior) {
        const diff = horaAMinutos(actual.hora) - horaAMinutos(anterior.hora);
        if (diff !== 30) {
          esBloqueValido = false;
          break;
        }
      }
    }

    if (esBloqueValido) {
      const horaInicio = agenda[i].hora;
      const minsInicio = horaAMinutos(horaInicio);
      const horaFin = minutosAHora(minsInicio + duracionRequeridaMinutos);

      slotsValidos.push({
        horaInicio,
        horaFin,
        bloques: bloquesNecesarios
      });
    }
  }

  return slotsValidos;
}
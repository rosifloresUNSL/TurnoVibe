/**
 * Convierte un string "HH:MM" a minutos desde las 00:00.
 */
function horaAMinutos(horaStr) {
  if (!horaStr) return 0;
  const [horas, minutos] = horaStr.split(':').map(Number);
  return horas * 60 + minutos;
}

/**
 * Convierte minutos a formato "HH:MM".
 */
function minutosAHora(minutosTotales) {
  const horas = Math.floor(minutosTotales / 60);
  const mins = minutosTotales % 60;
  return `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Calcula la duración total sumando los minutos de cada servicio seleccionado.
 */
export function calcularDuracionTotal(serviciosSeleccionados) {
  if (!serviciosSeleccionados || !Array.isArray(serviciosSeleccionados)) return 0;
  return serviciosSeleccionados.reduce((total, s) => total + (s.duracionMinutos || 30), 0);
}

/**
 * Filtra los bloques de inicio donde hay N intervalos consecutivos desocupados.
 * @param {Array} agenda - Lista de { hora: "09:00", ocupado: boolean }
 * @param {number} duracionRequeridaMinutos - Ej: 30, 60 o 90
 * @returns {Array} Slots validos con horaInicio y horaFin.
 */
export function obtenerSlotsDisponibles(agenda, duracionRequeridaMinutos) {
  if (!agenda || !Array.isArray(agenda) || agenda.length === 0 || duracionRequeridaMinutos <= 0) {
    return [];
  }

  const slotsValidos = [];
  const bloquesNecesarios = Math.ceil(duracionRequeridaMinutos / 30);

  for (let i = 0; i <= agenda.length - bloquesNecesarios; i++) {
    let esBloqueValido = true;

    for (let j = 0; j < bloquesNecesarios; j++) {
      const actual = agenda[i + j];
      const anterior = j > 0 ? agenda[i + j - 1] : null;

      if (!actual || actual.ocupado) {
        esBloqueValido = false;
        break;
      }

      // Validar que realmente sean bloques consecutivos en horario (diferencia de 30 mins)
      if (anterior) {
        const diff = horaAMinutos(actual.hora) - horaAMinutos(anterior.hora);
        if (diff !== 30) {
          esBloqueValido = false;
          break;
        }
      }
    }

    if (esBloqueValido) {
      const horaInicioStr = agenda[i].hora;
      const minsInicio = horaAMinutos(horaInicioStr);
      const horaFinStr = minutosAHora(minsInicio + duracionRequeridaMinutos);

      slotsValidos.push({
        horaInicio: horaInicioStr,
        horaFin: horaFinStr,
        bloques: bloquesNecesarios
      });
    }
  }

  return slotsValidos;
}

/**
 * Asigna automáticamente al primer peluquero disponible para la franja y duración dada.
 * @param {Array} listaPeluqueros - Lista de peluqueros con su agenda
 * @param {number} duracionMinutos - Duración total acumulada de servicios
 * @returns {Array} Slots disponibles con el peluquero asignado automáticamente
 */
export function obtenerSlotsSiguienteDisponible(listaPeluqueros, duracionMinutos) {
  if (!listaPeluqueros || duracionMinutos <= 0) return [];

  const slotsGlobales = [];

  listaPeluqueros.forEach((peluquero) => {
    if (peluquero.agenda) {
      const slotsPeluquero = obtenerSlotsDisponibles(peluquero.agenda, duracionMinutos);

      slotsPeluquero.forEach((slot) => {
        // Verificar si ya existe este horario en la lista de slots globales
        const existente = slotsGlobales.find(
          (s) => s.horaInicio === slot.horaInicio && s.horaFin === slot.horaFin
        );

        // Si no existe, asignamos al PRIMER peluquero libre en esa franja
        if (!existente) {
          slotsGlobales.push({
            ...slot,
            peluqueroId: peluquero.id,
            peluqueroNombre: peluquero.nombre
          });
        }
      });
    }
  });

  // Ordenar horarios cronológicamente
  return slotsGlobales.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
}
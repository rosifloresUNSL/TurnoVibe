// Cálculo de horarios libres (función pura). Es la regla 1.3 del negocio:
// la duración total determina un bloque CONTINUO que debe entrar en la agenda.
const {
  HORA_APERTURA,
  HORA_CIERRE,
  INTERVALO_MINUTOS,
  horaAMinutos,
  minutosAHora,
  haySolapamiento
} = require('../utils/horarios');

// ocupados: [{ horaInicio: '10:00', horaFin: '11:00' }, ...] de UN peluquero en UN día.
function calcularSlotsLibres(duracionMinutos, ocupados) {
  const intervalos = ocupados.map((o) => [horaAMinutos(o.horaInicio), horaAMinutos(o.horaFin)]);
  const slots = [];

  for (
    let inicio = horaAMinutos(HORA_APERTURA);
    inicio + duracionMinutos <= horaAMinutos(HORA_CIERRE);
    inicio += INTERVALO_MINUTOS
  ) {
    const fin = inicio + duracionMinutos;
    const libre = !intervalos.some(([i, f]) => haySolapamiento(inicio, fin, i, f));
    if (libre) {
      slots.push({ horaInicio: minutosAHora(inicio), horaFin: minutosAHora(fin) });
    }
  }
  return slots;
}

// Modo "por peluquero": los horarios libres de ese peluquero.
function slotsDePeluquero(peluquero, duracionMinutos, ocupadosDelPeluquero) {
  return calcularSlotsLibres(duracionMinutos, ocupadosDelPeluquero).map((slot) => ({
    ...slot,
    peluqueroId: peluquero.id,
    peluqueroNombre: peluquero.nombre
  }));
}

// Modo "siguiente disponible": un horario aparece una sola vez, asignado al PRIMER
// peluquero (por id) que esté libre en ese horario.
function slotsSiguienteDisponible(peluqueros, duracionMinutos, ocupadosPorPeluquero) {
  const porHora = new Map();
  for (const peluquero of peluqueros) {
    const ocupados = ocupadosPorPeluquero.get(peluquero.id) ?? [];
    for (const slot of slotsDePeluquero(peluquero, duracionMinutos, ocupados)) {
      if (!porHora.has(slot.horaInicio)) porHora.set(slot.horaInicio, slot);
    }
  }
  return [...porHora.values()].sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
}

module.exports = { calcularSlotsLibres, slotsDePeluquero, slotsSiguienteDisponible };
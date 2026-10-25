// Textos de presentación del catálogo (categoría y descripción). Son solo de la interfaz:
// el backend guarda nombre, duración y precio. Si aparece un servicio nuevo sin entrada acá,
// se muestra igual, bajo la categoría "Otros".
const INFO = {
  corte: { categoria: 'Cabello', descripcion: 'Corte a tijera o máquina, con terminación y peinado.' },
  barba: { categoria: 'Barba', descripcion: 'Perfilado y definición de contornos con navaja.' },
  decoloracion: { categoria: 'Cabello', descripcion: 'Aclarado del cabello con productos profesionales.' }
};

export function conInfo(servicio) {
  return { categoria: 'Otros', descripcion: '', ...INFO[servicio.id], ...servicio };
}
import turnosData from '../../../data/turnos.json';

export const turnosService = {
  obtenerDisponiblesPorServicio: async (servicioId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const turnosFiltrados = turnosData.filter(
          (t) => t.servicioId === Number(servicioId) && t.disponible
        );
        resolve(turnosFiltrados);
      }, 300);
    });
  }
};
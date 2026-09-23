import serviciosData from '../../../data/servicios.json';

export const serviciosService = {
  obtenerTodos: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(serviciosData);
      }, 300);
    });
  },

  obtenerPorId: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const servicio = serviciosData.find((s) => s.id === Number(id));
        if (servicio) {
          resolve(servicio);
        } else {
          reject(new Error('Servicio no encontrado'));
        }
      }, 200);
    });
  }
};
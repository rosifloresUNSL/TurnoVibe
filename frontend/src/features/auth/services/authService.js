export const authService = {
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@turnovibe.com' && password === 'admin123') {
          const usuario = { id: 1, nombre: 'Administrador', email, rol: 'gestor' };
          localStorage.setItem('turnovibe_session', JSON.stringify(usuario));
          resolve(usuario);
        } else {
          reject(new Error('Credenciales inválidas. Pruebe admin@turnovibe.com / admin123'));
        }
      }, 500);
    });
  },

  logout: () => {
    localStorage.removeItem('turnovibe_session');
  },

  obtenerSesion: () => {
    const session = localStorage.getItem('turnovibe_session');
    return session ? JSON.parse(session) : null;
  },

  estaAutenticado: () => {
    return localStorage.getItem('turnovibe_session') !== null;
  }
};
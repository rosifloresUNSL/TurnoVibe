import usuariosData from '../../../data/usuarios.json';

const CLAVE_SESION = 'turnovibe_sesion';

export const authService = {
  login(email, password) {
    const usuario = usuariosData.find(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (usuario) {
      const datosSesion = {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        peluqueroId: usuario.peluqueroId || null
      };
      localStorage.setItem(CLAVE_SESION, JSON.stringify(datosSesion));
      return { exito: true, usuario: datosSesion };
    }

    return { exito: false, mensaje: 'Credenciales inválidas' };
  },

  logout() {
    localStorage.removeItem(CLAVE_SESION);
  },

  estaAutenticado() {
    return !!localStorage.getItem(CLAVE_SESION);
  },

  obtenerUsuario() {
    const sesion = localStorage.getItem(CLAVE_SESION);
    return sesion ? JSON.parse(sesion) : null;
  },

  // Alias para mantener compatibilidad con GestorLayout
  obtenerSesion() {
    return this.obtenerUsuario();
  }
};
import { createContext, useContext, useState } from 'react';
import usuariosData from '../data/usuarios.json';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const sesionGuardada = localStorage.getItem('turnovibe_sesion');
    return sesionGuardada ? JSON.parse(sesionGuardada) : null;
  });

  const login = (email, password) => {
    const encontrado = usuariosData.find(
      (u) => u.email === email && u.password === password
    );

    if (encontrado) {
      const datosSesion = {
        id: encontrado.id,
        nombre: encontrado.nombre,
        email: encontrado.email,
        rol: encontrado.rol,
        peluqueroId: encontrado.peluqueroId || null
      };
      setUsuario(datosSesion);
      localStorage.setItem('turnovibe_sesion', JSON.stringify(datosSesion));
      return { exito: true, rol: encontrado.rol };
    }

    return { exito: false, mensaje: 'Credenciales inválidas' };
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('turnovibe_sesion');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
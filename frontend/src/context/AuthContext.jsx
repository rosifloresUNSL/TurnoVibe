import { createContext, useContext, useState } from 'react';
import { authService } from '../features/auth/services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => authService.obtenerUsuario());

  const login = (email, password) => {
    const resultado = authService.login(email, password);
    if (resultado.exito) {
      setUsuario(resultado.usuario);
    }
    return resultado;
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>.');
  }
  return contexto;
}
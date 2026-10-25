import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/endpoints';
import { registrarAlSesionInvalida } from '../api/apiClient';
import { obtenerToken, guardarToken, borrarToken } from '../api/tokenStorage';

const AuthContext = createContext(null);

// Estado de la sesión de toda la aplicación.
// - usuario: { id, nombre, email, rol, peluqueroId } o null si no hay sesión.
// - cargando: true mientras se valida con el servidor un token guardado al abrir la página.
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  // Si hay un token guardado, hasta confirmar que sigue siendo válido no se sabe si hay sesión.
  const [cargando, setCargando] = useState(() => obtenerToken() !== null);

  const logout = useCallback(() => {
    borrarToken();
    setUsuario(null);
  }, []);

  // Si en cualquier pedido el servidor responde 401 con token, la sesión se cierra sola.
  useEffect(() => registrarAlSesionInvalida(logout), [logout]);

  // Al abrir la página: si hay token, se le pregunta al servidor quién es (GET /api/auth/me).
  useEffect(() => {
    if (!obtenerToken()) return undefined;
    let descartada = false;

    authApi
      .usuarioActual()
      .then((datos) => {
        if (!descartada) setUsuario(datos);
      })
      .catch(() => {
        // 401: el cliente HTTP ya cerró la sesión. Otro error (servidor caído): queda sin sesión.
      })
      .finally(() => {
        if (!descartada) setCargando(false);
      });

    return () => {
      descartada = true;
    };
  }, []);

  // Lanza un ApiError si las credenciales son incorrectas: la pantalla de login lo muestra.
  const login = useCallback(async (email, password) => {
    const { token, usuario: datos } = await authApi.login(email, password);
    guardarToken(token);
    setUsuario(datos);
    return datos;
  }, []);

  const valor = useMemo(() => ({ usuario, cargando, login, logout }), [usuario, cargando, login, logout]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>.');
  }
  return contexto;
}
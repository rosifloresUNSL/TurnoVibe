import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';

// Ruta "guardia": solo deja pasar a quien tiene sesión (y, si se indican, uno de los roles).
// Es una comodidad de la interfaz: la seguridad real la aplica el servidor en cada pedido.
export function RutaProtegida({ roles }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Verificando sesión...</span>
        </div>
      </div>
    );
  }

  if (!usuario) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to={usuario.rol === 'admin' ? '/admin/dashboard' : '/staff/dashboard'} replace />;
  }

  return <Outlet />;
}
import { Outlet, Link, useNavigate } from 'react-router';
import { authService } from '../../features/auth';

export function GestorLayout() {
  const navigate = useNavigate();
  const usuario = authService.obtenerUsuario();

  const handleCerrarSesion = () => {
    authService.logout();
    navigate('/login');
  };

  const esAdmin = usuario?.rol === 'admin';
  const rutaDashboard = esAdmin ? '/admin/dashboard' : '/staff/dashboard';

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar de administración */}
      <aside className="bg-dark text-white p-3 d-flex flex-column" style={{ width: '250px' }}>
        <h4 className="fw-bold text-primary mb-2">TurnoVibe</h4>
        <span className="badge bg-secondary mb-3 align-self-start text-uppercase">
          {usuario?.rol || 'Staff'}
        </span>
        <p className="small text-muted mb-4">Bienvenido, {usuario?.nombre || 'Usuario'}</p>

        <nav className="nav nav-pills flex-column mb-auto gap-2">
          <Link to={rutaDashboard} className="nav-link text-white active">
            📋 Panel de Control
          </Link>
          <Link to="/" className="nav-link text-white-50">
            🌐 Ir al Sitio Público
          </Link>
        </nav>

        <button onClick={handleCerrarSesion} className="btn btn-outline-danger w-100 mt-auto">
          Cerrar Sesión
        </button>
      </aside>

      {/* Contenido dinámico del Panel */}
      <main className="flex-grow-1 bg-light p-4 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
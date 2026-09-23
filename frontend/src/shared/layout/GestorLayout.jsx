import { Outlet, Link, useNavigate } from 'react-router';
import { authService } from '../../features/auth';

export function GestorLayout() {
  const navigate = useNavigate();
  const usuario = authService.obtenerSesion();

  const handleCerrarSesion = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="d-flex min-vh-100">
      <aside className="bg-dark text-white p-3 d-flex flex-column" style={{ width: '250px' }}>
        <h4 className="fw-bold text-primary mb-4">TURNOVIBE Admin</h4>
        <p className="small text-muted mb-4">Bienvenido, {usuario?.nombre}</p>

        <nav className="nav nav-pills flex-column mb-auto">
          <Link to="/gestor" className="nav-link text-white active mb-2">
            Panel de Turnos
          </Link>
          <Link to="/" className="nav-link text-white-50">
            Ir al Sitio Público
          </Link>
        </nav>

        <button onClick={handleCerrarSesion} className="btn btn-outline-danger w-100 mt-auto">
          Cerrar Sesión
        </button>
      </aside>

      <main className="flex-grow-1 bg-light p-4">
        <Outlet />
      </main>
    </div>
  );
}
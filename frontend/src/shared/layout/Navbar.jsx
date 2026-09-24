import { NavLink, Link } from 'react-router-dom'; // o Link / NavLink de react-router-dom

export function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold fs-4">
          TurnoVibe
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-link navbar-nav ms-auto gap-2">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/turnos" className="nav-link">
                Reservar Turno
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/servicios" className="nav-link">
                Servicios
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="btn btn-outline-light ms-lg-2">
                Acceso Staff
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
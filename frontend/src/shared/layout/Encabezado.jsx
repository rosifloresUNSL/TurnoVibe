import { useState } from 'react';
import { Link, NavLink } from 'react-router';

const claseEnlace = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

export function Encabezado() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const alternarMenu = () => setMenuAbierto((prev) => !prev);
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold fs-4" onClick={cerrarMenu}>
          TurnoVibe
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={menuAbierto}
          aria-label="Mostrar u ocultar el menú"
          onClick={alternarMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse ${menuAbierto ? 'show' : ''}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item">
              <NavLink to="/" end className={claseEnlace} onClick={cerrarMenu}>
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/turnos" className={claseEnlace} onClick={cerrarMenu}>
                Reservar Turno
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/servicios" className={claseEnlace} onClick={cerrarMenu}>
                Servicios
              </NavLink>
            </li>
            <li className="nav-item">
              <Link to="/login" className="btn btn-outline-light ms-lg-2" onClick={cerrarMenu}>
                Acceso Staff
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
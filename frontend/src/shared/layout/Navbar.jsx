import { Link, NavLink } from 'react-router';

export function Navbar({ marca = 'TURNOVIBE', enlaces = [] }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          {marca}
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {enlaces.map((enlace) => (
              <li className="nav-item" key={enlace.path}>
                <NavLink
                  to={enlace.path}
                  className={({ isActive }) =>
                    isActive ? 'nav-link active fw-bold' : 'nav-link'
                  }
                >
                  {enlace.etiqueta}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
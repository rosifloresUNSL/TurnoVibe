import { Link } from 'react-router-dom'

function Header() {
  return (
    <>
    <header id="main-header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          
          <Link className="navbar-brand" to="/">
            <h1 className="h3 mb-0">TurnoVibe</h1>
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
  
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Inicio</Link>
              </li>
              <li className="nav-item">
                {/* Aquí está la magia: apunta a /servicios */}
                <Link className="nav-link" to="/servicios">Servicios y Precios</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/peluqueros">Peluqueros</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Administración</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    </>
  )
}

export default Header
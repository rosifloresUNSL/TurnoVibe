function Footer() {
  return (
    <footer className="bg-light text-center text-lg-start border-top mt-5">
      <div className="container p-4">
        <div className="row">
          
          {/* Columna de información */}
          <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
            <h5 className="text-uppercase fw-bold">TurnoVibe</h5>
            <p className="text-muted">
              Tu plataforma de confianza para gestionar turnos de peluquería de forma rápida y sencilla.
            </p>
          </div>

          {/* Columna de enlaces rápidos */}
          <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
            <h5 className="text-uppercase fw-bold">Enlaces Rápidos</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="index.html" className="text-dark text-decoration-none">Inicio</a>
              </li>
              <li>
                <a href="servicios.html" className="text-dark text-decoration-none">Servicios y Precios</a>
              </li>
              <li>
                <a href="peluqueros.html" className="text-dark text-decoration-none">Peluqueros</a>
              </li>
              <li>
                <a href="admin.html" className="text-dark text-decoration-none">Administración</a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Franja de Copyright */}
      <div className="text-center p-3 bg-dark text-white">
        © {new Date().getFullYear()} TurnoVibe. Todos los derechos reservados.
      </div>
    </footer>
  )
}

export default Footer
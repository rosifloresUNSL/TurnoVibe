import { Link } from 'react-router';

export function HomePage() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-4 fw-bold mb-3">Bienvenido a TURNOVIBE</h1>
      <p className="lead mb-4">
        Reserva tus turnos de forma rápida, sencilla e intuitiva.
      </p>
      <Link to="/turnos" className="btn btn-primary btn-lg me-2">
        Reservar Turno
      </Link>
      <Link to="/servicios" className="btn btn-outline-secondary btn-lg">
        Ver Servicios
      </Link>
    </div>
  );
}
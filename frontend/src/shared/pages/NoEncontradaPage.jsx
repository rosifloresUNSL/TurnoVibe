import { Link } from 'react-router';

export function NoEncontradaPage() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <h3 className="mb-3">Página No Encontrada</h3>
      <p className="text-muted mb-4">
        La ruta que intentas visitar no existe o fue movida.
      </p>
      <Link to="/" className="btn btn-primary">
        Volver a la Página Principal
      </Link>
    </div>
  );
}
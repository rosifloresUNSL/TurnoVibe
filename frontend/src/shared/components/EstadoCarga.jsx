// Muestra un spinner mientras se carga, un mensaje de error con botón "Reintentar" si falló,
// y los hijos cuando todo salió bien.
export function EstadoCarga({ cargando, error, onReintentar, children }) {
  if (cargando) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
        <span>{error.message}</span>
        {onReintentar && (
          <button type="button" className="btn btn-sm btn-outline-danger ms-3" onClick={onReintentar}>
            Reintentar
          </button>
        )}
      </div>
    );
  }

  return children;
}
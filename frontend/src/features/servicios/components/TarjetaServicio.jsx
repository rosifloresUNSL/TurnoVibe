export function TarjetaServicio({ servicio, enSeleccionar, estaSeleccionado }) {
  return (
    <div className={`card h-100 shadow-sm ${estaSeleccionado ? 'border-primary border-2' : ''}`}>
      <div className="card-body d-flex flex-column">
        <span className="badge bg-secondary mb-2 align-self-start">
          {servicio.categoria}
        </span>
        <h5 className="card-title fw-bold">{servicio.nombre}</h5>
        <p className="card-text text-muted flex-grow-1">{servicio.descripcion}</p>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fw-bold fs-5 text-primary">${servicio.precio}</span>
          <small className="text-muted">⏱ {servicio.duracion}</small>
        </div>
        <button
          className={`btn ${estaSeleccionado ? 'btn-success' : 'btn-outline-primary'} w-100`}
          onClick={() => enSeleccionar(servicio)}
        >
          {estaSeleccionado ? '✓ Seleccionado' : 'Seleccionar Servicio'}
        </button>
      </div>
    </div>
  );
}
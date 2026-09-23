export function SelectorServicios({ servicios, seleccionados, enCambioSeleccion }) {
  const handleToggle = (servicio) => {
    const existe = seleccionados.some((s) => s.id === servicio.id);
    let nuevos;
    if (existe) {
      nuevos = seleccionados.filter((s) => s.id !== servicio.id);
    } else {
      nuevos = [...seleccionados, servicio];
    }
    enCambioSeleccion(nuevos);
  };

  const duracionTotal = seleccionados.reduce((acc, s) => acc + s.duracionMinutos, 0);
  const precioTotal = seleccionados.reduce((acc, s) => acc + s.precio, 0);

  return (
    <div className="card p-3 border mb-4">
      <h5 className="fw-bold mb-3">1. Seleccione los Servicios (Multi-selección)</h5>
      <div className="row g-3">
        {servicios.map((servicio) => {
          const estaChecked = seleccionados.some((s) => s.id === servicio.id);
          return (
            <div className="col-md-4" key={servicio.id}>
              <div
                className={`card h-100 p-3 border cursor-pointer ${
                  estaChecked ? 'border-primary bg-light' : ''
                }`}
                onClick={() => handleToggle(servicio)}
                style={{ cursor: 'pointer' }}
              >
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`serv-${servicio.id}`}
                    checked={estaChecked}
                    onChange={() => {}} 
                  />
                  <label className="form-check-label fw-bold" htmlFor={`serv-${servicio.id}`}>
                    {servicio.nombre}
                  </label>
                </div>
                <div className="mt-2 text-muted small">
                  Duración: <strong>{servicio.duracionMinutos} min</strong>
                  <br />
                  Precio: <strong>${servicio.precio}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {seleccionados.length > 0 && (
        <div className="alert alert-info mt-3 mb-0 d-flex justify-content-between align-items-center">
          <span>
            Servicios seleccionados: <strong>{seleccionados.length}</strong>
          </span>
          <span>
            Duración indivisible requirida: <strong>{duracionTotal} min</strong>
          </span>
          <span>
            Total estimado: <strong>${precioTotal}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
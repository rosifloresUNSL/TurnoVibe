import { Tarjeta } from '../../../shared/components/Tarjeta';

export function SelectorServicios({ servicios, seleccionados, enCambioSeleccion }) {
  const handleToggle = (servicio) => {
    const existe = seleccionados.some((s) => s.id === servicio.id);
    const nuevos = existe
      ? seleccionados.filter((s) => s.id !== servicio.id)
      : [...seleccionados, servicio];
    enCambioSeleccion(nuevos);
  };

  return (
    <Tarjeta titulo="1. Seleccioná los servicios (podés elegir 1, 2 o los 3)">
      <div className="row g-3">
        {servicios.map((servicio) => {
          const estaChecked = seleccionados.some((s) => s.id === servicio.id);
          return (
            <div className="col-md-4" key={servicio.id}>
              <div className={`card h-100 p-3 border ${estaChecked ? 'border-primary bg-light' : ''}`}>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`serv-${servicio.id}`}
                    checked={estaChecked}
                    onChange={() => handleToggle(servicio)}
                  />
                  <label
                    className="form-check-label fw-bold stretched-link"
                    htmlFor={`serv-${servicio.id}`}
                  >
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
    </Tarjeta>
  );
}
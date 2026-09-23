export function ListaTurnos({ turnos, turnoSeleccionado, enSeleccionarTurno }) {
  if (turnos.length === 0) {
    return (
      <div className="alert alert-info mt-3" role="alert">
        No hay turnos disponibles para el servicio y la fecha seleccionada.
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-md-3 g-3 mt-2">
      {turnos.map((t) => {
        const esElSeleccionado = turnoSeleccionado?.id === t.id;
        return (
          <div className="col" key={t.id}>
            <div
              className={`card h-100 cursor-pointer ${
                esElSeleccionado ? 'bg-primary text-white' : 'bg-light'
              }`}
              style={{ cursor: 'pointer' }}
              onClick={() => enSeleccionarTurno(t)}
            >
              <div className="card-body text-center">
                <h6 className="fw-bold">{t.hora} hs</h6>
                <p className="mb-0 small">Profesional: {t.profesional}</p>
                <small className="d-block mt-1">Fecha: {t.fecha}</small>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
import { useEffect, useState } from 'react';
import { serviciosService } from '../../servicios/services/serviciosService';
import { turnosService } from '../services/turnosService';
import { ListaTurnos } from '../components/ListaTurnos';

export function ReservarTurnoPage() {
  const [servicios, setServicios] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [turnosDisponibles, setTurnosDisponibles] = useState([]);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [cargandoTurnos, setCargandoTurnos] = useState(false);

  useEffect(() => {
    serviciosService.obtenerTodos().then((data) => {
      setServicios(data);
    });
  }, []);

  const handleSeleccionarServicio = (e) => {
    const id = Number(e.target.value);
    const encontrado = servicios.find((s) => s.id === id) || null;
    setServicioSeleccionado(encontrado);
    setTurnoSeleccionado(null);

    if (encontrado) {
      setCargandoTurnos(true);
      turnosService.obtenerDisponiblesPorServicio(id).then((turnos) => {
        setTurnosDisponibles(turnos);
        setCargandoTurnos(false);
      });
    } else {
      setTurnosDisponibles([]);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Reserva de Turno Interactiva</h2>

      <div className="card shadow-sm p-4 mb-4">
        <div className="mb-3">
          <label htmlFor="servicioSelect" className="form-label fw-bold">
            Paso 1: Seleccione un Servicio
          </label>
          <select
            id="servicioSelect"
            className="form-select"
            onChange={handleSeleccionarServicio}
            defaultValue=""
          >
            <option value="" disabled>
              -- Elija una opción --
            </option>
            {servicios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre} - ${s.precio}
              </option>
            ))}
          </select>
        </div>

        {servicioSeleccionado && (
          <div className="mt-4">
            <h5 className="fw-bold">Paso 2: Elija un Horario Disponible</h5>
            {cargandoTurnos ? (
              <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
            ) : (
              <ListaTurnos
                turnos={turnosDisponibles}
                turnoSeleccionado={turnoSeleccionado}
                enSeleccionarTurno={(t) => setTurnoSeleccionado(t)}
              />
            )}
          </div>
        )}

        {turnoSeleccionado && (
          <div className="alert alert-success mt-4 mb-0" role="alert">
            <h6 className="fw-bold mb-1">Turno Seleccionado con éxito:</h6>
            <p className="mb-0">
              <strong>{servicioSeleccionado.nombre}</strong> con {turnoSeleccionado.profesional} el{' '}
              {turnoSeleccionado.fecha} a las {turnoSeleccionado.hora} hs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
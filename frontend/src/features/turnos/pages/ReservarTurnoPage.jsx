import { useEffect, useState } from 'react';
import serviciosData from '../../../data/servicios.json';
import peluquerosData from '../../../data/peluqueros.json';
import { SelectorServicios } from '../components/SelectorServicios';
import { calcularDuracionTotal, obtenerSlotsDisponibles } from '../utils/calculoSlots';

export function ReservarTurnoPage() {
  const [servicios, setServicios] = useState([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [peluqueroSeleccionado, setPeluqueroSeleccionado] = useState('');
  const [slotsCalculados, setSlotsCalculados] = useState([]);
  const [slotElegido, setSlotElegido] = useState(null);

  useEffect(() => {
    setServicios(serviciosData);
  }, []);

  useEffect(() => {
    setSlotElegido(null);
    if (serviciosSeleccionados.length === 0 || !peluqueroSeleccionado) {
      setSlotsCalculados([]);
      return;
    }

    const duracion = calcularDuracionTotal(serviciosSeleccionados);
    const peluquero = peluquerosData.find((p) => p.id === Number(peluqueroSeleccionado));

    if (peluquero) {
      const libres = obtenerSlotsDisponibles(peluquero.agenda, duracion);
      setSlotsCalculados(libres);
    }
  }, [serviciosSeleccionados, peluqueroSeleccionado]);

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Reserva de Turnos Vibe</h2>

      <SelectorServicios
        servicios={servicios}
        seleccionados={serviciosSeleccionados}
        enCambioSeleccion={(nuevos) => setServiciosSeleccionados(nuevos)}
      />

      {serviciosSeleccionados.length > 0 && (
        <div className="card p-3 border mb-4">
          <h5 className="fw-bold mb-3">2. Elija Peluquero</h5>
          <select
            className="form-select"
            value={peluqueroSeleccionado}
            onChange={(e) => setPeluqueroSeleccionado(e.target.value)}
          >
            <option value="">-- Seleccionar Peluquero --</option>
            {peluquerosData.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {peluqueroSeleccionado && serviciosSeleccionados.length > 0 && (
        <div className="card p-3 border mb-4">
          <h5 className="fw-bold mb-3">
            3. Franjas Horarias Disponibles (Bloque continuo de{' '}
            {calcularDuracionTotal(serviciosSeleccionados)} min)
          </h5>

          {slotsCalculados.length === 0 ? (
            <div className="alert alert-warning">
              No hay bloques continuos suficientes para la duración solicitada con este peluquero.
            </div>
          ) : (
            <div className="d-flex flex-wrap gap-2">
              {slotsCalculados.map((slot, index) => {
                const esElegido =
                  slotElegido?.horaInicio === slot.horaInicio &&
                  slotElegido?.horaFin === slot.horaFin;

                return (
                  <button
                    key={index}
                    type="button"
                    className={`btn ${esElegido ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSlotElegido(slot)}
                  >
                    {slot.horaInicio} a {slot.horaFin} hs
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {slotElegido && (
        <div className="alert alert-success">
          <h5 className="fw-bold">Resumen de Franja Elegida</h5>
          <p className="mb-0">
            Horario: <strong>{slotElegido.horaInicio} - {slotElegido.horaFin} hs</strong> (
            {calcularDuracionTotal(serviciosSeleccionados)} minutos asegurados sin interrupciones).
          </p>
        </div>
      )}
    </div>
  );
}
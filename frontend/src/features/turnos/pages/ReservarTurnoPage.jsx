import { useEffect, useState } from 'react';
import serviciosData from '../../../data/servicios.json';
import peluquerosData from '../../../data/peluqueros.json';
import { SelectorServicios } from '../components/SelectorServicios';
import {
  calcularDuracionTotal,
  obtenerSlotsDisponibles,
  obtenerSlotsSiguienteDisponible
} from '../utils/calculoSlots';

export function ReservarTurnoPage() {
  const [servicios, setServicios] = useState([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  
  // Fecha seleccionada (por defecto HOY en formato YYYY-MM-DD)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Modo de Reserva: 'por_peluquero' (Opción A) | 'siguiente_disponible' (Opción B)
  const [modoReserva, setModoReserva] = useState('por_peluquero');
  
  const [peluqueroSeleccionado, setPeluqueroSeleccionado] = useState('');
  const [slotsCalculados, setSlotsCalculados] = useState([]);
  const [slotElegido, setSlotElegido] = useState(null);

  useEffect(() => {
    setServicios(serviciosData);
  }, []);

  // Recalcular slots disponibles cuando cambien los insumos del formulario
  useEffect(() => {
    setSlotElegido(null);

    // Si no hay servicios seleccionados o no hay fecha, reseteamos la lista
    if (serviciosSeleccionados.length === 0 || !fechaSeleccionada) {
      setSlotsCalculados([]);
      return;
    }

    const duracionTotal = calcularDuracionTotal(serviciosSeleccionados);

    // Opción A: Por Peluquero
    if (modoReserva === 'por_peluquero') {
      if (!peluqueroSeleccionado) {
        setSlotsCalculados([]);
        return;
      }

      // CORRECCIÓN CLAVE: Comparación estricta asegurando parseo a Number o String
      const peluquero = peluquerosData.find(
        (p) => String(p.id) === String(peluqueroSeleccionado)
      );

      if (peluquero && peluquero.agenda) {
        const slots = obtenerSlotsDisponibles(peluquero.agenda, duracionTotal);
        setSlotsCalculados(
          slots.map((s) => ({ ...s, peluqueroNombre: peluquero.nombre }))
        );
      } else {
        setSlotsCalculados([]);
      }
    } 
    // Opción B: Siguiente Disponible (Asignación automática)
    else if (modoReserva === 'siguiente_disponible') {
      const slotsAutomaticos = obtenerSlotsSiguienteDisponible(
        peluquerosData,
        duracionTotal
      );
      setSlotsCalculados(slotsAutomaticos);
    }
  }, [serviciosSeleccionados, modoReserva, peluqueroSeleccionado, fechaSeleccionada]);

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Reserva tu Turno en TurnoVibe</h2>

      {/* 1. Selección de Modo de Reserva */}
      <div className="card p-3 mb-4 bg-light">
        <label className="fw-bold mb-2">Selecciona la Modalidad de Reserva:</label>
        <div className="nav nav-pills nav-justified">
          <button
            type="button"
            className={`nav-link ${modoReserva === 'por_peluquero' ? 'active' : ''}`}
            onClick={() => {
              setModoReserva('por_peluquero');
              setSlotElegido(null);
            }}
          >
            Opción A: Por Peluquero
          </button>
          <button
            type="button"
            className={`nav-link ${modoReserva === 'siguiente_disponible' ? 'active' : ''}`}
            onClick={() => {
              setModoReserva('siguiente_disponible');
              setPeluqueroSeleccionado('');
              setSlotElegido(null);
            }}
          >
            Opción B: Siguiente Disponible (Asignación Automática)
          </button>
        </div>
      </div>

      {/* 2. Multi-selección de Servicios */}
      <SelectorServicios
        servicios={servicios}
        seleccionados={serviciosSeleccionados}
        enCambioSeleccion={(nuevos) => setServiciosSeleccionados(nuevos)}
      />

      {/* 3. Selección de Fecha y Peluquero */}
      {serviciosSeleccionados.length > 0 && (
        <div className="card p-3 mb-4 border">
          <h5 className="fw-bold mb-3">2. Selecciona Fecha {modoReserva === 'por_peluquero' && 'y Peluquero'}</h5>
          
          <div className="row g-3">
            <div className={modoReserva === 'por_peluquero' ? 'col-md-6' : 'col-md-12'}>
              <label className="form-label fw-bold">Fecha de Reserva:</label>
              <input
                type="date"
                className="form-control"
                value={fechaSeleccionada}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
              />
            </div>

            {modoReserva === 'por_peluquero' && (
              <div className="col-md-6">
                <label className="form-label fw-bold">Peluquero de Preferencia:</label>
                <select
                  className="form-select"
                  value={peluqueroSeleccionado}
                  onChange={(e) => setPeluqueroSeleccionado(e.target.value)}
                >
                  <option value="">-- Elige un Peluquero --</option>
                  {peluquerosData.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Muestra de Franjas Libres Calculadas */}
      {serviciosSeleccionados.length > 0 &&
        fechaSeleccionada &&
        (modoReserva === 'siguiente_disponible' || peluqueroSeleccionado) && (
          <div className="card p-3 mb-4 border">
            <h5 className="fw-bold mb-3">
              3. Horarios Disponibles (Bloque continuo de{' '}
              {calcularDuracionTotal(serviciosSeleccionados)} min)
            </h5>

            {slotsCalculados.length === 0 ? (
              <div className="alert alert-warning mb-0">
                No hay agenda continua libre suficiente para cubrir la duración de los servicios seleccionados.
              </div>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {slotsCalculados.map((slot, idx) => {
                  const esSeleccionado =
                    slotElegido?.horaInicio === slot.horaInicio &&
                    slotElegido?.horaFin === slot.horaFin;

                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`btn ${esSeleccionado ? 'btn-success' : 'btn-outline-primary'}`}
                      onClick={() => setSlotElegido(slot)}
                    >
                      {slot.horaInicio} - {slot.horaFin} hs
                      {modoReserva === 'siguiente_disponible' && (
                        <span className="d-block small text-muted">
                          ({slot.peluqueroNombre})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

      {/* 5. Resumen Final de Reserva */}
      {slotElegido && (
        <div className="alert alert-success mt-4">
          <h5 className="fw-bold">Resumen de tu Turno Seleccionado</h5>
          <ul className="mb-0">
            <li>
              Fecha: <strong>{fechaSeleccionada}</strong>
            </li>
            <li>
              Peluquero Asignado: <strong>{slotElegido.peluqueroNombre}</strong>
            </li>
            <li>
              Horario reservado: <strong>{slotElegido.horaInicio} a {slotElegido.horaFin} hs</strong>
            </li>
            <li>
              Duración Bloqueada: <strong>{calcularDuracionTotal(serviciosSeleccionados)} min</strong>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
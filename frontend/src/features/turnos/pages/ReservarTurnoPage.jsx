import { useState } from 'react';
import serviciosData from '../../../data/servicios.json';
import peluquerosData from '../../../data/peluqueros.json';
import { Tarjeta } from '../../../shared/components/Tarjeta';
import { SelectorServicios } from '../components/SelectorServicios';
import { ResumenReserva } from '../components/ResumenReserva';
import { FormularioReserva } from '../components/FormularioReserva';
import {
  calcularDuracionTotal,
  obtenerSlotsDisponibles,
  obtenerSlotsSiguienteDisponible,
  reservarBloque
} from '../utils/calculoSlots';

function obtenerFechaLocalISO() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

export function ReservarTurnoPage() {
  const hoy = obtenerFechaLocalISO();

  // Estado compartido (lifting state up)
  const [agendas, setAgendas] = useState(peluquerosData);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(hoy);
  const [modoReserva, setModoReserva] = useState('por_peluquero'); // 'por_peluquero' | 'siguiente_disponible'
  const [peluqueroSeleccionado, setPeluqueroSeleccionado] = useState('');
  const [slotElegido, setSlotElegido] = useState(null);
  const [reservaConfirmada, setReservaConfirmada] = useState(null);

  // Datos derivados: se calculan en cada render, no se guardan en estado
  const duracionTotal = calcularDuracionTotal(serviciosSeleccionados);
  let slotsCalculados = [];

  if (duracionTotal > 0) {
    if (modoReserva === 'por_peluquero') {
      const peluquero = agendas.find((p) => String(p.id) === String(peluqueroSeleccionado));
      if (peluquero) {
        slotsCalculados = obtenerSlotsDisponibles(peluquero.agenda, duracionTotal).map((s) => ({
          ...s,
          peluqueroId: peluquero.id,
          peluqueroNombre: peluquero.nombre
        }));
      }
    } else {
      slotsCalculados = obtenerSlotsSiguienteDisponible(agendas, duracionTotal);
    }
  }

  // Handlers: cada cambio de insumos descarta el horario elegido
  const handleCambiarServicios = (nuevos) => {
    setServiciosSeleccionados(nuevos);
    setSlotElegido(null);
  };

  const handleCambiarModo = (modo) => {
    setModoReserva(modo);
    setPeluqueroSeleccionado('');
    setSlotElegido(null);
  };

  const handleCambiarPeluquero = (id) => {
    setPeluqueroSeleccionado(id);
    setSlotElegido(null);
  };

  const handleCambiarFecha = (fecha) => {
    setFechaSeleccionada(fecha);
    setSlotElegido(null);
  };

  const handleConfirmarReserva = (cliente) => {
    setAgendas((prev) =>
      prev.map((p) =>
        p.id === slotElegido.peluqueroId
          ? {
              ...p,
              agenda: reservarBloque(p.agenda, slotElegido.horaInicio, slotElegido.bloques, cliente.nombre)
            }
          : p
      )
    );

    setReservaConfirmada({
      cliente,
      servicios: serviciosSeleccionados,
      fecha: fechaSeleccionada,
      slot: slotElegido,
      duracion: duracionTotal
    });
  };

  const handleNuevaReserva = () => {
    setReservaConfirmada(null);
    setServiciosSeleccionados([]);
    setSlotElegido(null);
  };

  if (reservaConfirmada) {
    const { cliente, servicios, fecha, slot, duracion } = reservaConfirmada;
    return (
      <div className="container py-4">
        <div className="alert alert-success p-4" role="alert">
          <h4 className="alert-heading fw-bold">¡Reserva confirmada!</h4>
          <p>
            Gracias <strong>{cliente.nombre}</strong>. Te enviamos el comprobante a{' '}
            <strong>{cliente.email}</strong>.
          </p>
          <ul className="mb-3">
            <li>Servicios: <strong>{servicios.map((s) => s.nombre).join(', ')}</strong></li>
            <li>Fecha: <strong>{fecha}</strong></li>
            <li>Horario: <strong>{slot.horaInicio} a {slot.horaFin} hs</strong> ({duracion} min)</li>
            <li>Peluquero: <strong>{slot.peluqueroNombre}</strong></li>
          </ul>
          <button type="button" className="btn btn-outline-success" onClick={handleNuevaReserva}>
            Hacer otra reserva
          </button>
        </div>
      </div>
    );
  }

  const mostrarHorarios =
    serviciosSeleccionados.length > 0 &&
    fechaSeleccionada &&
    (modoReserva === 'siguiente_disponible' || peluqueroSeleccionado);

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Reservá tu turno en TurnoVibe</h2>

      <div className="row g-4">
        <div className="col-lg-8">
          <Tarjeta titulo="Modalidad de reserva" className="bg-light">
            <div className="nav nav-pills nav-justified">
              <button
                type="button"
                className={`nav-link ${modoReserva === 'por_peluquero' ? 'active' : ''}`}
                onClick={() => handleCambiarModo('por_peluquero')}
              >
                Opción A: Por peluquero
              </button>
              <button
                type="button"
                className={`nav-link ${modoReserva === 'siguiente_disponible' ? 'active' : ''}`}
                onClick={() => handleCambiarModo('siguiente_disponible')}
              >
                Opción B: Siguiente disponible
              </button>
            </div>
          </Tarjeta>

          <SelectorServicios
            servicios={serviciosData}
            seleccionados={serviciosSeleccionados}
            enCambioSeleccion={handleCambiarServicios}
          />

          {serviciosSeleccionados.length > 0 && (
            <Tarjeta titulo={`2. Elegí la fecha${modoReserva === 'por_peluquero' ? ' y el peluquero' : ''}`}>
              <div className="row g-3">
                <div className={modoReserva === 'por_peluquero' ? 'col-md-6' : 'col-md-12'}>
                  <label htmlFor="fechaReserva" className="form-label fw-bold">
                    Fecha de reserva:
                  </label>
                  <input
                    id="fechaReserva"
                    type="date"
                    className="form-control"
                    min={hoy}
                    value={fechaSeleccionada}
                    onChange={(e) => handleCambiarFecha(e.target.value)}
                  />
                </div>

                {modoReserva === 'por_peluquero' && (
                  <div className="col-md-6">
                    <label htmlFor="peluqueroReserva" className="form-label fw-bold">
                      Peluquero:
                    </label>
                    <select
                      id="peluqueroReserva"
                      className="form-select"
                      value={peluqueroSeleccionado}
                      onChange={(e) => handleCambiarPeluquero(e.target.value)}
                    >
                      <option value="">-- Elegí un peluquero --</option>
                      {agendas.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </Tarjeta>
          )}

          {mostrarHorarios && (
            <Tarjeta titulo={`3. Horarios disponibles (bloque continuo de ${duracionTotal} min)`}>
              {slotsCalculados.length === 0 ? (
                <div className="alert alert-warning mb-0">
                  No hay agenda continua libre suficiente para cubrir la duración de los servicios
                  seleccionados.
                </div>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  {slotsCalculados.map((slot) => {
                    const esSeleccionado =
                      slotElegido?.horaInicio === slot.horaInicio &&
                      slotElegido?.peluqueroId === slot.peluqueroId;

                    return (
                      <button
                        key={`${slot.peluqueroId}-${slot.horaInicio}`}
                        type="button"
                        className={`btn ${esSeleccionado ? 'btn-success' : 'btn-outline-primary'}`}
                        onClick={() => setSlotElegido(slot)}
                      >
                        {slot.horaInicio} - {slot.horaFin} hs
                        {modoReserva === 'siguiente_disponible' && (
                          <span className="d-block small">({slot.peluqueroNombre})</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </Tarjeta>
          )}

          {slotElegido && (
            <Tarjeta>
              <FormularioReserva enConfirmar={handleConfirmarReserva} />
            </Tarjeta>
          )}
        </div>

        <div className="col-lg-4">
          <ResumenReserva
            serviciosSeleccionados={serviciosSeleccionados}
            fecha={fechaSeleccionada}
            slot={slotElegido}
          />
        </div>
      </div>
    </div>
  );
}
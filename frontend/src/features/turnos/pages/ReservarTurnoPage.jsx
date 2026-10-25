import { useState } from 'react';
import { serviciosApi, peluquerosApi, disponibilidadApi, turnosApi } from '../../../api/endpoints';
import { useCargaDatos } from '../../../shared/hooks/useCargaDatos';
import { EstadoCarga } from '../../../shared/components/EstadoCarga';
import { Tarjeta } from '../../../shared/components/Tarjeta';
import { fechaLocalISO, formatearFecha, horaLocalActual } from '../../../shared/utils/fechas';
import { SelectorServicios } from '../components/SelectorServicios';
import { ResumenReserva } from '../components/ResumenReserva';
import { FormularioReserva } from '../components/FormularioReserva';

export function ReservarTurnoPage() {
  const hoy = fechaLocalISO();

  // Datos que vienen del servidor
  const servicios = useCargaDatos(serviciosApi.listar);
  const peluqueros = useCargaDatos(peluquerosApi.listar);

  // Estado compartido de la reserva (lifting state up)
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(hoy);
  const [modoReserva, setModoReserva] = useState('por_peluquero'); // 'por_peluquero' | 'siguiente_disponible'
  const [peluqueroSeleccionado, setPeluqueroSeleccionado] = useState('');
  const [slotElegido, setSlotElegido] = useState(null);
  const [reservaConfirmada, setReservaConfirmada] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [errorReserva, setErrorReserva] = useState('');

  // Los horarios libres los calcula el SERVIDOR (regla de bloques continuos de 30/60/90 min).
  // Se vuelve a consultar cada vez que cambia algún insumo.
  const idsServicios = serviciosSeleccionados.map((s) => s.id).join(',');
  const listoParaConsultar =
    idsServicios !== '' && fechaSeleccionada && (modoReserva === 'siguiente_disponible' || peluqueroSeleccionado);
  const consulta = listoParaConsultar
    ? {
        fecha: fechaSeleccionada,
        servicios: idsServicios,
        peluqueroId: modoReserva === 'por_peluquero' ? peluqueroSeleccionado : undefined
      }
    : null;
  const disponibilidad = useCargaDatos(
    () => (consulta ? disponibilidadApi.consultar(consulta) : Promise.resolve(null)),
    [JSON.stringify(consulta)]
  );

  // Si se reserva para hoy, no se ofrecen horarios que ya pasaron.
  const ahora = horaLocalActual();
  const slots = (disponibilidad.datos?.slots ?? []).filter(
    (slot) => fechaSeleccionada !== hoy || slot.horaInicio > ahora
  );

  // Cada cambio de insumos descarta el horario elegido y el error anterior.
  const reiniciarElegido = () => {
    setSlotElegido(null);
    setErrorReserva('');
  };
  const handleCambiarServicios = (nuevos) => {
    setServiciosSeleccionados(nuevos);
    reiniciarElegido();
  };
  const handleCambiarModo = (modo) => {
    setModoReserva(modo);
    setPeluqueroSeleccionado('');
    reiniciarElegido();
  };
  const handleCambiarPeluquero = (id) => {
    setPeluqueroSeleccionado(id);
    reiniciarElegido();
  };
  const handleCambiarFecha = (fecha) => {
    setFechaSeleccionada(fecha);
    reiniciarElegido();
  };

  const handleConfirmarReserva = async (cliente) => {
    setEnviando(true);
    setErrorReserva('');
    try {
      const turno = await turnosApi.reservar({
        peluqueroId: slotElegido.peluqueroId,
        servicios: serviciosSeleccionados.map((s) => s.id),
        fecha: fechaSeleccionada,
        horaInicio: slotElegido.horaInicio,
        clienteNombre: cliente.nombre,
        clienteEmail: cliente.email,
        clienteTelefono: cliente.telefono
      });
      setReservaConfirmada({ cliente, turno, servicios: serviciosSeleccionados, peluqueroNombre: slotElegido.peluqueroNombre });
    } catch (error) {
      if (error.status === 409) {
        // Otra persona reservó ese horario mientras este cliente completaba el formulario.
        setErrorReserva('Ese horario se acaba de ocupar. Elegí otro de la lista actualizada.');
        setSlotElegido(null);
        disponibilidad.recargar();
      } else {
        setErrorReserva(error.message);
      }
    } finally {
      setEnviando(false);
    }
  };

  const handleNuevaReserva = () => {
    setReservaConfirmada(null);
    setServiciosSeleccionados([]);
    reiniciarElegido();
  };

  if (reservaConfirmada) {
    const { cliente, turno, servicios: elegidos, peluqueroNombre } = reservaConfirmada;
    return (
      <div className="container py-4">
        <div className="alert alert-success p-4" role="alert">
          <h4 className="alert-heading fw-bold">¡Reserva confirmada!</h4>
          <p>
            Gracias <strong>{cliente.nombre}</strong>. Tu turno quedó registrado a nombre de{' '}
            <strong>{cliente.email}</strong>.
          </p>
          <ul className="mb-3">
            <li>Servicios: <strong>{elegidos.map((s) => s.nombre).join(', ')}</strong></li>
            <li>Fecha: <strong>{formatearFecha(turno.fecha)}</strong></li>
            <li>Horario: <strong>{turno.horaInicio} a {turno.horaFin} hs</strong> ({turno.duracionMinutos} min)</li>
            <li>Peluquero: <strong>{peluqueroNombre}</strong></li>
          </ul>
          <button type="button" className="btn btn-outline-success" onClick={handleNuevaReserva}>
            Hacer otra reserva
          </button>
        </div>
      </div>
    );
  }

  const cargandoCatalogos = servicios.cargando || peluqueros.cargando;
  const errorCatalogos = servicios.error || peluqueros.error;
  const reintentarCatalogos = () => {
    servicios.recargar();
    peluqueros.recargar();
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Reservá tu turno en TurnoVibe</h2>

      <EstadoCarga cargando={cargandoCatalogos} error={errorCatalogos} onReintentar={reintentarCatalogos}>
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
              servicios={servicios.datos ?? []}
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
                        {(peluqueros.datos ?? []).map((p) => (
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

            {listoParaConsultar && (
              <Tarjeta
                titulo={`3. Horarios disponibles (bloque continuo de ${
                  disponibilidad.datos?.duracionMinutos ??
                  serviciosSeleccionados.reduce((total, s) => total + s.duracionMinutos, 0)
                } min)`}
              >
                <EstadoCarga
                  cargando={disponibilidad.cargando}
                  error={disponibilidad.error}
                  onReintentar={disponibilidad.recargar}
                >
                  {slots.length === 0 ? (
                    <div className="alert alert-warning mb-0">
                      No hay agenda continua libre suficiente para cubrir la duración de los servicios
                      seleccionados en esa fecha.
                    </div>
                  ) : (
                    <div className="d-flex flex-wrap gap-2">
                      {slots.map((slot) => {
                        const esSeleccionado =
                          slotElegido?.horaInicio === slot.horaInicio && slotElegido?.peluqueroId === slot.peluqueroId;
                        return (
                          <button
                            key={`${slot.peluqueroId}-${slot.horaInicio}`}
                            type="button"
                            className={`btn ${esSeleccionado ? 'btn-success' : 'btn-outline-primary'}`}
                            onClick={() => {
                              setSlotElegido(slot);
                              setErrorReserva('');
                            }}
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
                </EstadoCarga>
              </Tarjeta>
            )}

            {errorReserva && (
              <div className="alert alert-danger" role="alert">
                {errorReserva}
              </div>
            )}

            {slotElegido && (
              <Tarjeta>
                <FormularioReserva enConfirmar={handleConfirmarReserva} enviando={enviando} />
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
      </EstadoCarga>
    </div>
  );
}
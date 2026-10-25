import { useState } from 'react';
import { disponibilidadApi, turnosApi } from '../../../api/endpoints';
import { useCargaDatos } from '../../../shared/hooks/useCargaDatos';
import { fechaLocalISO, horaLocalActual } from '../../../shared/utils/fechas';

// Carga manual de un turno (cliente presencial o telefónico) en la agenda del propio peluquero.
// Los horarios libres los calcula el servidor, igual que en la reserva online.
export function FormularioTurnoManual({ peluqueroId, fecha, catalogo, onCreado }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [elegidos, setElegidos] = useState([]); // ids de servicio
  const [hora, setHora] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const ids = elegidos.join(',');
  const disponibilidad = useCargaDatos(
    () => (ids ? disponibilidadApi.consultar({ fecha, servicios: ids, peluqueroId }) : Promise.resolve(null)),
    [fecha, ids, peluqueroId]
  );
  const ahora = horaLocalActual();
  const horarios = (disponibilidad.datos?.slots ?? []).filter(
    (slot) => fecha !== fechaLocalISO() || slot.horaInicio > ahora
  );

  const alternarServicio = (id) => {
    setElegidos((previos) => (previos.includes(id) ? previos.filter((x) => x !== id) : [...previos, id]));
    setHora('');
    setExito('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');
    setEnviando(true);
    try {
      await turnosApi.crearManual({
        peluqueroId,
        servicios: elegidos,
        fecha,
        horaInicio: hora,
        clienteNombre: nombre,
        clienteEmail: email,
        clienteTelefono: telefono
      });
      setExito('Turno cargado en tu agenda.');
      setNombre('');
      setTelefono('');
      setEmail('');
      setElegidos([]);
      setHora('');
      onCreado();
    } catch (err) {
      const detalle = err.detalles ? ` (${Object.values(err.detalles).join(' ')})` : '';
      setError(err.message + detalle);
      if (err.status === 409) disponibilidad.recargar();
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="card p-4 border mb-4">
      <h5 className="fw-bold mb-3">Cargar turno manual (cliente presencial / telefónico)</h5>
      <p className="text-muted small">Se carga en tu agenda para el día seleccionado arriba.</p>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {exito && <div className="alert alert-success" role="status">{exito}</div>}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-4">
          <label htmlFor="manualNombre" className="form-label">Nombre del cliente</label>
          <input id="manualNombre" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required minLength={3} />
        </div>
        <div className="col-md-4">
          <label htmlFor="manualTelefono" className="form-label">Teléfono</label>
          <input id="manualTelefono" className="form-control" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
        </div>
        <div className="col-md-4">
          <label htmlFor="manualEmail" className="form-label">Email (obligatorio)</label>
          <input id="manualEmail" type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="col-12">
          <span className="form-label d-block">Servicios</span>
          <div className="d-flex flex-wrap gap-3">
            {catalogo.map((servicio) => (
              <div className="form-check" key={servicio.id}>
                <input
                  id={`manual-${servicio.id}`}
                  type="checkbox"
                  className="form-check-input"
                  checked={elegidos.includes(servicio.id)}
                  onChange={() => alternarServicio(servicio.id)}
                />
                <label className="form-check-label" htmlFor={`manual-${servicio.id}`}>
                  {servicio.nombre} ({servicio.duracionMinutos} min)
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-5">
          <label htmlFor="manualHora" className="form-label">Horario libre</label>
          <select id="manualHora" className="form-select" value={hora} onChange={(e) => setHora(e.target.value)} required disabled={elegidos.length === 0}>
            <option value="">
              {elegidos.length === 0 ? '-- Primero elegí servicios --' : horarios.length === 0 ? '-- Sin horarios libres --' : '-- Elegí un horario --'}
            </option>
            {horarios.map((slot) => (
              <option key={slot.horaInicio} value={slot.horaInicio}>
                {slot.horaInicio} a {slot.horaFin} hs
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={enviando || !hora}>
            {enviando ? 'Guardando...' : 'Cargar turno'}
          </button>
        </div>
      </form>
    </div>
  );
}
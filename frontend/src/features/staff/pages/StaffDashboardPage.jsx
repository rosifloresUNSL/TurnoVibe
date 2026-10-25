import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { estadisticasApi, serviciosApi, turnosApi } from '../../../api/endpoints';
import { useCargaDatos } from '../../../shared/hooks/useCargaDatos';
import { EstadoCarga } from '../../../shared/components/EstadoCarga';
import { TarjetaMetrica } from '../../../shared/components/TarjetaMetrica';
import { fechaLocalISO, formatearPesos, primerDiaDelMes, ultimoDiaDelMes } from '../../../shared/utils/fechas';
import { FormularioTurnoManual } from '../components/FormularioTurnoManual';

const CLASE_ESTADO = { confirmado: 'success', pendiente_pago: 'warning', cancelado: 'secondary' };
const ETIQUETA_ESTADO = { confirmado: 'Confirmado', pendiente_pago: 'Pendiente de pago', cancelado: 'Cancelado' };

export function StaffDashboardPage() {
  const { usuario } = useAuth();
  const hoy = fechaLocalISO();
  const [fecha, setFecha] = useState(hoy);
  const [errorAccion, setErrorAccion] = useState('');

  // El servidor ya limita todo al peluquero de la sesión: acá no se filtra nada.
  const catalogo = useCargaDatos(serviciosApi.listar);
  const estadisticasMes = useCargaDatos(
    () => estadisticasApi.obtener({ desde: primerDiaDelMes(), hasta: ultimoDiaDelMes() }),
    []
  );
  const estadisticasHoy = useCargaDatos(() => estadisticasApi.obtener({ desde: hoy, hasta: hoy }), [hoy]);
  const agenda = useCargaDatos(() => turnosApi.listar({ fecha }), [fecha]);

  const recargarTodo = () => {
    agenda.recargar();
    estadisticasMes.recargar();
    estadisticasHoy.recargar();
  };

  const nombresServicio = Object.fromEntries((catalogo.datos ?? []).map((s) => [s.id, s.nombre]));

  const handleEliminar = async (turno) => {
    if (!window.confirm(`¿Eliminar el turno de ${turno.clienteNombre} (${turno.horaInicio} hs)?`)) return;
    setErrorAccion('');
    try {
      await turnosApi.eliminar(turno.id);
      recargarTodo();
    } catch (error) {
      setErrorAccion(error.message);
    }
  };

  if (usuario.peluqueroId == null) {
    return (
      <div className="alert alert-warning" role="alert">
        Tu cuenta no tiene una agenda de peluquero asociada.
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-1">Mi Agenda - {usuario.nombre}</h2>
      <p className="text-muted mb-4">Panel individual del Staff</p>

      <EstadoCarga
        cargando={(estadisticasMes.cargando && !estadisticasMes.datos) || (estadisticasHoy.cargando && !estadisticasHoy.datos)}
        error={estadisticasMes.error || estadisticasHoy.error}
        onReintentar={recargarTodo}
      >
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <TarjetaMetrica titulo="Mis ingresos del mes" valor={formatearPesos(estadisticasMes.datos?.totales.ingresos ?? 0)} color="info" />
          </div>
          <div className="col-md-4">
            <TarjetaMetrica titulo="Turnos confirmados del mes" valor={estadisticasMes.datos?.totales.confirmados ?? 0} color="secondary" />
          </div>
          <div className="col-md-4">
            <TarjetaMetrica titulo="Turnos de hoy" valor={estadisticasHoy.datos?.totales.confirmados ?? 0} color="primary" />
          </div>
        </div>
      </EstadoCarga>

      <div className="row mb-3">
        <div className="col-md-4">
          <label htmlFor="fechaAgenda" className="form-label fw-bold">Día de la agenda</label>
          <input id="fechaAgenda" type="date" className="form-control" value={fecha} onChange={(e) => e.target.value && setFecha(e.target.value)} />
        </div>
      </div>

      <FormularioTurnoManual
        peluqueroId={usuario.peluqueroId}
        fecha={fecha}
        catalogo={catalogo.datos ?? []}
        onCreado={recargarTodo}
      />

      <div className="card p-4 border">
        <h5 className="fw-bold mb-3">Mis turnos del día</h5>
        {errorAccion && <div className="alert alert-danger" role="alert">{errorAccion}</div>}
        <EstadoCarga cargando={agenda.cargando} error={agenda.error} onReintentar={agenda.recargar}>
          {(agenda.datos ?? []).length === 0 ? (
            <p className="text-muted mb-0">No tenés turnos para este día.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Horario</th>
                    <th>Cliente</th>
                    <th>Servicios</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {agenda.datos.map((turno) => (
                    <tr key={turno.id}>
                      <td className="fw-bold">{turno.horaInicio} a {turno.horaFin} hs</td>
                      <td>
                        {turno.clienteNombre}
                        <div className="small text-muted">{turno.clienteTelefono}</div>
                      </td>
                      <td>{turno.servicios.map((id) => nombresServicio[id] ?? id).join(', ')}</td>
                      <td>
                        <span className={`badge bg-${CLASE_ESTADO[turno.estado] ?? 'secondary'}`}>
                          {ETIQUETA_ESTADO[turno.estado] ?? turno.estado}
                        </span>
                      </td>
                      <td className="text-end">
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(turno)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </EstadoCarga>
      </div>
    </div>
  );
}
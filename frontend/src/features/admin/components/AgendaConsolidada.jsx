import { useState } from 'react';
import { turnosApi } from '../../../api/endpoints';
import { useCargaDatos } from '../../../shared/hooks/useCargaDatos';
import { EstadoCarga } from '../../../shared/components/EstadoCarga';
import { fechaLocalISO } from '../../../shared/utils/fechas';
import { generarHoras, horaAMinutos } from '../../../shared/utils/horarios';

// Agenda del equipo para un día: una fila por franja de 30 minutos y una columna por peluquero.
export function AgendaConsolidada({ peluqueros }) {
  const [fecha, setFecha] = useState(fechaLocalISO());
  const turnos = useCargaDatos(() => turnosApi.listar({ fecha }), [fecha]);

  // Turno activo (no cancelado) que cubre esa franja para ese peluquero, si lo hay.
  const turnoEn = (peluqueroId, hora) =>
    (turnos.datos ?? []).find(
      (t) =>
        t.peluqueroId === peluqueroId &&
        t.estado !== 'cancelado' &&
        horaAMinutos(t.horaInicio) <= horaAMinutos(hora) &&
        horaAMinutos(hora) < horaAMinutos(t.horaFin)
    );

  return (
    <div className="card p-4 border">
      <div className="d-flex flex-wrap justify-content-between align-items-end mb-3 gap-3">
        <h5 className="fw-bold mb-0">Agenda consolidada del equipo</h5>
        <div>
          <label htmlFor="fechaConsolidada" className="form-label small mb-1">Día</label>
          <input id="fechaConsolidada" type="date" className="form-control form-control-sm" value={fecha} onChange={(e) => e.target.value && setFecha(e.target.value)} />
        </div>
      </div>

      <EstadoCarga cargando={turnos.cargando} error={turnos.error} onReintentar={turnos.recargar}>
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>Hora</th>
                {peluqueros.map((p) => (
                  <th key={p.id}>{p.nombre}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {generarHoras().map((hora) => (
                <tr key={hora}>
                  <td className="fw-bold">{hora}</td>
                  {peluqueros.map((p) => {
                    const turno = turnoEn(p.id, hora);
                    return (
                      <td key={p.id} className={turno ? (turno.estado === 'pendiente_pago' ? 'table-warning' : 'table-danger') : 'table-success'}>
                        {turno ? (
                          <>
                            {turno.clienteNombre}
                            {turno.estado === 'pendiente_pago' && <div className="small">pendiente de pago</div>}
                          </>
                        ) : (
                          <span className="text-muted">Libre</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EstadoCarga>
    </div>
  );
}
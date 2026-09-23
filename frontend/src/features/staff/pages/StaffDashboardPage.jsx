import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import peluquerosIniciales from '../../../data/peluqueros.json';

export function StaffDashboardPage() {
  const { usuario } = useAuth();
  
  // Buscar la agenda personal del peluquero logueado
  const peluqueroActual = peluquerosIniciales.find(
    (p) => String(p.id) === String(usuario?.peluqueroId)
  ) || peluquerosIniciales[0];

  const [agendaPersonal, setAgendaPersonal] = useState(peluqueroActual.agenda || []);
  const [clienteManual, setClienteManual] = useState('');
  const [horaManual, setHoraManual] = useState('');

  // 3.2 Auto-asignación manual de turno (presencial / telefónico)
  const handleAutoAsignar = (e) => {
    e.preventDefault();
    if (!horaManual || !clienteManual.trim()) return;

    setAgendaPersonal((prev) =>
      prev.map((slot) =>
        slot.hora === horaManual
          ? { ...slot, ocupado: true, cliente: clienteManual, tipo: 'Manual (Presencial/Tel)' }
          : slot
      )
    );

    setClienteManual('');
    setHoraManual('');
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-1">Mi Agenda - {usuario?.nombre}</h2>
      <p className="text-muted mb-4">Panel individual del Staff</p>

      {/* 3.2 Dashboard Individual */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card p-3 bg-info text-white shadow-sm">
            <span className="small text-uppercase">Mis Ingresos Generados</span>
            <h3 className="fw-bold mb-0">$165,000</h3>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 bg-secondary text-white shadow-sm">
            <span className="small text-uppercase">Turnos Atendidos Hoy</span>
            <h3 className="fw-bold mb-0">6 Atendidos</h3>
          </div>
        </div>
      </div>

      {/* 3.2 Auto-asignación Manual */}
      <div className="card p-4 border mb-4">
        <h5 className="fw-bold mb-3">Auto-asignar Turno Manual (Cliente Presencial / Telefónico)</h5>
        <form onSubmit={handleAutoAsignar} className="row g-3">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Nombre del Cliente"
              value={clienteManual}
              onChange={(e) => setClienteManual(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={horaManual}
              onChange={(e) => setHoraManual(e.target.value)}
              required
            >
              <option value="">-- Seleccionar Hora Libre --</option>
              {agendaPersonal
                .filter((s) => !s.ocupado)
                .map((s) => (
                  <option key={s.hora} value={s.hora}>
                    {s.hora} hs
                  </option>
                ))}
            </select>
          </div>
          <div className="col-md-3">
            <button type="submit" className="btn btn-primary w-100 fw-bold">
              Bloquear Turno
            </button>
          </div>
        </form>
      </div>

      {/* 3.2 Vista de Agenda Personal (Filtrada) */}
      <div className="card p-4 border">
        <h5 className="fw-bold mb-3">Mis Turnos Programados</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Horario</th>
                <th>Estado</th>
                <th>Cliente / Tipo</th>
              </tr>
            </thead>
            <tbody>
              {agendaPersonal.map((slot) => (
                <tr key={slot.hora}>
                  <td className="fw-bold">{slot.hora} hs</td>
                  <td>
                    {slot.ocupado ? (
                      <span className="badge bg-danger">Ocupado</span>
                    ) : (
                      <span className="badge bg-success">Libre</span>
                    )}
                  </td>
                  <td>
                    {slot.ocupado
                      ? slot.cliente || 'Reserva Web'
                      : 'Disponible para reserva'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
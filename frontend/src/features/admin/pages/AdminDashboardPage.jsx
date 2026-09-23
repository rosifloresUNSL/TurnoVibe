import { useState } from 'react';
import peluquerosIniciales from '../../../data/peluqueros.json';

export function AdminDashboardPage() {
  const [peluqueros, setPeluqueros] = useState(peluquerosIniciales);
  const [nuevoNombre, setNuevoNombre] = useState('');

  // 3.1 CRUD Peluqueros
  const handleAgregarPeluquero = (e) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return;

    const nuevo = {
      id: Date.now(),
      nombre: nuevoNombre,
      agenda: [
        { hora: '09:00', ocupado: false },
        { hora: '09:30', ocupado: false },
        { hora: '10:00', ocupado: false },
        { hora: '10:30', ocupado: false }
      ]
    };

    setPeluqueros([...peluqueros, nuevo]);
    setNuevoNombre('');
  };

  const handleEliminarPeluquero = (id) => {
    setPeluqueros(peluqueros.filter((p) => p.id !== id));
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Dashboard Global - Dueño / Admin</h2>

      {/* 3.1 Estadísticas Consolidadas */}
      <div className="row g-3 mb-5">
        <div className="col-md-3">
          <div className="card p-3 bg-primary text-white shadow-sm">
            <span className="small text-uppercase">Recaudación Mensual</span>
            <h3 className="fw-bold mb-0">$485,000</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 bg-success text-white shadow-sm">
            <span className="small text-uppercase">Servicio Más Pedido</span>
            <h3 className="fw-bold mb-0">Corte (54%)</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 bg-dark text-white shadow-sm">
            <span className="small text-uppercase">Peluquero Solicitado</span>
            <h3 className="fw-bold mb-0">Franco</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 bg-warning text-dark shadow-sm">
            <span className="small text-uppercase">Tasa de Cancelación</span>
            <h3 className="fw-bold mb-0">3.2%</h3>
          </div>
        </div>
      </div>

      {/* 3.1 CRUD de Peluqueros */}
      <div className="card p-4 border mb-5">
        <h4 className="fw-bold mb-3">Gestión de Peluqueros (CRUD)</h4>
        <form onSubmit={handleAgregarPeluquero} className="row g-2 mb-4">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Nombre del nuevo peluquero"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <button type="submit" className="btn btn-success w-100 fw-bold">
              + Registrar Peluquero
            </button>
          </div>
        </form>

        <ul className="list-group">
          {peluqueros.map((p) => (
            <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span className="fw-bold">{p.nombre}</span>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleEliminarPeluquero(p.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 3.1 Vista de Agenda Consolidada del Equipo */}
      <div className="card p-4 border">
        <h4 className="fw-bold mb-3">Agenda Consolidada del Equipo</h4>
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Horario</th>
                {peluqueros.map((p) => (
                  <th key={p.id}>{p.nombre}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00'].map((hora) => (
                <tr key={hora}>
                  <td className="fw-bold bg-light">{hora} hs</td>
                  {peluqueros.map((p) => {
                    const slot = p.agenda?.find((a) => a.hora === hora);
                    const ocupado = slot ? slot.ocupado : false;
                    return (
                      <td key={p.id} className={ocupado ? 'table-danger' : 'table-success'}>
                        {ocupado ? 'Ocupado' : 'Disponible'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { serviciosService } from '../services/serviciosService';
import { TarjetaServicio } from '../components/TarjetaServicio';

export function ServiciosPage() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');

  useEffect(() => {
    serviciosService.obtenerTodos().then((data) => {
      setServicios(data);
      setCargando(false);
    });
  }, []);

  const categorias = ['Todas', ...new Set(servicios.map((s) => s.categoria))];

  const serviciosFiltrados =
    filtroCategoria === 'Todas'
      ? servicios
      : servicios.filter((s) => s.categoria === filtroCategoria);

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Catálogo de Servicios</h2>

      {/* Filtro por categoría */}
      <div className="row mb-4">
        <div className="col-md-4">
          <label htmlFor="selectCategoria" className="form-label fw-bold">
            Filtrar por categoría:
          </label>
          <select
            id="selectCategoria"
            className="form-select"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {serviciosFiltrados.map((s) => (
              <div className="col" key={s.id}>
                <TarjetaServicio servicio={s} />
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link to="/turnos" className="btn btn-primary btn-lg">
              Reservar Turno
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
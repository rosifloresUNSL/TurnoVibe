import { useState } from 'react';
import { peluquerosApi } from '../../../api/endpoints';

// Alta, renombrado y baja de peluqueros (CRUD). Los errores del servidor se muestran tal cual:
// "email repetido" (409), "tiene turnos" (409), validaciones (400).
export function GestionPeluqueros({ peluqueros, onCambio }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(null); // { id, nombre } del que se está renombrando

  const mensajeDe = (err) => (err.detalles ? `${err.message} ${Object.values(err.detalles).join(' ')}` : err.message);

  const ejecutar = async (accion) => {
    setError('');
    try {
      await accion();
      onCambio();
      return true;
    } catch (err) {
      setError(mensajeDe(err));
      return false;
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    setEnviando(true);
    const creado = await ejecutar(() => peluquerosApi.crear({ nombre, email, password }));
    if (creado) {
      setNombre('');
      setEmail('');
      setPassword('');
    }
    setEnviando(false);
  };

  const handleGuardarNombre = async (e) => {
    e.preventDefault();
    const guardado = await ejecutar(() => peluquerosApi.renombrar(editando.id, editando.nombre));
    if (guardado) setEditando(null);
  };

  const handleEliminar = async (peluquero) => {
    if (!window.confirm(`¿Eliminar a ${peluquero.nombre} y su cuenta de acceso?`)) return;
    await ejecutar(() => peluquerosApi.eliminar(peluquero.id));
  };

  return (
    <div className="card p-4 border mb-4">
      <h5 className="fw-bold mb-3">Gestión de peluqueros</h5>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <ul className="list-group mb-4">
        {peluqueros.map((p) => (
          <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
            {editando?.id === p.id ? (
              <form onSubmit={handleGuardarNombre} className="d-flex gap-2 flex-grow-1 me-3">
                <input
                  aria-label={`Nuevo nombre de ${p.nombre}`}
                  className="form-control form-control-sm"
                  value={editando.nombre}
                  onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
                  minLength={2}
                  required
                />
                <button type="submit" className="btn btn-sm btn-success">Guardar</button>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setEditando(null)}>Cancelar</button>
              </form>
            ) : (
              <span className="fw-bold">{p.nombre}</span>
            )}
            {editando?.id !== p.id && (
              <span className="d-flex gap-2">
                <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setEditando({ id: p.id, nombre: p.nombre })}>Renombrar</button>
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(p)}>Eliminar</button>
              </span>
            )}
          </li>
        ))}
      </ul>

      <h6 className="fw-bold">Agregar peluquero</h6>
      <p className="text-muted small">Se crea también su cuenta de acceso (rol staff).</p>
      <form onSubmit={handleCrear} className="row g-3">
        <div className="col-md-3">
          <label htmlFor="altaNombre" className="form-label">Nombre</label>
          <input id="altaNombre" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} minLength={2} required />
        </div>
        <div className="col-md-4">
          <label htmlFor="altaEmail" className="form-label">Email (usuario de acceso)</label>
          <input id="altaEmail" type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="col-md-3">
          <label htmlFor="altaPassword" className="form-label">Contraseña inicial</label>
          <input id="altaPassword" type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} autoComplete="new-password" required />
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={enviando}>
            {enviando ? 'Creando...' : 'Agregar'}
          </button>
        </div>
      </form>
    </div>
  );
}
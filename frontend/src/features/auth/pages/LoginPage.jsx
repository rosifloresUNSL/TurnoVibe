import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const resultado = authService.login(email, password);

    if (resultado.exito) {
      const rol = resultado.usuario.rol;
      if (rol === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/staff/dashboard', { replace: true });
      }
    } else {
      setError(resultado.mensaje);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="card shadow-sm p-4 border-0" style={{ maxWidth: '420px', width: '100%' }}>
        <h3 className="fw-bold text-center mb-4">Acceso TurnoVibe</h3>
        
        {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@turnovibe.com / franco@turnovibe.com"
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Contraseña</label>
            <input
              type="password"
              className="form-control"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin / staff"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-4 pt-3 border-top text-muted small">
          <p className="mb-1"><strong>Credenciales de prueba (Mock):</strong></p>
          <ul className="mb-0 ps-3">
            <li><strong>Admin:</strong> admin@turnovibe.com / admin</li>
            <li><strong>Staff:</strong> franco@turnovibe.com / staff</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
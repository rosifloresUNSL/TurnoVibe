import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../../../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { usuario, cargando, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Si ya hay sesión iniciada, no tiene sentido mostrar el login.
  if (!cargando && usuario) {
    return <Navigate to={usuario.rol === 'admin' ? '/admin/dashboard' : '/staff/dashboard'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const sesion = await login(email, password);
      navigate(sesion.rol === 'admin' ? '/admin/dashboard' : '/staff/dashboard', { replace: true });
    } catch (err) {
      // 401: credenciales inválidas · 429: demasiados intentos · 0: sin conexión
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-4">
          <div className="card shadow-sm p-4">
            <h2 className="fw-bold text-center mb-1">Acceso del equipo</h2>
            <p className="text-muted text-center small mb-4">Para administradores y peluqueros</p>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-bold">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-bold">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={enviando}>
                {enviando ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
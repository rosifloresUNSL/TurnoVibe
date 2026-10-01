import { createBrowserRouter, redirect } from 'react-router';
import { PublicLayout } from '../shared/layout/PublicLayout';
import { GestorLayout } from '../shared/layout/GestorLayout';
import { NoEncontradaPage } from '../shared/pages/NoEncontradaPage';
import { HomePage } from '../features/home';
import { ServiciosPage } from '../features/servicios';
import { ReservarTurnoPage } from '../features/turnos';
import { LoginPage, authService } from '../features/auth';
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';
import { StaffDashboardPage } from '../features/staff/pages/StaffDashboardPage';

// Guardias de autenticación
const protegerRutaAutenticada = () => {
  if (!authService.estaAutenticado()) {
    return redirect('/login');
  }
  return null;
};

const protegerRutaAdmin = () => {
  if (!authService.estaAutenticado()) {
    return redirect('/login');
  }
  const usuario = authService.obtenerUsuario();
  if (usuario?.rol !== 'admin') {
    return redirect('/staff/dashboard');
  }
  return null;
};

const redirigirSiAutenticado = () => {
  if (authService.estaAutenticado()) {
    const usuario = authService.obtenerUsuario();
    if (usuario?.rol === 'admin') {
      return redirect('/admin/dashboard');
    }
    return redirect('/staff/dashboard');
  }
  return null;
};

export const router = createBrowserRouter([
  /* RUTAS PÚBLICAS */
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'servicios', element: <ServiciosPage /> },
      { path: 'turnos', element: <ReservarTurnoPage /> },
      { path: 'login', loader: redirigirSiAutenticado, element: <LoginPage /> }
    ]
  },

  /* RUTAS PRIVADAS (ADMINISTRADOR / DUEÑO) */
  {
    path: '/admin',
    element: <GestorLayout />,
    loader: protegerRutaAdmin,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'dashboard', element: <AdminDashboardPage /> }
    ]
  },

  /* RUTAS PRIVADAS (PELUQUERO / STAFF) */
  {
    path: '/staff',
    element: <GestorLayout />,
    loader: protegerRutaAutenticada,
    children: [
      { index: true, element: <StaffDashboardPage /> },
      { path: 'dashboard', element: <StaffDashboardPage /> }
    ]
  },

  /* RUTA CAPTURA 404 */
  { path: '*', element: <NoEncontradaPage /> }
]);
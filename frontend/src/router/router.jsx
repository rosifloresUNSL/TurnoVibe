import { createBrowserRouter } from 'react-router';
import { PublicLayout } from '../shared/layout/PublicLayout';
import { GestorLayout } from '../shared/layout/GestorLayout';
import { NoEncontradaPage } from '../shared/pages/NoEncontradaPage';
import { RutaProtegida } from './RutaProtegida';
import { HomePage } from '../features/home';
import { ServiciosPage } from '../features/servicios';
import { ReservarTurnoPage } from '../features/turnos';
import { LoginPage } from '../features/auth';
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';
import { StaffDashboardPage } from '../features/staff/pages/StaffDashboardPage';

export const router = createBrowserRouter([
  /* RUTAS PÚBLICAS */
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'servicios', element: <ServiciosPage /> },
      { path: 'turnos', element: <ReservarTurnoPage /> },
      { path: 'login', element: <LoginPage /> }
    ]
  },

  /* RUTAS PRIVADAS (ADMINISTRADOR / DUEÑO) */
  {
    element: <RutaProtegida roles={['admin']} />,
    children: [
      {
        path: '/admin',
        element: <GestorLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'dashboard', element: <AdminDashboardPage /> }
        ]
      }
    ]
  },

  /* RUTAS PRIVADAS (PELUQUERO / STAFF) */
  {
    element: <RutaProtegida roles={['staff']} />,
    children: [
      {
        path: '/staff',
        element: <GestorLayout />,
        children: [
          { index: true, element: <StaffDashboardPage /> },
          { path: 'dashboard', element: <StaffDashboardPage /> }
        ]
      }
    ]
  },

  /* RUTA CAPTURA 404 */
  { path: '*', element: <NoEncontradaPage /> }
]);
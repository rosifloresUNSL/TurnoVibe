import { createBrowserRouter, redirect } from 'react-router';
import { PublicLayout } from '../shared/layout/PublicLayout';
import { GestorLayout } from '../shared/layout/GestorLayout';
import { NoEncontradaPage } from '../shared/pages/NoEncontradaPage';
import { HomePage } from '../features/home';
import { ServiciosPage } from '../features/servicios';
import { ReservarTurnoPage, PanelGestorPage } from '../features/turnos';
import { LoginPage, authService } from '../features/auth';

const protegerRutaGestor = () => {
  if (!authService.estaAutenticado()) {
    return redirect('/login');
  }
  return null;
};

const redirigirSiAutenticado = () => {
  if (authService.estaAutenticado()) {
    return redirect('/gestor');
  }
  return null;
};

export const router = createBrowserRouter([
  /* RUTAS PÚBLICAS */
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'servicios',
        element: <ServiciosPage />
      },
      {
        path: 'turnos',
        element: <ReservarTurnoPage />
      },
      {
        path: 'login',
        loader: redirigirSiAutenticado,
        element: <LoginPage />
      }
    ]
  },

  /*RUTAS PRIVADAS (GESTOR) */
  {
    path: '/gestor',
    element: <GestorLayout />,
    loader: protegerRutaGestor,
    children: [
      {
        index: true,
        element: <PanelGestorPage />
      }
    ]
  },

  /* RUTA CAPTURA 404*/
  {
    path: '*',
    element: <NoEncontradaPage />
  }
]);
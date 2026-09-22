import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../shared/layout/PublicLayout';
import { HomePage } from '../features/home/pages/HomePage';
import { ServiciosPage } from '../features/servicios/pages/ServiciosPage';
import { ReservarTurnoPage } from '../features/turnos/pages/ReservarTurnoPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'servicios', element: <ServiciosPage /> },
      { path: 'turnos', element: <ReservarTurnoPage /> },
    ],
  },
]);
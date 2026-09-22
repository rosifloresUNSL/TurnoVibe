import { Outlet } from 'react-router-dom';
import { Navbar } from '../shared/layout/Navbar';
import { Footer } from '../shared/layout/Footer';

export function PublicLayout() {
  const enlacesNavegacion = [
    { path: '/', etiqueta: 'Inicio' },
    { path: '/servicios', etiqueta: 'Servicios' },
    { path: '/turnos', etiqueta: 'Reservar Turno' }
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar marca="TURNOVIBE" enlaces={enlacesNavegacion} />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
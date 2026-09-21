import { Outlet } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

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
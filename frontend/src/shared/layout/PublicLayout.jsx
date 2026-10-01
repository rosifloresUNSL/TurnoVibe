import { Outlet } from 'react-router';
import { Encabezado } from './Encabezado';
import { Pie } from './Pie';

export function PublicLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Encabezado />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Pie />
    </div>
  );
}
import { Tarjeta } from '../../../shared/components/Tarjeta';
import { calcularDuracionTotal } from '../utils/calculoSlots';

export function ResumenReserva({ serviciosSeleccionados, fecha, slot }) {
  const cantidad = serviciosSeleccionados.length;
  const duracion = calcularDuracionTotal(serviciosSeleccionados);
  const precioTotal = serviciosSeleccionados.reduce((total, s) => total + s.precio, 0);

  return (
    <Tarjeta titulo="Resumen de tu reserva" className="bg-light">
      {cantidad === 0 ? (
        <p className="text-muted mb-0">Todavía no elegiste ningún servicio.</p>
      ) : (
        <ul className="list-unstyled mb-0">
          <li>
            Servicios: <strong>{cantidad}</strong>
            <ul className="small text-muted">
              {serviciosSeleccionados.map((s) => (
                <li key={s.id}>{s.nombre}</li>
              ))}
            </ul>
          </li>
          <li>
            Duración total: <strong>{duracion} min</strong>
          </li>
          <li>
            Total estimado: <strong>${precioTotal}</strong>
          </li>
          {slot && (
            <>
              <li className="mt-2">
                Fecha: <strong>{fecha}</strong>
              </li>
              <li>
                Horario:{' '}
                <strong>
                  {slot.horaInicio} a {slot.horaFin} hs
                </strong>
              </li>
              <li>
                Peluquero: <strong>{slot.peluqueroNombre}</strong>
              </li>
            </>
          )}
        </ul>
      )}
    </Tarjeta>
  );
}
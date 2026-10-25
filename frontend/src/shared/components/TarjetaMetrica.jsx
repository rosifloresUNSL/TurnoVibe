// Tarjeta de un indicador para los dashboards.
export function TarjetaMetrica({ titulo, valor, detalle, color = 'primary' }) {
  return (
    <div className={`card p-3 bg-${color} text-white shadow-sm h-100`}>
      <span className="small text-uppercase">{titulo}</span>
      <h3 className="fw-bold mb-0">{valor}</h3>
      {detalle && <span className="small">{detalle}</span>}
    </div>
  );
}
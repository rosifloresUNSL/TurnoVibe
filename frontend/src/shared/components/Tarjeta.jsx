export function Tarjeta({ titulo, children, className = '' }) {
  return (
    <section className={`card p-3 mb-4 border ${className}`}>
      {titulo && <h5 className="fw-bold mb-3">{titulo}</h5>}
      {children}
    </section>
  );
}
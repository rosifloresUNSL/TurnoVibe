export function Footer({ derechos = '© 2026 TURNOVIBE. Todos los derechos reservados.' }) {
  return (
    <footer className="bg-light text-center text-muted py-3 border-top mt-auto">
      <div className="container">
        <small>{derechos}</small>
      </div>
    </footer>
  );
}
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './shared/layout/header'
import Footer from './shared/layout/footer'
import Servicios from './feactures/publico/servicios'
import Peluqueros from './feactures/publico/peluqueros'
import heroBg from './assets/imagenes/hero-bg.jpg' // Opcional: si prefieres importarla arriba
import './App.css'

function Home() {
  return (
    <main className="container mt-4 mb-5">
      <section className="hero-image-container" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <img 
          src={heroBg} // Si prefieres usar la ruta directa, puedes poner src="./assets/hero-bg.jpg"
          alt="Interior del salón de peluquería TurnoVibe" 
          className="hero-img img-fluid" 
        />
      </section>

      <section className="card-container p-4 border rounded bg-light">
        <h2 className="section-title mb-3">Reserva tu Turno</h2>
        <p className="text-muted">Selecciona tu servicio y horario. El turno quedará bloqueado por 15 minutos para concretar el pago.</p>
        
        <form onSubmit={(e) => e.preventDefault()} style={{ marginTop: '1.5rem' }}>
          
          <div className="form-group mb-3">
            <label htmlFor="nombre">Nombre Completo</label>
            <input type="text" id="nombre" name="nombre" className="form-control" placeholder="Ej. Juan Pérez" required />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="telefono">Teléfono de Contacto</label>
            <input type="tel" id="telefono" name="telefono" className="form-control" placeholder="+54 2664 123456" required />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" id="email" name="email" className="form-control" placeholder="juan@ejemplo.com" required />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="fecha">Fecha de Reserva</label>
            <input type="date" id="fecha" name="fecha" className="form-control" min="2026-08-22" max="2026-12-31" required />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="servicio">Selecciona el Servicio</label>
            <select id="servicio" name="servicio" className="form-control" required defaultValue="">
              <option value="" disabled>-- Selecciona un servicio --</option>
              <option value="corte">Corte Clásico ($15.000)</option>
              <option value="color">Coloración Completa ($28.000)</option>
              <option value="barberia">Barbería & Barba ($12.000)</option>
              <option value="combo">Combo Corte + Barba ($22.000)</option>
            </select>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="comentarios">Comentarios o Preferencias Adicionales</label>
            <textarea id="comentarios" name="comentarios" className="form-control" rows="4" placeholder="Indícanos si tienes alguna preferencia de estilo..."></textarea>
          </div>

          <button type="submit" className="btn btn-primary">Continuar al Pago</button>
        </form>
      </section>
    </main>
  )
}

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/peluqueros" element={<Peluqueros />} />
      </Routes>

      <Footer />
    </Router>
  )
}

export default App
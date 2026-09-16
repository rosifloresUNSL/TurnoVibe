
function Servicios() {
  return (
    <>

    <main className="container my-5">
      {/* Sección del Formulario */}
      <section className="card-container mb-5">
        <h2 className="section-title">Acceso de Administrador</h2>
        
        {/* Formulario Login Admin */}
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group mb-3">
            <label htmlFor="admin-email">Correo Administrador</label>
            <input type="email" id="admin-email" name="admin-email" className="form-control" required />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="admin-pass">Contraseña</label>
            <input type="password" id="admin-pass" name="admin-pass" className="form-control" required />
          </div>
          <button type="submit" className="btn btn-primary">Ingresar al Panel</button>
        </form>
      </section>

      {/* Vista Previa Tabla de Gestión CRUD */}
      <section className="card-container">
        <h3>Turnos Agendados del Día</h3>
        <table className="table table-data">
          <caption>Agenda Global (Vista Admin)</caption>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Peluquero</th>
              <th>Hora</th>
              <th>Estado Pago</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Carlos Gómez</td>
              <td>Corte</td>
              <td>Lucas Sosa</td>
              <td>10:00 hs</td>
              {/* Estilos en línea convertidos a objeto JSX */}
              <td><span style={{ color: 'green', fontWeight: 600 }}>Aprobado</span></td>
            </tr>
          </tbody>
        </table>
        
        <div style={{ marginTop: '1.5rem' }}>
          <a href="/" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>Regresar al Inicio</a>
        </div>
      </section>
    </main>
    
    </>
  )
}

export default Servicios
function Peluqueros() {
  return (
    <main className="container my-5">
      <section className="card-container">
        <h2 className="section-title">Staff Profesional</h2>
        
        {/* Índice de la página */}
        <h3 className="h5 mt-4">Índice de la página:</h3>
        <ol style={{ margin: '1rem 0 1.5rem 1.5rem' }}>
          <li><a href="#filosofia">Nuestra Filosofía de Trabajo</a></li>
          <li><a href="#equipo">Conoce a Nuestro Equipo (Saltar aquí)</a></li>
        </ol>

        {/* Sección Filosofía */}
        <div id="filosofia" style={{ marginBottom: '2rem' }}>
          <h3>Nuestra Filosofía</h3>
          <p>
            Buscamos brindar una experiencia de corte de precisión en un ambiente relajado y moderno.
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam, dolor odio facere vero sint porro ducimus repudiandae, minus inventore accusantium soluta modi delectus non? Autem et atque repellat. Id, itaque?
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. A vel repudiandae est, ipsa quisquam sapiente vitae nostrum aperiam. Placeat voluptatibus eligendi nostrum adipisci veritatis quia similique laborum consectetur natus ipsa.
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda nemo doloremque, voluptas sed rem quas quae neque laudantium dignissimos distinctio commodi ullam labore dolor expedita beatae obcaecati pariatur deserunt animi.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati non alias id quibusdam, quas voluptate modi labore qui consequatur hic quam dolorum incidunt eius delectus nam nesciunt sed. Nemo, necessitatibus?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque modi consectetur amet sed illo sint error nam dolorem consequatur optio adipisci, architecto ut in at repellat atque? Quas, doloribus!
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere modi tempora iste sint, perspiciatis officia eveniet explicabo exercitationem consequatur omnis distinctio deserunt culpa, dolor ea reprehenderit blanditiis libero unde? Consequuntur.
          </p>
        </div>

        {/* Sección Equipo */}
        <div id="equipo" style={{ paddingTop: '1rem' }}>
          <h3>Peluqueros Destacados</h3>
          <ul style={{ marginTop: '0.5rem', marginLeft: '1.2rem' }}>
            <li><strong>Lucas Sosa:</strong> Especialista en Barbería y Fades.</li>
            <li><strong>Mateo Rossi:</strong> Estilista Senior en Color y Tijera.</li>
            <li>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est unde sit mollitia nesciunt, nihil optio laboriosam consequatur, architecto nisi ea culpa natus dolores asperiores autem error illum dolorum, quibusdam doloribus.
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Modi tenetur nobis quisquam quae eos, rem repellat sapiente laudantium cum quis ipsum optio cumque, blanditiis animi perspiciatis. Aspernatur dolore illum iusto.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt sunt corrupti dolor maiores quisquam et consequatur libero eveniet recusandae, vero excepturi sequi accusamus maxime adipisci reiciendis! Odit vitae eius nulla!
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor commodi consequuntur sit dolorum tempora? Praesentium sit consectetur odit quia perferendis quibusdam minus itaque incidunt saepe aspernatur? Consectetur, culpa! Eligendi, at.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio nihil aperiam explicabo vel excepturi possimus, placeat, sit hic aspernatur itaque, rem quasi voluptatibus architecto! Aliquam ab amet hic deleniti minus!
            </li>
          </ul>
        </div>

      </section>
    </main>
  )
}

export default Peluqueros
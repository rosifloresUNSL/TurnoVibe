import { useState, useRef } from 'react';
import { validarFormularioReserva } from '../utils/validaciones';

export function FormularioReserva({ turnoSeleccionado, servicioSeleccionado, enConfirmacionExitosa }) {
  const [valores, setValores] = useState({
    nombre: '',
    email: '',
    telefono: '',
    notas: ''
  });

  const [errores, setErrores] = useState({});

  const [estadoEnvio, setEstadoEnvio] = useState('escribiendo');

  const inputRefs = {
    nombre: useRef(null),
    email: useRef(null),
    telefono: useRef(null)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValores((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errores[name]) {
      setErrores((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormularioReserva(valores);
    setErrores(nuevosErrores);

    const camposConError = Object.keys(nuevosErrores);

    if (camposConError.length > 0) {
      const primerCampoConError = camposConError[0];
      if (inputRefs[primerCampoConError] && inputRefs[primerCampoConError].current) {
        inputRefs[primerCampoConError].current.focus();
      }
      return;
    }

    setEstadoEnvio('enviando');

    setTimeout(() => {
      setEstadoEnvio('enviado');
      enConfirmacionExitosa({
        cliente: valores,
        turno: turnoSeleccionado,
        servicio: servicioSeleccionado
      });
    }, 1500);
  };

  if (estadoEnvio === 'enviado') {
    return (
      <div className="alert alert-success mt-4 p-4 text-center" role="alert">
        <h4 className="alert-heading fw-bold">¡Reserva Confirmada!</h4>
        <p className="mb-0">
          Gracias <strong>{valores.nombre}</strong>. Se ha enviado el comprobante a{' '}
          <strong>{valores.email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-4 border-top pt-4">
      <h5 className="fw-bold mb-3">Paso 3: Complete sus datos de contacto</h5>


      <div className="mb-3">
        <label htmlFor="nombre" className="form-label fw-bold">
          Nombre y Apellido *
        </label>
        <input
          ref={inputRefs.nombre}
          type="text"
          id="nombre"
          name="nombre"
          className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
          value={valores.nombre}
          onChange={handleChange}
          disabled={estadoEnvio === 'enviando'}
          placeholder="Ej: Juan Pérez"
        />
        {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label fw-bold">
          Correo Electrónico *
        </label>
        <input
          ref={inputRefs.email}
          type="email"
          id="email"
          name="email"
          className={`form-control ${errores.email ? 'is-invalid' : ''}`}
          value={valores.email}
          onChange={handleChange}
          disabled={estadoEnvio === 'enviando'}
          placeholder="nombre@ejemplo.com"
        />
        {errores.email && <div className="invalid-feedback">{errores.email}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="telefono" className="form-label fw-bold">
          Teléfono de Contacto *
        </label>
        <input
          ref={inputRefs.telefono}
          type="tel"
          id="telefono"
          name="telefono"
          className={`form-control ${errores.telefono ? 'is-invalid' : ''}`}
          value={valores.telefono}
          onChange={handleChange}
          disabled={estadoEnvio === 'enviando'}
          placeholder="Ej: 1122334455"
        />
        {errores.telefono && <div className="invalid-feedback">{errores.telefono}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="notas" className="form-label fw-bold">
          Notas o Preferencias (Opcional)
        </label>
        <textarea
          id="notas"
          name="notas"
          rows="3"
          className="form-control"
          value={valores.notas}
          onChange={handleChange}
          disabled={estadoEnvio === 'enviando'}
          placeholder="Indique cualquier aclaración adicional..."
        ></textarea>
      </div>

      <button
        type="submit"
        className="btn btn-success btn-lg w-100"
        disabled={estadoEnvio === 'enviando'}
      >
        {estadoEnvio === 'enviando' ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Procesando Reserva...
          </>
        ) : (
          'Confirmar y Reservar Turno'
        )}
      </button>
    </form>
  );
}
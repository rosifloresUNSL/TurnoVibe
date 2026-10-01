import { useState, useRef } from 'react';
import { validarFormularioReserva } from '../utils/validaciones';

export function FormularioReserva({ enConfirmar }) {
  const [valores, setValores] = useState({
    nombre: '',
    email: '',
    telefono: '',
    notas: ''
  });
  const [errores, setErrores] = useState({});

  const inputRefs = {
    nombre: useRef(null),
    email: useRef(null),
    telefono: useRef(null)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValores((prev) => ({ ...prev, [name]: value }));

    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormularioReserva(valores);
    setErrores(nuevosErrores);

    const camposConError = Object.keys(nuevosErrores);
    if (camposConError.length > 0) {
      inputRefs[camposConError[0]]?.current?.focus();
      return;
    }

    enConfirmar(valores);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-2">
      <h5 className="fw-bold mb-3">4. Completá tus datos de contacto</h5>

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
          placeholder="Indicá cualquier aclaración adicional..."
        ></textarea>
      </div>

      <button type="submit" className="btn btn-success btn-lg w-100">
        Confirmar y Reservar Turno
      </button>
    </form>
  );
}
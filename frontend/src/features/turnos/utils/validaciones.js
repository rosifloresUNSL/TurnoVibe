/**
 * Función pura que valida el objeto de valores del formulario.
 * @param {Object} valores - Objeto con { nombre, email, telefono, notas }
 * @returns {Object} Objeto 'errores' con los mensajes por cada campo inválido.
 */
export function validarFormularioReserva(valores) {
  const errores = {};

  if (!valores.nombre || !valores.nombre.trim()) {
    errores.nombre = 'El nombre y apellido son obligatorios.';
  } else if (valores.nombre.trim().length < 3) {
    errores.nombre = 'El nombre debe tener al menos 3 caracteres.';
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!valores.email || !valores.email.trim()) {
    errores.email = 'El correo electrónico es obligatorio.';
  } else if (!regexEmail.test(valores.email)) {
    errores.email = 'Ingrese un formato de correo electrónico válido.';
  }

  if (!valores.telefono || !valores.telefono.trim()) {
    errores.telefono = 'El teléfono de contacto es obligatorio.';
  } else if (valores.telefono.trim().length < 8) {
    errores.telefono = 'Ingrese un número de teléfono válido (mínimo 8 dígitos).';
  }

  return errores;
}
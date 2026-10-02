// Middleware de validación: corta con 400 antes de llegar a la ruta.
const serviciosRepository = require('../repositories/serviciosRepository');
const asyncHandler = require('../utils/asyncHandler');
const { calcularDuracion } = require('../services/turnosService');
const {
  HORA_APERTURA,
  HORA_CIERRE,
  INTERVALO_MINUTOS,
  esHoraValida,
  horaAMinutos
} = require('../utils/horarios');
const {
  ESTADOS_VALIDOS,
  REGEX_EMAIL,
  estaVacio,
  esFechaValida,
  esIdValido
} = require('../utils/validaciones');

const CAMPOS_OBLIGATORIOS = [
  'peluqueroId',
  'servicios',
  'fecha',
  'horaInicio',
  'clienteNombre',
  'clienteEmail',
  'clienteTelefono'
];

// Función pura: recibe el body y el catálogo de servicios y devuelve qué falta y qué está mal.
function validarDatosTurno(body, catalogo) {
  const camposFaltantes = CAMPOS_OBLIGATORIOS.filter((campo) => estaVacio(body[campo]));
  const detalles = {};

  if (!camposFaltantes.includes('peluqueroId') && !esIdValido(body.peluqueroId)) {
    detalles.peluqueroId = 'Debe ser un número entero positivo.';
  }

  let serviciosOk = false;
  if (!camposFaltantes.includes('servicios')) {
    const { servicios } = body;
    const idsCatalogo = catalogo.map((s) => s.id);
    if (!Array.isArray(servicios)) {
      detalles.servicios = 'Debe ser un arreglo de ids de servicio.';
    } else if (servicios.some((id) => !idsCatalogo.includes(id))) {
      detalles.servicios = `Hay servicios inexistentes. Válidos: ${idsCatalogo.join(', ')}.`;
    } else if (new Set(servicios).size !== servicios.length) {
      detalles.servicios = 'No se pueden repetir servicios.';
    } else {
      serviciosOk = true;
    }
  }

  if (!camposFaltantes.includes('fecha') && !esFechaValida(body.fecha)) {
    detalles.fecha = 'Debe tener formato AAAA-MM-DD y ser una fecha real.';
  }

  if (!camposFaltantes.includes('horaInicio')) {
    if (!esHoraValida(body.horaInicio)) {
      detalles.horaInicio = 'Debe tener formato HH:MM.';
    } else if (horaAMinutos(body.horaInicio) % INTERVALO_MINUTOS !== 0) {
      detalles.horaInicio = `Debe empezar en múltiplos de ${INTERVALO_MINUTOS} minutos (09:00, 09:30...).`;
    } else if (horaAMinutos(body.horaInicio) < horaAMinutos(HORA_APERTURA)) {
      detalles.horaInicio = `El local abre a las ${HORA_APERTURA}.`;
    } else if (serviciosOk) {
      // El bloque completo debe entrar antes del cierre.
      const fin = horaAMinutos(body.horaInicio) + calcularDuracion(body.servicios, catalogo);
      if (fin > horaAMinutos(HORA_CIERRE)) {
        detalles.horaInicio = `Con esos servicios el turno terminaría después del cierre (${HORA_CIERRE}).`;
      }
    }
  }

  if (!camposFaltantes.includes('clienteNombre')) {
    if (typeof body.clienteNombre !== 'string' || body.clienteNombre.trim().length < 3) {
      detalles.clienteNombre = 'Debe ser un texto de al menos 3 caracteres.';
    }
  }

  if (!camposFaltantes.includes('clienteEmail')) {
    if (typeof body.clienteEmail !== 'string' || !REGEX_EMAIL.test(body.clienteEmail.trim())) {
      detalles.clienteEmail = 'Formato de email inválido.';
    }
  }

  if (!camposFaltantes.includes('clienteTelefono')) {
    const soloDigitos = String(body.clienteTelefono).replace(/\D/g, '');
    if (soloDigitos.length < 8) {
      detalles.clienteTelefono = 'Debe tener al menos 8 dígitos.';
    }
  }

  // "estado" es opcional (por defecto 'confirmado'), pero si viene debe ser válido.
  if (body.estado !== undefined && !ESTADOS_VALIDOS.includes(body.estado)) {
    detalles.estado = `Debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}.`;
  }

  return { camposFaltantes, detalles };
}

const validarTurno = asyncHandler(async (req, res, next) => {
  // Express 5: si el cliente no manda JSON, req.body es undefined (en Express 4 era {}).
  const sinBody = req.body === undefined;
  const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};

  // El catálogo vive en la base: se consulta y se deja en req para que la ruta lo reutilice.
  const catalogo = await serviciosRepository.listar();
  const { camposFaltantes, detalles } = validarDatosTurno(body, catalogo);

  if (camposFaltantes.length > 0) {
    return res.status(400).json({
      error: 'Faltan campos obligatorios.',
      camposFaltantes,
      ...(sinBody && {
        pista: 'No llegó ningún body JSON. Revisá el header Content-Type: application/json.'
      })
    });
  }

  if (Object.keys(detalles).length > 0) {
    return res.status(400).json({ error: 'Hay campos con valores inválidos.', detalles });
  }

  req.catalogoServicios = catalogo;
  next();
});

module.exports = { validarTurno, validarDatosTurno };
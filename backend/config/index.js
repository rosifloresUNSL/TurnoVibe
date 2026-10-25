// Configuración leída del entorno, validada UNA vez al arrancar.
// Si falta algo crítico, el servidor no arranca (mejor fallar ya que funcionar inseguro).
function lista(valor, porDefecto) {
  return (valor ?? porDefecto)
    .split(',')
    .map((texto) => texto.trim())
    .filter(Boolean);
}

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error(
    'Falta JWT_SECRET en .env (mínimo 32 caracteres). Generá uno con: ' +
      `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
  );
}

module.exports = Object.freeze({
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  // Orígenes (sitios web) autorizados a llamar a la API desde un navegador.
  corsOrigins: lista(process.env.CORS_ORIGINS, 'http://localhost:5173')
});
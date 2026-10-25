// Crea (o actualiza) las cuentas de ejemplo: 1 admin + 1 cuenta de staff por cada peluquero.
// Uso: npm run db:seed
// Las contraseñas salen de .env (SEED_ADMIN_PASSWORD / SEED_STAFF_PASSWORD): no hay
// contraseñas ni hashes escritos en el repositorio. Es solo para desarrollo/demo.
const bcrypt = require('bcryptjs');
const { pool } = require('./pool');

const { SEED_ADMIN_PASSWORD, SEED_STAFF_PASSWORD } = process.env;

function exigir(nombre, valor) {
  if (!valor || valor.length < 8) {
    console.error(`Falta ${nombre} en .env (mínimo 8 caracteres).`);
    process.exit(1);
  }
}

// "Lucas" -> "lucas@turnovibe.com" (sin tildes ni espacios)
function emailDe(nombre) {
  const base = nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '.');
  return `${base}@turnovibe.com`;
}

// Si el email existe actualiza la clave; si no, lo crea.
async function guardarUsuario({ nombre, email, password, rol, peluqueroId }) {
  console.log('Guardando usuario:', email);

  const passwordHash = await bcrypt.hash(password, 10);

  console.log('Buscando usuario existente:', email);

  const existente = await pool.query(
    'SELECT id FROM usuarios WHERE lower(email) = lower($1)',
    [email]
  );

  console.log('Resultado búsqueda:', existente.rows);

  if (existente.rows.length > 0) {
    console.log('Actualizando:', email);

    await pool.query(
      'UPDATE usuarios SET nombre = $2, password_hash = $3, activo = true WHERE id = $1',
      [
        existente.rows[0].id,
        nombre,
        passwordHash
      ]
    );

    return 'actualizado';
  }

  console.log('Insertando:', email);

  await pool.query(
    'INSERT INTO usuarios (nombre, email, password_hash, rol, peluquero_id) VALUES ($1, $2, $3, $4, $5)',
    [nombre, email, passwordHash, rol, peluqueroId]
  );

  return 'creado';
}

async function main() {
  exigir('SEED_ADMIN_PASSWORD', SEED_ADMIN_PASSWORD);
  exigir('SEED_STAFF_PASSWORD', SEED_STAFF_PASSWORD);

  const admin = { nombre: 'Administrador', email: 'admin@turnovibe.com', password: SEED_ADMIN_PASSWORD, rol: 'admin', peluqueroId: null };
  console.log(`${admin.email} (admin): ${await guardarUsuario(admin)}`);

  const { rows: peluqueros } = await pool.query('SELECT id, nombre FROM peluqueros ORDER BY id');
  for (const p of peluqueros) {
    const staff = { nombre: p.nombre, email: emailDe(p.nombre), password: SEED_STAFF_PASSWORD, rol: 'staff', peluqueroId: p.id };
    console.log(`${staff.email} (staff): ${await guardarUsuario(staff)}`);
  }
  await pool.end();
}

main().catch(async (error) => {
  console.error('Error al crear usuarios:', error.message);
  await pool.end();
  process.exit(1);
});
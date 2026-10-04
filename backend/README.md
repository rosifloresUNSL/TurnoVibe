# TurnoVibe Backend

## Endpoints

| Método | URI | Acceso | Éxito | Errores |
|---|---|---|---|---|
| POST | `/api/auth/login` | Público | 200 | 400, 401, 429 |
| GET | `/api/auth/me` | Login | 200 | 401 |
| GET | `/api/servicios` | Público | 200 | — |
| GET | `/api/peluqueros` | Público | 200 | — |
| GET | `/api/disponibilidad?fecha=&servicios=&peluqueroId=` | Público | 200 | 400, 404 |
| POST | `/api/turnos` | Público (estado `confirmado` forzado) / Login | 201 | 400, 401, 403, 409 |
| GET | `/api/turnos` (filtros `?fecha=&estado=&peluqueroId=`) | Login (staff: solo los suyos) | 200 | 400, 401 |
| GET | `/api/turnos/:id` | Login (staff: solo los suyos) | 200 | 400, 401, 403, 404 |
| PUT | `/api/turnos/:id` | Login (staff: solo los suyos) | 200 | 400, 401, 403, 404, 409 |
| DELETE | `/api/turnos/:id` | Login (staff: solo los suyos) | 204 | 401, 403, 404 |
| GET | `/api/peluqueros/:id/turnos` (anidado) | Login (staff: solo el suyo) | 200 | 401, 403, 404 |
| POST | `/api/peluqueros` | Admin (crea peluquero + cuenta) | 201 | 400, 401, 403, 409 |
| PUT | `/api/peluqueros/:id` | Admin | 200 | 400, 401, 403, 404 |
| DELETE | `/api/peluqueros/:id` | Admin | 204 | 401, 403, 404, 409 |

## Autenticación

- Login con email y contraseña -> JWT (`HS256`, vence en 8 h por defecto).
- Se envía en cada solicitud: `Authorization: Bearer <token>`.
- Roles: `admin` (todo) y `staff` (solo su propia agenda). Los clientes no tienen cuenta.
- Las contraseñas se guardan con bcrypt. Las cuentas de ejemplo se crean con `npm run db:seed`.
- CORS: solo los orígenes de `CORS_ORIGINS` pueden llamar a la API desde un navegador.

## Limitaciones conocidas

- Cualquiera puede crear reservas (POST público): en la Etapa 4 quedarán `pendiente_pago` y vencerán a los 15 minutos.
- Sin recuperación de contraseña ni cambio de rol desde la API.
- La disponibilidad no excluye horarios pasados del día de hoy.
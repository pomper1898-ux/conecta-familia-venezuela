-- 1. Primero crea estos usuarios manualmente en Supabase:
-- Authentication > Users > Add user
-- Asigna correo y contraseña a cada admin.
--
-- 2. Luego reemplaza los correos de abajo y ejecuta este SQL.
-- Esto NO crea las cuentas; solo les da permiso completo de admin
-- dentro de Conecta Familia Venezuela.

insert into public.profiles (id, email, role)
select id, email, 'admin'::app_role
from auth.users
where email in (
  'admin1@correo.com',
  'admin2@correo.com',
  'admin3@correo.com'
)
on conflict (id) do update set role = 'admin';

-- Verificación: debe devolver los 3 usuarios con role = admin.
select id, email, role, created_at
from public.profiles
where email in (
  'admin1@correo.com',
  'admin2@correo.com',
  'admin3@correo.com'
)
order by email;

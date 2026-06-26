# Conecta Familia Venezuela: Supabase Setup

## 1. Crear proyecto

1. Entra a Supabase y crea un proyecto nuevo.
2. Ve a **SQL Editor**.
3. Copia y ejecuta completo el archivo `supabase-schema.sql`.

## 2. Activar acceso admin con contraseña

1. Ve a **Authentication > Providers > Email**.
2. Activa login por email y contraseña.
3. Si quieres evitar registros públicos, crea los usuarios manualmente desde **Authentication > Users**.
4. En **Authentication > URL Configuration**, agrega la URL local y luego la URL de Vercel:
   - `http://127.0.0.1:8767`
   - `https://tu-dominio.vercel.app`

## 3. Crear primer admin

1. En Supabase, ve a **Authentication > Users**.
2. Crea tu usuario admin con correo y contraseña.
3. Luego ejecuta este SQL cambiando el correo:

```sql
insert into public.profiles (id, email, role)
select id, email, 'admin'::app_role
from auth.users
where email = 'tu-correo@example.com'
on conflict (id) do update set role = 'admin';
```

La contraseña vive en Supabase Auth. El permiso de admin vive en `public.profiles`.

## 4. Configurar la landing

Copia `config.example.js` sobre `config.js` y cambia:

```js
window.CONFAM_CONFIG = {
  supabaseUrl: "https://TU-PROYECTO.supabase.co",
  supabaseAnonKey: "TU_SUPABASE_ANON_KEY",
  whatsappNumber: "",
  whatsappGroupLink: "https://chat.whatsapp.com/TU-CODIGO-DE-GRUPO",
};
```

La `anon key` puede ir en frontend porque Supabase protege los datos con RLS.
No uses la `service_role key` en esta landing.

## 5. Flujo esperado

- Cualquier persona puede enviar un reporte.
- Todo reporte entra como `pending_review`, `private` y `published = false`.
- Solo admins/revisores autenticados y autorizados pueden ver reportes privados.
- Admin puede cambiar estados.
- Admin puede publicar una versión segura con resumen filtrado.
- La vista pública solo muestra casos aprobados y no expone teléfonos.

## 6. Despliegue en Vercel

1. Sube el proyecto a GitHub.
2. Importa el repo en Vercel.
3. Framework: Other.
4. Build command: vacío.
5. Install command: vacío.
6. Output directory: `.`.
7. Deploy.

## 7. Reglas de operación

- No publicar reportes automáticamente.
- No pedir cédula.
- No publicar teléfonos.
- No publicar direcciones exactas.
- No publicar datos médicos sensibles.
- Escalar casos de peligro inmediato a 911 / VEN-911 u organismos oficiales.

Para el uso diario del panel admin, estados y publicación segura, lee `OPERACION_AXEL.md`.

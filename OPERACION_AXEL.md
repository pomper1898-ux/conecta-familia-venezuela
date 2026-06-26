# Operación Axel: Conecta Familia Venezuela

## Entrada al panel admin

1. Abre la landing publicada en Vercel.
2. Ve a la sección **Admin**.
3. Escribe el correo autorizado.
4. Escribe la contraseña del usuario admin.
5. Presiona **Entrar al panel**.
6. Si el usuario está en `profiles` como `admin` o `reviewer`, verá la bandeja privada.

Supabase es el modo real de operación. El modo local del navegador solo sirve para pruebas.

## Crear o promover admin en Supabase

1. En Supabase, ve a **Authentication > Users**.
2. Crea el usuario con correo y contraseña.
3. Ejecuta este SQL cambiando el correo:

```sql
insert into public.profiles (id, email, role)
select id, email, 'admin'::app_role
from auth.users
where email = 'correo-admin@example.com'
on conflict (id) do update set role = 'admin';
```

Una cuenta puede existir en Supabase Auth, pero solo puede ver reportes privados si también existe en `public.profiles` con rol `admin` o `reviewer`.

## Función del admin

El admin revisa solicitudes privadas antes de publicar cualquier información:

- Ver reportes enviados.
- Validar si la información parece real.
- Cambiar el estado del caso.
- Escribir un resumen público seguro.
- Publicar u ocultar casos.
- Mantener privados teléfonos, reportantes y datos sensibles.

## Estados

- `pending_review`: reporte nuevo, privado, sin publicar.
- `urgent`: requiere prioridad operativa.
- `active_search`: búsqueda activa validada.
- `possible_match`: existe una pista o coincidencia por revisar.
- `found`: caso encontrado o cerrado positivamente.
- `escalated_to_authority`: derivado a autoridad u organismo oficial.
- `false_report`: reporte falso, duplicado dañino o descartado.

## Antes de publicar

Revisa que el resumen público:

- No incluya teléfonos.
- No incluya cédulas ni documentos.
- No incluya direcciones exactas.
- No incluya datos médicos sensibles.
- No exponga datos de menores sin cuidado especial.
- No acuse a terceros ni publique rumores.
- Sea comprensible para visitantes.
- Tenga ciudad/sector general, edad aproximada y estado correcto.

Nada se publica automáticamente. Cada reporte nuevo entra como `pending_review`, `private` y `published = false`.

## Cómo ven los visitantes los casos

Los visitantes solo ven casos aprobados en **Casos aprobados**. La vista pública muestra:

- Nombre público definido desde el caso.
- Estado legible.
- Ciudad/sector general.
- Edad aproximada.
- Fecha de creación o actualización.
- Resumen público seguro.
- Botón **Tengo información** para enviar una pista/reporte.

Nunca ven el WhatsApp del reportante ni datos privados.

## Prueba completa después de desplegar en Vercel

1. En Supabase, agrega la URL de Vercel en **Authentication > URL Configuration**.
2. Abre la página de Vercel.
3. Envía un reporte de prueba.
4. Confirma en Supabase que aparece en `reports`.
5. Entra al panel admin con correo y contraseña.
6. Busca el reporte por nombre o ciudad.
7. Filtra por `pending_review`.
8. Cambia estado a `urgent` o `active_search`.
9. Escribe un resumen público seguro.
10. Publica la versión segura.
11. Revisa que aparezca en **Casos aprobados**.
12. Confirma que no aparece teléfono ni dato sensible.
13. Oculta el caso público y verifica que desaparece.

## Configuración Vercel

- Framework Preset: `Other`
- Build Command: vacío
- Output Directory: `.`
- Install Command: vacío

El proyecto debe seguir como HTML/CSS/JS puro. No uses `service_role key` en `config.js`.

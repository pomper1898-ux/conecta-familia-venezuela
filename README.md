# Conecta Familia Venezuela

Sitio estático para organizar reportes ciudadanos privados, consultar personas reportadas de forma segura, derivar a centros/canales de ayuda y revisar publicaciones desde un panel admin.

No reemplaza al 911 / VEN-911, autoridades, protección civil, hospitales, Cruz Roja ni organismos oficiales.

## Ejecutar local

Desde la carpeta del proyecto:

```bash
python -m http.server 8767 --bind 127.0.0.1
```

Abrir:

```text
http://127.0.0.1:8767/
```

Rutas principales:

- `/personas`: buscador público de personas reportadas.
- `/hospitales`: personas localizadas o reportadas en hospitales con campos seguros.
- `/centros`: mapa/lista de centros y puntos de apoyo.
- `/admin`: revisión privada.
- `/admin/importar-hospitales`: importador manual de listados hospitalarios.

## Configurar Supabase

1. Crear proyecto en Supabase.
2. Abrir SQL Editor.
3. Ejecutar `schema.sql` si es una instalación nueva.
4. Ejecutar migraciones seguras en `supabase/migrations/`, especialmente `safe_hospital_admissions_migration.sql`.
5. Crear usuarios admin en Authentication.
6. Promover usuarios en `profiles`:

```sql
insert into public.profiles (id, email, role)
select id, email, 'admin'::app_role
from auth.users
where email in ('admin1@dominio.com', 'admin2@dominio.com')
on conflict (id) do update set role = 'admin';
```

7. En `config.js`, configurar la URL pública, anon key y grupo de WhatsApp.

Nunca usar `service_role key` en el navegador.

## Reglas de privacidad

- Los reportes nuevos entran como privados y `pending_review`.
- Nada se publica automáticamente.
- La vista pública solo debe mostrar campos seguros aprobados.
- No publicar teléfonos, cédulas, direcciones exactas, diagnósticos, historia clínica, nombres de reportantes, contactos familiares, `admin_notes` ni `private_notes`.
- Toda corrección, retiro o cambio sensible requiere revisión humana.

## Importar CSV general

Entrar a `/admin`, iniciar sesión y usar “Importar CSV con revisión previa”.

Columnas recomendadas:

```csv
nombre_persona,ciudad_sector,ultimo_contacto_o_lugar_visto,edad_aproximada,descripcion,estado_general,fuente_url,foto_url
```

Todo CSV entra como privado y pendiente de revisión.

## Importar personas localizadas en hospitales

Entrar a `/admin/importar-hospitales`.

Permite:

- Subir CSV, TSV o Excel `.xlsx`.
- Pegar una URL pública si el navegador puede leerla directamente.
- Previsualizar antes de guardar.
- Mapear columnas manualmente.
- Detectar columnas sensibles.
- Detectar filas incompletas y posibles duplicados.
- Agrupar por hospital.
- Guardar `import_batch_id`.
- Aprobar individualmente.
- Aprobar en lote solo filas seguras.
- Hacer rollback por lote.

Columnas esperadas:

```csv
nombre_persona,hospital,ciudad_estado,edad_aproximada,fecha_ingreso,fecha_publicacion,estado_publico,notas_publicas
```

Campos públicos permitidos:

- nombre de la persona
- edad aproximada
- hospital
- ciudad/estado general
- fecha de ingreso o publicación
- estado público seguro
- notas públicas sanitizadas
- fuente original

Si una fila contiene teléfono, cédula, diagnóstico, dirección exacta, correo, contacto familiar o datos de reportantes, queda bloqueada para aprobación en lote.

## Aprobar publicaciones

En `/admin` o `/admin/importar-hospitales`:

1. Revisar el registro.
2. Confirmar fuente original.
3. Editar `notas_publicas` si hace falta.
4. Confirmar que no hay datos sensibles.
5. Aprobar publicación o mantener privado.

## Marcar duplicados

Los duplicados se detectan por nombre normalizado, hospital, ciudad/estado y fecha de ingreso/publicación. Si parece duplicado, se marca para revisión y no se fusiona automáticamente.

## Corrección o retiro

La página incluye formulario de corrección/retiro. Toda solicitud entra como pendiente. Si alguien pide retirar o corregir información, se debe revisar y, ante duda, ocultar primero.

## Subir a Vercel

Configuración:

- Framework Preset: `Other`
- Build Command: vacío
- Output Directory: `.`
- Install Command: vacío

`vercel.json` incluye rewrites para `/personas`, `/hospitales`, `/centros`, `/admin` y `/admin/importar-hospitales`.

En Supabase Authentication configurar:

- Site URL: `https://conecta-familia-venezuela.vercel.app`
- Redirect URLs:
  - `https://conecta-familia-venezuela.vercel.app`
  - `https://conecta-familia-venezuela.vercel.app/admin`
  - `https://conecta-familia-venezuela.vercel.app/admin/importar-hospitales`

## Advertencias éticas y legales

Este proyecto organiza información ciudadana y fuentes públicas. No valida identidad por sí solo. Si hay peligro inmediato, llamar primero al 911 / VEN-911 o autoridades locales. Respetar fuentes originales, solicitudes legítimas de retiro y el principio de publicar solo lo mínimo necesario para ayudar.

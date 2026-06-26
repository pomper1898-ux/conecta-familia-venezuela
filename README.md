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

Rutas principales en producción:

- `/personas`: buscador público de personas.
- `/centros`: mapa/lista de centros y puntos de apoyo.
- `/admin`: revisión privada.

En local con `python -m http.server`, entra por `/` y usa la navegación interna.

## Configurar Supabase

1. Crear proyecto en Supabase.
2. Abrir SQL Editor.
3. Ejecutar `schema.sql`.
4. Crear usuarios admin en Authentication.
5. Promover usuarios en `profiles`:

```sql
insert into public.profiles (id, email, role)
select id, email, 'admin'::app_role
from auth.users
where email in ('admin1@dominio.com', 'admin2@dominio.com')
on conflict (id) do update set role = 'admin';
```

6. En `config.js`, configurar:

```js
window.CONFAM_CONFIG = {
  supabaseUrl: "https://TU-PROYECTO.supabase.co",
  supabaseAnonKey: "TU_ANON_PUBLIC_KEY",
  whatsappGroupLink: "https://chat.whatsapp.com/..."
};
```

Nunca usar `service_role key` en el navegador.

## Configurar RLS

`schema.sql` activa RLS y aplica estas reglas:

- Cualquier visitante puede crear reportes privados con `pending_review`.
- Los reportes nuevos entran con `visibility = private` y `published = false`.
- Solo admins/reviewers pueden leer reportes completos.
- La vista `public_cases` muestra solo campos seguros aprobados.
- Correcciones/retiros entran como `pending_review`.
- Centros publicados se consultan desde vista pública segura.

## Subir a Vercel

Configuración:

- Framework Preset: `Other`
- Build Command: vacío
- Output Directory: `.`
- Install Command: vacío

`vercel.json` incluye rewrites para:

- `/personas`
- `/centros`
- `/admin`

En Supabase Authentication configurar:

- Site URL: `https://conecta-familia-venezuela.vercel.app`
- Redirect URLs:
  - `https://conecta-familia-venezuela.vercel.app`
  - `https://conecta-familia-venezuela.vercel.app/admin`

## Importar CSV

Entrar a `/admin`, iniciar sesión y usar “Importar CSV con revisión previa”.

Columnas recomendadas:

```csv
nombre_persona,ciudad_sector,ultimo_contacto_o_lugar_visto,edad_aproximada,descripcion,estado_general,fuente_url,foto_url
```

Reglas:

- El importador muestra preview antes de importar.
- Todo CSV entra como reporte privado.
- Todo reporte importado queda `pending_review`.
- Nada se publica automáticamente.
- No importar teléfonos públicos, cédulas, direcciones exactas ni datos médicos.

## Aprobar publicaciones

En `/admin`:

1. Revisar reporte completo.
2. Cambiar estado si aplica.
3. Escribir resumen público seguro.
4. Confirmar que el resumen no incluya teléfonos, cédulas, direcciones exactas, datos médicos o reportantes.
5. Click en “Publicar versión segura”.

La sección `/personas` solo muestra la versión pública aprobada.

## Marcar duplicados

En `/admin`:

1. Buscar el reporte.
2. Click en “Marcar posible duplicado”.
3. Indicar ID o nombre del caso relacionado si se conoce.
4. El caso queda como `possible_match`.
5. No eliminar hasta confirmar con fuente o familiar responsable.

## Solicitudes de retiro/corrección

La página incluye formulario de correcciones/retiro.

Proceso recomendado:

1. Revisar identidad o legitimidad de quien solicita.
2. Verificar si la información es sensible, incorrecta, duplicada o ya no debe mostrarse.
3. Ocultar caso si hay riesgo.
4. Corregir resumen público seguro si corresponde.
5. Registrar evento interno.

Nunca discutir datos sensibles públicamente.

## Fuentes públicas

La página puede incluir registros de fuentes públicas externas, pero:

- No hay scraping automático en producción.
- No se publica automáticamente nada importado.
- Se conserva enlace a fuente original.
- Se omiten teléfonos/contactos personales.
- En menores de edad, usar información mínima.
- Si una fuente cambia o pide retiro, revisar y retirar.

## Advertencias éticas y legales

- Este proyecto organiza información ciudadana; no valida identidad por sí solo.
- La publicación de datos de personas desaparecidas puede generar riesgo.
- No publicar teléfonos privados, cédulas, direcciones exactas, datos médicos o datos de menores salvo mínima información necesaria y fuente verificable.
- Si hay peligro inmediato, llamar primero al 911 / VEN-911 o autoridades locales.
- Respetar solicitudes legítimas de corrección o retiro.
- Evitar rumores, cadenas de WhatsApp, capturas sin fuente y contenido no verificable.

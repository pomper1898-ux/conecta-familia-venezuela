# Revision Supabase RLS y privacidad

Fecha: 2026-06-26  
Archivos revisados: `schema.sql`, `supabase/migrations/safe_incremental_migration.sql`, `script.js`, `config.js`.

## Hallazgos

### Correcto

- El frontend usa `supabaseAnonKey`; no se encontro `service_role` en el cliente.
- `reports` guarda telefonos como campo privado y la vista publica usa `public_*`.
- `correction_requests` guarda contacto como `requester_contact_private`.
- La migracion incremental activa RLS en tablas sensibles.
- Las vistas publicas nuevas evitan reportantes, telefonos privados, `admin_notes` y `private_notes`.
- Inserts anonimos principales exigen consentimiento/buena fe y estados de revision.

### Riesgo medio

- `schema.sql` historico usa `DROP POLICY`, `DROP TRIGGER` y reemplazo de constraint; para produccion es preferible correr `supabase/migrations/safe_incremental_migration.sql`.
- `public_aid_centers` expone `telefono_publico`; esto solo debe usarse para telefonos institucionales publicados por la fuente.
- `support_centers` es una tabla anterior con `published=true` por defecto; para Fase 2 conviene usar `aid_centers` con `public_approved=false` por defecto.
- Las vistas publicas dependen de campos `public_*`. Si un admin copia un telefono, cedula, direccion exacta o dato medico dentro de `public_resumen`, la vista lo mostraria. Se recomienda bloqueo tecnico antes de publicar.
- `public_aid_centers` no debe exponer latitud/longitud o referencia exacta para refugios o puntos sensibles. Para esos casos conviene usar campos publicos curados o publicar solo ciudad/estado y fuente oficial.

### Pendiente antes de Fase 2

- Confirmar que la migracion segura corrio en Supabase.
- Probar insert anonimo en `aid_centers` con `public_approved=false`.
- Probar que `anon` solo lee `public_aid_centers`, no `aid_centers`.
- Agregar triggers `updated_at` para `aid_centers` y `external_sources` si se usa auditoria temporal.
- Revisar roles: `profiles.role` no debe conceder permisos por defecto a usuarios no autorizados. Separar `admin` de `reviewer` o agregar rol `pending`.
- Revisar policies existentes por comando/rol. Si una policy critica ya existe con roles amplios, `ALTER POLICY` por nombre puede no ser suficiente.

## Recomendaciones

- No correr `schema.sql` completo en produccion si ya existe la base.
- Usar la migracion incremental segura.
- Mantener `public_approved=false` en todo dato importado o enviado por usuario.
- Solo exponer vistas publicas, no tablas privadas.
- Revisar grants despues de cada migracion.
- Para publicar personas, agregar validacion en frontend y/o trigger SQL contra telefonos, cedulas, correos, direcciones exactas y datos medicos sensibles.
- Para centros, tratar `telefono_publico` como institucional y tratar ubicaciones de refugios como potencialmente sensibles.

## Checklist

- [x] RLS revisado.
- [x] No se encontro `service_role` en frontend.
- [x] Vistas publicas revisadas.
- [x] Riesgos documentados.

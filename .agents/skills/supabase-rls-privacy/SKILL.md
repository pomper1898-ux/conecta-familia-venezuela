---
name: supabase-rls-privacy
description: Revisa Supabase RLS, policies, vistas publicas seguras, exposure de datos sensibles, service_role en frontend, inserts anonimos con consentimiento y buena fe, y privacidad de tablas con reportantes.
---

# Supabase RLS Privacy

Usa esta skill para auditar o proponer cambios de base de datos en Supabase.

## Instrucciones

1. Revisa migraciones SQL, `schema.sql`, configuracion frontend y consultas Supabase.
2. Identifica tablas con datos privados: reportantes, telefonos, correcciones, tips, notas admin, importaciones, personas.
3. Confirma que RLS este activo en todas las tablas con datos no publicos.
4. Verifica que `anon` no pueda hacer `SELECT` directo sobre tablas privadas.
5. Verifica que inserts anonimos usen `WITH CHECK` para:
   - consentimiento.
   - declaracion de buena fe.
   - `pending_review` o `pendiente`.
   - `public_approved=false`.
   - `published=false` cuando aplique.
6. Revisa que vistas publicas no expongan:
   - Telefonos.
   - Cedulas.
   - Direcciones exactas sensibles.
   - Datos medicos sensibles.
   - Nombres de reportantes.
   - `admin_notes`.
   - `private_notes`.
7. Busca `service_role` o claves secretas en frontend, commits y documentacion.
8. Prefiere migraciones incrementales y no destructivas.

## Inputs Esperados

- SQL de schema o migracion.
- Archivos frontend con Supabase client.
- Lista de tablas/vistas.
- Reglas de privacidad del proyecto.

## Outputs Esperados

- Hallazgos por severidad.
- Lista de tablas con RLS activado/faltante.
- Lista de policies inseguras o faltantes.
- Lista de vistas publicas y campos expuestos.
- SQL seguro sugerido.
- Checklist de pruebas en Supabase.

## Limites Eticos

- No recomendar `service_role` en navegador.
- No abrir SELECT publico sobre tablas privadas.
- No crear vistas que filtren solo por frontend.
- No borrar datos existentes sin aprobacion explicita.
- No usar migraciones destructivas para resolver problemas de privacidad si existe alternativa incremental.

## Checklist Final

- [ ] RLS activo en tablas sensibles.
- [ ] `anon` sin SELECT directo en tablas privadas.
- [ ] Inserts anonimos protegidos con `WITH CHECK`.
- [ ] Vistas publicas sin datos sensibles.
- [ ] No hay `service_role` en frontend.
- [ ] Migracion idempotente o instrucciones claras.
- [ ] Riesgos residuales documentados.

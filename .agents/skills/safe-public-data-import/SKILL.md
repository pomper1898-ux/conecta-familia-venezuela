---
name: safe-public-data-import
description: Importa CSV/JSON de fuentes publicas de forma controlada. Previsualiza datos, detecta duplicados, detecta telefonos/cedulas/direcciones/datos sensibles, guarda source_url, import_batch_id, pending_review y public_approved=false.
---

# Safe Public Data Import

Usa esta skill para preparar importaciones manuales y revisables desde CSV/JSON.

## Instrucciones

1. Antes de importar, exige identificacion de fuente: `source_url`, `fuente_nombre`, fecha de consulta y nivel de confianza.
2. Previsualiza datos y muestra conteos: filas totales, filas validas, filas con errores, posibles duplicados y campos sensibles.
3. Detecta y marca posibles datos sensibles:
   - Telefonos personales.
   - Cedulas/documentos.
   - Correos privados.
   - Direcciones exactas no institucionales.
   - Datos medicos sensibles.
   - Nombres de reportantes.
   - `admin_notes`, `private_notes` o campos internos.
4. Detecta duplicados por nombre normalizado, edad, ciudad/sector, fuente y fecha.
5. Guarda todo importado como:
   - `pending_review` para personas/correcciones.
   - `pendiente` para centros/fuentes.
   - `public_approved = false`.
   - `published = false` cuando aplique.
6. Asocia cada fila con `import_batch_id`.
7. Permite rollback del lote en admin antes de publicacion.

## Inputs Esperados

- Archivo CSV o JSON.
- Tipo de importacion: `personas`, `centros`, `fuentes`.
- Mapeo de columnas.
- URL y nombre de la fuente.
- Nivel de confianza y fecha de consulta.

## Outputs Esperados

- Preview tabular.
- Reporte de validacion.
- Lista de campos sensibles detectados.
- Lista de posibles duplicados.
- Datos normalizados listos para guardar.
- Resultado de importacion con `import_batch_id`.
- Instrucciones de rollback.

## Limites Eticos

- No importar automaticamente desde web remota sin aprobacion.
- No publicar automaticamente.
- No conservar en campos publicos telefonos, cedulas, reportantes, datos medicos o direcciones exactas sensibles.
- No usar `service_role` en frontend.
- No evadir captchas, login, robots ni bloqueos.

## Checklist Final

- [ ] Fuente y fecha registradas.
- [ ] Preview mostrado antes de guardar.
- [ ] Duplicados detectados.
- [ ] Datos sensibles detectados y bloqueados para publicacion.
- [ ] `pending_review`/`pendiente` aplicado.
- [ ] `public_approved=false` aplicado.
- [ ] `import_batch_id` guardado.
- [ ] Rollback documentado.

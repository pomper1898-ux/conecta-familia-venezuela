---
name: hospital-admissions-safe-import
description: Importa, revisa y publica listados hospitalarios publicos de forma segura para Conecta Familia Venezuela. Detecta datos sensibles, duplicados, campos incompletos, agrupa por hospital y permite aprobacion individual o por lote solo de campos seguros.
---

# Hospital Admissions Safe Import

Usa esta skill para trabajar con personas localizadas o reportadas en hospitales, albergues medicos o listados hospitalarios publicos.

## Instrucciones

1. Trata todo listado hospitalario como sensible aunque sea publico.
2. Antes de publicar, separa campos seguros de campos privados.
3. Nunca publiques telefonos, cedulas, diagnosticos, historia clinica, direccion exacta, contactos familiares, reportantes ni notas privadas.
4. Guarda todo importado con `public_approved=false` por defecto.
5. Permite aprobacion en lote solo cuando la fuente sea publica/hospitalaria y se publiquen exclusivamente campos seguros.
6. Detecta duplicados por nombre normalizado, hospital, ciudad_estado y fecha de ingreso/publicacion.
7. Si hay posible duplicado, marca el registro y no fusiones automaticamente.
8. Mantiene trazabilidad: `source_url`, `source_name`, `import_batch_id`, `fecha_importacion`.
9. Permite rollback por `import_batch_id`.

## Inputs Esperados

- CSV, TSV o Excel convertido a CSV.
- URL publica de fuente o Drive.
- Nombre de hospital o columna hospitalaria.
- Fecha de publicacion/verificacion.
- Mapeo manual de columnas.

## Outputs Esperados

- Preview con filas validas, incompletas, sensibles y duplicadas.
- Registros normalizados listos para revision admin.
- Vista publica segura agrupada por hospital.
- Checklist de privacidad antes de aprobar.

## Campos Seguros

- `nombre_persona`
- `edad_aproximada`
- `hospital`
- `ciudad_estado`
- `fecha_ingreso`
- `fecha_publicacion`
- `estado_publico`
- `notas_publicas`
- `fuente_url`
- `fuente_nombre`

## Campos Prohibidos En Publico

- telefono
- cedula/documento
- diagnostico
- historia clinica
- direccion exacta
- contacto familiar
- nombre_reportante
- admin_notes/private_notes

## Checklist Final

- [ ] RLS activo en tablas privadas.
- [ ] Vista publica sin campos sensibles.
- [ ] Importados quedan `public_approved=false`.
- [ ] Aprobacion por lote solo campos seguros.
- [ ] Duplicados marcados, no fusionados.
- [ ] Rollback por `import_batch_id`.
- [ ] Botones de correccion/retiro disponibles.

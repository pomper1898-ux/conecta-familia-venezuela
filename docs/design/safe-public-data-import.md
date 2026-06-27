# Diseno del importador CSV/JSON seguro

Objetivo: permitir importacion manual y revisable sin publicar automaticamente datos de personas, centros o fuentes.

## Flujo recomendado

1. Admin autenticado entra a `/admin/importar` o modulo equivalente dentro de `/admin`.
2. Selecciona tipo: `personas`, `centros`, `fuentes`.
3. Registra fuente antes de cargar:
   - `source_url`
   - `fuente_nombre`
   - `fecha_consulta`
   - `nivel_confianza`
4. Carga CSV/JSON o pega contenido.
5. El sistema muestra preview sin guardar.
6. El sistema detecta:
   - errores de columnas obligatorias.
   - posibles duplicados.
   - teléfonos.
   - cédulas/documentos.
   - correos privados.
   - direcciones exactas sensibles.
   - datos médicos sensibles.
   - nombres de reportantes.
   - `admin_notes` / `private_notes`.
7. Admin confirma importacion.
8. Se crea `import_batch_id`.
9. Cada fila se guarda como privada/en revisión:
   - personas: `pending_review`, `published=false`.
   - centros/fuentes: `pendiente`, `public_approved=false`.
10. Admin puede revisar lote, aprobar fila por fila o hacer rollback.

## Reglas de bloqueo

- Bloquear importacion si falta `source_url` para fuentes externas.
- Bloquear publicación si hay campos sensibles en resumen público.
- No guardar `service_role` ni secretos en frontend.
- No hacer fetch remoto automatico desde webs con captcha, login o bloqueo.
- Si el CSV contiene columnas como `nombre_reportante`, `whatsapp_reportante`, `telefono`, `contacto`, `admin_notes` o `private_notes`, marcarlas como sensibles y excluirlas de cualquier campo público.
- Si hay registros publicados dentro de un lote, el rollback debe ocultar primero lo publicado o limitarse a filas pendientes.

## Deteccion de duplicados

Personas:

- nombre normalizado.
- edad aproximada.
- ciudad/sector.
- fecha de reporte.
- fuente_url/source_id.

Centros:

- nombre normalizado.
- ciudad.
- tipo.
- latitud/longitud si existen.
- fuente_url.

Fuentes:

- URL normalizada.
- nombre_fuente.
- país/estado_region.

## Salida esperada de preview

- Total filas.
- Filas validas.
- Filas con errores.
- Posibles duplicados.
- Campos sensibles detectados.
- Accion sugerida: importar, corregir, descartar.

## Checklist

- [ ] Preview antes de guardar.
- [ ] Fuente y fecha registradas.
- [ ] Duplicados detectados.
- [ ] Sensibles detectados.
- [ ] `pending_review` / `pendiente` aplicado.
- [ ] `public_approved=false` aplicado.
- [ ] `import_batch_id` creado.
- [ ] Rollback disponible.

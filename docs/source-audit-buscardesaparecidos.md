# Auditoría de fuente: buscardesaparecidos.com

Fecha de revisión: 26 de junio de 2026  
Objetivo: evaluar si la plataforma sirve como referencia funcional para Conecta Familia Venezuela sin copiar datos sensibles ni automatizar scraping.

## Alcance revisado

- Se revisó la página pública inicial de `https://buscardesaparecidos.com/`.
- No se ejecutó scraping masivo.
- No se importaron personas desde la fuente.
- No se copiaron teléfonos, correos, nombres de reportantes ni datos privados al proyecto.

## Hallazgos funcionales

- La página funciona como directorio público con búsqueda/reporte de personas y estados.
- Expone rutas útiles de referencia: búsqueda pública, reporte, caso individual, reporte de hallazgo, reporte de contenido y centros.
- Mantiene flujo de administración separado para aprobar, rechazar, activar, desactivar y marcar casos como localizados.
- Muestra métricas públicas de reportados, desaparecidos y localizados.
- Usa fuentes externas declaradas para algunos registros.

## Riesgos detectados

- La carga inicial del sitio incluye datos estructurados embebidos en el HTML.
- Dentro de esos datos se observan campos que no deben exponerse en Conecta Familia Venezuela: teléfonos, correos, nombres de reportantes, relación con la persona, datos de revisión e identificadores internos.
- Aunque esos campos estén técnicamente accesibles en la página pública de origen, no deben copiarse ni republicarse.
- La existencia de muchos registros no implica permiso para importar masivamente ni publicar sin revisión humana.

## Decisiones para Conecta Familia Venezuela

- No usar scraping automático.
- No publicar automáticamente datos importados.
- Todo CSV o carga manual queda como `pending_review`, `private` y `published = false`.
- La vista pública solo puede mostrar campos seguros aprobados: nombre público, zona general, edad aproximada, resumen seguro, estado, foto/fuente pública revisada.
- No mostrar teléfonos, cédulas, direcciones exactas, datos médicos sensibles, nombres de reportantes ni notas administrativas.
- Mantener fuente original visible cuando exista URL verificable.
- Permitir corrección/retiro con revisión humana.

## Recomendación

La referencia es útil por su flujo: buscar, reportar, filtrar, marcar localizado, revisar contenido y administrar casos. No debe replicarse su exposición de datos privados. Conecta Familia Venezuela debe priorizar privacidad, trazabilidad, consentimiento, fuente original y revisión humana antes de publicar.

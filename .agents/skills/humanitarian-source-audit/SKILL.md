---
name: humanitarian-source-audit
description: Audita fuentes publicas humanitarias, paginas de desaparecidos, hospitales, ONGs, medios, Cruz Roja, CICR y autoridades. Revisa robots.txt, privacidad, terminos, APIs/CSV/JSON, nivel de confianza, riesgos de datos personales y recomienda importar, enlazar o pedir permiso.
---

# Humanitarian Source Audit

Usa esta skill cuando se necesite evaluar una fuente publica antes de usarla en Conecta Familia Venezuela.

## Instrucciones

1. Identifica la fuente: nombre, URL, pais, tipo de institucion y proposito declarado.
2. Revisa si existe `robots.txt`, terminos, politica de privacidad, API, CSV, JSON, sitemap o descarga oficial.
3. Evalua si la fuente es oficial, humanitaria, ciudadana, medio verificado, agregador o no verificada.
4. Detecta si la pagina expone datos personales: telefonos, cedulas, correos, nombres de reportantes, direcciones exactas, datos medicos, menores, `admin_notes` o identificadores internos.
5. Determina el uso recomendado:
   - `enlazar`: mostrar solo enlace y descripcion.
   - `importar_manual`: permitir CSV/JSON con revision humana.
   - `pedir_permiso`: contactar a la fuente antes de usar datos.
   - `no_usar`: riesgo alto o fuente no confiable.
6. Nunca ejecutes scraping masivo. Si una pagina bloquea acceso, captcha o login, no evadas la restriccion.
7. Registra fecha de verificacion y limitaciones de la auditoria.

## Inputs Esperados

- URL de la fuente.
- Pais o zona de interes.
- Tipo de datos buscados: personas, centros, hospitales, refugios, ayuda humanitaria, fuentes oficiales.
- Contexto de uso previsto: enlazar, importar manualmente, comparar, derivar usuarios.

## Outputs Esperados

- Resumen de la fuente.
- Nivel de confianza: `oficial`, `alta`, `media`, `baja`, `no_confirmada`.
- Riesgos de privacidad.
- Senales tecnicas encontradas: robots, terminos, API, CSV, JSON, sitemap.
- Recomendacion: `enlazar`, `importar_manual`, `pedir_permiso` o `no_usar`.
- Campos permitidos y campos prohibidos.
- Nota de trazabilidad con fecha de verificacion.

## Limites Eticos

- No copiar telefonos personales, cedulas, correos privados, nombres de reportantes, direcciones exactas ni datos medicos sensibles.
- No publicar datos de menores salvo informacion minima, fuente verificable y revision humana.
- No asumir consentimiento porque una pagina sea visible publicamente.
- No hacer scraping masivo ni automatizar extraccion sin permiso claro.
- No evadir autenticacion, captchas, bloqueos o limites.

## Checklist Final

- [ ] Fuente identificada y clasificada.
- [ ] Robots/terminos/privacidad revisados cuando esten disponibles.
- [ ] Datos sensibles detectados y excluidos.
- [ ] Nivel de confianza asignado.
- [ ] Recomendacion clara emitida.
- [ ] Fecha de verificacion incluida.
- [ ] No se importo ni publico nada automaticamente.

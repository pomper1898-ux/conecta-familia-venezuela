# Auditoria humanitaria de fuentes publicas

Fecha de verificacion: 2026-06-26  
Proyecto: Conecta Familia Venezuela

## buscardesaparecidos.com

Uso recomendado: `enlazar` / `pedir_permiso` antes de cualquier importacion de personas.

Hallazgos:

- La pagina publica funciona como directorio de busqueda y reporte.
- El HTML inicial incluye datos estructurados de personas y rutas de administracion/aplicacion.
- En una revision manual previa se observaron campos sensibles embebidos en datos de pagina: telefonos, nombres de reportantes, correos y detalles internos.
- Aunque una pagina sea publica, eso no equivale a consentimiento para copiar, republicar o importar masivamente datos personales.

Riesgos:

- Alto riesgo de exponer telefonos, nombres de reportantes o informacion sensible si se copia la data sin filtrado.
- Riesgo reputacional y legal por duplicar registros de personas sin permiso.
- Riesgo de datos desactualizados si se importa sin sincronizacion responsable.

Recomendacion:

- No hacer scraping masivo.
- No importar personas automaticamente.
- Enlazar como fuente externa si aporta valor.
- Pedir permiso o convenio antes de importar registros.
- Si se recibe CSV autorizado, usar `safe-public-data-import` y dejar todo `pending_review` / `public_approved=false`.

## Fuentes oficiales/humanitarias sugeridas para enlazar o auditar

| Fuente | URL | Tipo | Nivel | Uso recomendado |
|---|---|---|---|---|
| IFRC - Cruz Roja Venezolana | https://www.ifrc.org/national-societies-directory/venezuelan-red-cross | Cruz Roja | oficial | enlazar |
| CICR - Reconnecting Families | https://www.icrc.org/en/what-we-do/reconnecting-families | CICR | oficial | enlazar |
| UNICEF Venezuela | https://www.unicef.org/venezuela/ | ONU/humanitaria | oficial | enlazar |
| R4V | https://www.r4v.info/ | coordinacion humanitaria | alta | enlazar |
| ACNUR Colombia Help | https://help.unhcr.org/colombia/ | ONU/proteccion | oficial | enlazar |

## Campos prohibidos para vistas publicas

- Telefonos personales.
- Cedulas/documentos.
- Correos privados.
- Direcciones exactas no institucionales.
- Datos medicos sensibles.
- Nombres de reportantes.
- `admin_notes` y `private_notes`.

## Checklist

- [x] Fuente identificada.
- [x] Riesgos de datos personales documentados.
- [x] Recomendacion de uso emitida.
- [x] No se importo ni publico nada automaticamente.

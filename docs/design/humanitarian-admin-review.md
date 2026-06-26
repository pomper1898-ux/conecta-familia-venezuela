# Propuesta de mejora del panel admin

Objetivo: convertir el admin en una bandeja de revision humanitaria con colas claras, trazabilidad y proteccion de datos.

## Colas recomendadas

- Personas/reportes.
- Centros pendientes.
- Fuentes pendientes.
- Correcciones/retiro.
- Duplicados.
- Importaciones.

## Acciones por item

- Aprobar publicacion.
- Rechazar.
- Retirar publicacion.
- Cambiar estado.
- Marcar duplicado.
- Marcar desactualizado/cerrado/localizado.
- Contactar por WhatsApp solo desde admin autenticado.
- Exportar CSV.
- Rollback de `import_batch_id`.

## Validaciones antes de aprobar

Personas:

- Resumen publico obligatorio.
- Bloquear si contiene telefonos, cedulas, correos, reportantes, direcciones exactas o datos medicos sensibles.
- Fuente original visible si existe.
- Nivel de confianza asignado.

Centros:

- Fuente URL obligatoria salvo punto comunitario propio.
- Fecha de verificacion obligatoria para `verificado`.
- Telefono publico solo si es institucional.
- Coordenadas solo si verificadas.

Fuentes:

- URL obligatoria.
- Tipo y nivel de confianza obligatorios.
- Estado `activa` solo tras revision.

## Riesgos operativos

- Admin actual mezcla correcciones y reportes en una sola pagina; conviene separar visualmente por colas.
- Importador CSV actual es basico: no detecta sensibles ni duplicados.
- No hay rollback visible de importaciones.
- No hay historial completo de eventos para todas las acciones.
- No hay bloqueo automatico de publicacion si el resumen publico contiene telefono, cedula, correo, direccion exacta, reportante o dato medico.
- No existe cola formal de importaciones con `import_batch_id`, filas importadas, filas pendientes, alertas sensibles y rollback.

## Prioridad de implementacion

1. Agregar `import_batch_id`, metadatos de fuente y preview con validacion sensible.
2. Bloquear publicacion de resumenes inseguros.
3. Crear cola de importaciones con rollback seguro.
4. Separar colas de admin por reportes, centros, fuentes, correcciones y duplicados.
5. Agregar historial de eventos para acciones administrativas.

## Checklist de pruebas

- [ ] Login admin requerido.
- [ ] Admin ve solicitudes privadas.
- [ ] Visitante no ve datos privados.
- [ ] Publicacion exige resumen seguro.
- [ ] CSV queda en revision.
- [ ] Duplicado no borra registro.
- [ ] Retiro oculta publicacion sin borrar datos.
- [ ] Export CSV no incluye campos publicos por error.

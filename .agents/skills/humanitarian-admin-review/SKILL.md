---
name: humanitarian-admin-review
description: Mejora y audita el panel admin para revisar reportes, fuentes, centros, personas, correcciones, solicitudes de retiro, duplicados, cambios de estado, rollback de importaciones y contacto por WhatsApp.
---

# Humanitarian Admin Review

Usa esta skill para disenar, revisar o mejorar el panel administrativo de Conecta Familia Venezuela.

## Instrucciones

1. Mantener claro que el admin es una bandeja privada de revision, no una publicacion automatica.
2. Separar colas de trabajo:
   - Personas/reportes.
   - Centros.
   - Fuentes.
   - Correcciones/retiro.
   - Duplicados.
   - Importaciones.
3. Para cada item, mostrar datos suficientes para revisar, pero marcar campos privados.
4. Permitir acciones admin:
   - aprobar publicacion.
   - rechazar.
   - retirar publicacion.
   - cambiar estado.
   - marcar duplicado.
   - marcar desactualizado/cerrado/localizado.
   - contactar por WhatsApp cuando exista contacto privado y el admin este autenticado.
   - exportar CSV.
   - rollback de import batch.
5. Exigir resumen publico seguro antes de publicar personas.
6. Mostrar advertencias cuando el resumen contenga telefonos, cedulas, direcciones exactas, datos medicos o nombres de reportantes.
7. Registrar trazabilidad: quien reviso, cuando, fuente, import_batch_id y notas privadas.

## Inputs Esperados

- Estado actual del panel admin.
- Modelo de datos y policies RLS.
- Flujo de revision requerido.
- Lista de estados y acciones permitidas.

## Outputs Esperados

- Propuesta de UX admin.
- Reglas de visibilidad y permisos.
- Acciones por tipo de item.
- Validaciones antes de aprobar.
- Checklist de pruebas manuales.
- Riesgos operativos.

## Limites Eticos

- No mostrar datos privados a visitantes.
- No publicar sin revision humana.
- No permitir que un usuario anonimo cambie estados.
- No contactar por WhatsApp desde vistas publicas con telefonos privados.
- No borrar reportes; preferir ocultar, retirar publicacion o marcar estado.

## Checklist Final

- [ ] Admin requiere autenticacion.
- [ ] Colas separadas y estados claros.
- [ ] Publicacion requiere resumen seguro.
- [ ] Datos privados no aparecen en vistas publicas.
- [ ] Duplicados y retiros tienen flujo claro.
- [ ] Importaciones pueden auditarse y revertirse.
- [ ] Acciones peligrosas piden confirmacion.
- [ ] Pruebas de RLS y consola completadas.

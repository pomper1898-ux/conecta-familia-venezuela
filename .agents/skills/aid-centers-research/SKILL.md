---
name: aid-centers-research
description: Busca y estructura centros de acopio, refugios, hospitales, puntos medicos, puntos de donacion y ayuda para Venezuela y la diaspora. Entrega CSV con fuente_url, fecha_verificacion, nivel_confianza y estado_verificacion. No inventa coordenadas ni publica sin fuente.
---

# Aid Centers Research

Usa esta skill para investigar centros de ayuda con menor riesgo legal que los registros de personas.

## Instrucciones

1. Busca fuentes oficiales o verificables antes que redes sociales o cadenas.
2. Prioriza autoridades locales, Cruz Roja, CICR, ONGs reconocidas, hospitales, iglesias, universidades, alcaldias, gobernaciones y organizaciones comunitarias verificables.
3. Estructura cada centro con campos compatibles con Conecta Familia Venezuela.
4. No inventes coordenadas. Usa latitud/longitud solo si aparece en fuente confiable o si se deriva de una direccion publica verificada con una herramienta de mapas y queda marcado como aproximado.
5. Distingue entre direccion general y direccion exacta. Para lugares publicos de atencion/acopio puede usarse direccion publicada por la institucion; para domicilios o lugares sensibles, no.
6. Todo resultado debe quedar como `pendiente` o `verificado` segun evidencia, nunca publicado automaticamente.

## Inputs Esperados

- Pais, ciudad o region.
- Tipo de centro requerido: `centro_acopio`, `refugio`, `hospital`, `punto_medico`, `alimento`, `agua`, `medicamentos`, `ong`, `iglesia`, `informacion`.
- Idioma y periodo de verificacion.
- Criterios de prioridad: cercania, oficialidad, capacidad, tipo de ayuda.

## Outputs Esperados

CSV o tabla con columnas:

```csv
nombre,tipo,pais,estado_region,ciudad,direccion_general,referencia,latitud,longitud,horario,telefono_publico,que_recibe,que_ofrece,fuente_url,fuente_nombre,fecha_verificacion,verificado_por,nivel_confianza,estado_verificacion,notas
```

Tambien debe incluir:

- Fuentes consultadas.
- Centros descartados y razon.
- Advertencias de privacidad o seguridad.
- Recomendacion de publicacion: `pendiente`, `verificado`, `desactualizado`, `cerrado`.

## Limites Eticos

- No publicar centros sin fuente verificable.
- No inventar coordenadas, telefonos ni horarios.
- No usar telefonos personales salvo que sean publicos institucionales y esten publicados por la entidad.
- No divulgar ubicaciones sensibles si pueden poner personas en riesgo.
- No confundir un grupo de WhatsApp con una entidad oficial.

## Checklist Final

- [ ] Cada centro tiene `fuente_url` o razon de descarte.
- [ ] Fecha de verificacion incluida.
- [ ] Nivel de confianza asignado.
- [ ] Coordenadas ausentes si no son verificables.
- [ ] Estado de verificacion incluido.
- [ ] No se publico nada automaticamente.

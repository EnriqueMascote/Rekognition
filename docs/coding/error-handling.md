---
title: Manejo de errores
status: draft
owner: coding
classification: internal
mandatory: true
last_reviewed: 2026-05-22
tags: [coding]
---


# Manejo de errores

- No ocultar excepciones.
- No exponer stack traces al usuario.
- Todo error relevante debe tener código interno.
- Todo error crítico debe generar log estructurado.
- Los errores API deben seguir el modelo estándar.

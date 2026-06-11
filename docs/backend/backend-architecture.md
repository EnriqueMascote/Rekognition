---
title: Arquitectura backend
status: draft
owner: backend
classification: internal
mandatory: true
last_reviewed: 2026-05-22
tags: [backend]
---


# Arquitectura backend

## Reglas

- Validar toda entrada externa.
- Centralizar autorización.
- Separar controladores, servicios y datos.
- Usar transacciones en operaciones críticas.
- No confiar en datos del cliente.
- No construir queries concatenando strings.

---
title: Estándar OpenAPI
status: draft
owner: api
classification: internal
mandatory: true
last_reviewed: 2026-05-22
tags: [api]
---


# Estándar OpenAPI

## Baseline

- MUST: OpenAPI 3.1.x.
- SHOULD: OpenAPI 3.2.x cuando el tooling lo soporte.

## Reglas

- Toda API debe tener `openapi.yaml` o `openapi.json`.
- Todo endpoint debe documentar request, response, errores y seguridad.
- Todo cambio incompatible debe marcarse como breaking change.
- El contrato debe validarse en CI.

## Modelo estándar de error

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje entendible",
    "details": [],
    "traceId": "trace-id"
  }
}
```

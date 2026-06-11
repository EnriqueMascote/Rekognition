---
title: Contratos API
status: draft
owner: project-lead
classification: internal
mandatory: true
last_reviewed: 2026-05-22
tags: [documentation]
---


# Contratos API

## Baseline

Toda API HTTP debe documentarse en OpenAPI 3.1 o superior.

## Estructura

```txt
/api/v1
```

## Modelo de error

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

## Reglas

- Documentar request.
- Documentar response.
- Documentar códigos HTTP.
- Documentar seguridad.
- Incluir ejemplos.

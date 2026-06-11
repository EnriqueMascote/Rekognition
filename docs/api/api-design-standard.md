---
title: Diseño de APIs
status: draft
owner: api
classification: internal
mandatory: true
last_reviewed: 2026-05-22
tags: [api]
---


# Diseño de APIs

## Convenciones REST

```txt
GET    /api/v1/resources
POST   /api/v1/resources
GET    /api/v1/resources/{id}
PATCH  /api/v1/resources/{id}
DELETE /api/v1/resources/{id}
```

## Reglas

- Usar sustantivos, no verbos.
- Usar versionado explícito.
- Usar códigos HTTP correctos.
- No exponer detalles internos.
- Documentar paginación y filtros.

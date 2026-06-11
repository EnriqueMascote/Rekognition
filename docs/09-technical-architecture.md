---
title: Arquitectura técnica
status: draft
owner: project-lead
classification: internal
mandatory: true
last_reviewed: 2026-05-22
tags: [documentation]
---


# Arquitectura técnica

## Diagrama general

```mermaid
flowchart TD
    User[Usuario] --> App[Aplicación]
    App --> API[API]
    API --> DB[(Base de datos)]
```

## Componentes

| Componente | Responsabilidad | Tecnología |
|---|---|---|
| Frontend | UI | Pendiente |
| Backend | API y negocio | Pendiente |
| DB | Persistencia | Pendiente |

## Patrones

- Separación de responsabilidades.
- Validación en frontera.
- Autorización centralizada.
- Logs estructurados.
- Configuración por entorno.

## Decisiones relevantes

Ver `docs/adr/`.

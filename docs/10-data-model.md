---
title: Modelo de datos
status: draft
owner: project-lead
classification: internal
mandatory: true
last_reviewed: 2026-05-22
tags: [documentation]
---


# Modelo de datos

## Entidades principales

| Entidad | Descripción |
|---|---|
| Pendiente | Pendiente |

## Convenciones

- Tablas en plural.
- Campos en `snake_case`.
- Llaves primarias explícitas.
- Migraciones versionadas.
- Datos sensibles clasificados.

## Diagrama ER

```mermaid
erDiagram
    USERS ||--o{ ROLES : has
```

---
title: Política de Release
status: draft
owner: release
classification: internal
mandatory: true
last_reviewed: 2026-05-22
tags: [release]
---


# Política de Release

## Principios

- Todo release debe ser trazable.
- Todo release debe tener versión.
- Todo release debe tener changelog.
- Todo release debe tener evidencia de pruebas.
- Todo release debe tener plan de rollback.
- Producción requiere aprobación.

## Versionado

Semantic Versioning:

```txt
MAJOR.MINOR.PATCH
```

| Tipo | Cuándo incrementar |
|---|---|
| MAJOR | Cambios incompatibles |
| MINOR | Funcionalidad compatible |
| PATCH | Correcciones compatibles |

## Estados

```txt
planned
in-development
code-freeze
qa-validation
security-review
staging-approved
production-approved
released
rolled-back
deprecated
```

## Hotfix

Permitido para incidentes productivos, vulnerabilidades críticas o fallas bloqueantes.

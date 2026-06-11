---
title: Estándar CI/CD
status: draft
owner: devsecops
classification: internal
mandatory: true
last_reviewed: 2026-05-22
tags: [devsecops]
---


# Estándar CI/CD

## Principios

- Todo cambio pasa por pipeline.
- Ningún artefacto productivo se construye manualmente.
- Secretos fuera del repo.
- Evidencia por pipeline.
- Producción requiere aprobación.

## Pull Request pipeline

```txt
checkout
install dependencies
lint
format check
unit tests
integration tests
OpenAPI validation
secret scanning
SAST
SCA
build
docs check
evidence collection
```

## Release pipeline

```txt
full test suite
security scans
generate SBOM
build artifact
publish artifact
deploy staging
smoke tests
approval
deploy production
post-deploy validation
```

---
title: Quality Gates
status: draft
owner: quality
classification: internal
mandatory: true
last_reviewed: 2026-05-22
tags: [quality]
---


# Quality Gates

## Pull Request

| Control | Obligatorio | Evidencia |
|---|---:|---|
| Build exitoso | Sí | Pipeline |
| Linter | Sí | Pipeline |
| Formatter | Sí | Pipeline |
| Unit tests | Sí | Reporte |
| Integration tests | Si aplica | Reporte |
| Secret scanning | Sí | Reporte |
| SAST sin críticos | Sí | Reporte |
| SCA sin críticos explotables | Sí | Reporte |
| OpenAPI válido | Si hay API | Reporte |
| Accesibilidad | Si hay UI | Reporte |
| Revisión humana | Sí | PR |

## Release

| Control | Obligatorio | Evidencia |
|---|---:|---|
| Changelog | Sí | CHANGELOG.md |
| SemVer | Sí | Tag |
| Regresión QA | Sí | Reporte QA |
| SBOM | Sí | Artefacto |
| Rollback | Sí | Plan |
| Aprobación | Sí | Checklist |

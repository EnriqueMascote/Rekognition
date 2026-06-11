---
title: Estrategia de Testing
status: draft
owner: testing
classification: internal
mandatory: true
last_reviewed: 2026-05-22
tags: [testing]
---


# Estrategia de Testing

## Propósito

Asegurar que el software cumple requisitos funcionales, no funcionales, seguridad, accesibilidad y calidad.

## Tipos de prueba

| Tipo | Propósito | Obligatorio | Evidencia |
|---|---|---:|---|
| Unitarias | Validar lógica aislada | Sí | Reporte test |
| Integración | Validar interacción | Sí | Reporte test |
| API Contract | Validar OpenAPI | Si hay API | Reporte OpenAPI |
| E2E | Validar flujos completos | Condicional | Reporte E2E |
| Regresión | Evitar rupturas | Sí antes de release | Reporte QA |
| Seguridad | Detectar riesgos | Sí | SAST/SCA/DAST |
| Accesibilidad | Validar WCAG 2.2 AA | Si hay UI | Reporte a11y |
| Performance | Validar carga | Condicional | Reporte carga |
| UAT | Aceptación del usuario | Institucional | Acta UAT |

## Datos de prueba

No usar datos reales salvo autorización formal y controles de protección.

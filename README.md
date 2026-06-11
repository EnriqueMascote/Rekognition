---
title: Secure Software Project Template
status: active
owner: project-lead
classification: public
mandatory: true
last_reviewed: 2026-05-22
tags: [template, secure-development, devsecops, isms]
---

# Secure Software Project Template

Plantilla institucional para proyectos de desarrollo de software seguro, documentados, auditables y compatibles con trabajo colaborativo entre humanos y agentes de IA.

## Propósito

Esta plantilla sirve como base para iniciar proyectos de software con:

- documentación viva en Markdown;
- estándares de desarrollo seguro;
- Git Flow;
- Scrum;
- DevOps y DevSecOps;
- accesibilidad WCAG 2.2 AA;
- APIs documentadas con OpenAPI 3.1 o superior;
- controles y evidencias para SGSI;
- trazabilidad de requisitos, pruebas, releases y decisiones;
- gobierno de agentes de IA;
- portal documental con MkDocs Material;
- compatibilidad con Obsidian.

## Uso rápido

1. Crear un nuevo repositorio desde esta plantilla.
2. Completar `docs/00-init.md`.
3. Completar `docs/01-vision.md`, `docs/02-scope.md` y `docs/03-project-context.md`.
4. Ajustar `docs/04-srs.md`.
5. Definir arquitectura en `docs/09-technical-architecture.md`.
6. Revisar `AGENTS.md`.
7. Levantar el portal documental con MkDocs.

## Documentación principal

- [Guía de la plantilla](docs/GUIDE.md)
- [Mapa de contenido](docs/MOC.md)
- [Context Map para IA](docs/agents/ai-context-map.md)
- [Quality Gates](docs/quality/quality-gates.md)
- [Política de Release](docs/release/release-policy.md)
- [Registro de Evidencias SGSI](docs/isms/evidence-register.md)

## Principios base

- Seguridad desde el diseño.
- Accesibilidad desde el diseño.
- FOSS primero, OSS después, propietario solo con justificación.
- Markdown portable.
- Automatización de validaciones.
- Evidencia por control.
- Revisión humana para cambios críticos.
- Documentación actualizada en el mismo PR del cambio.

## Estructura resumida

```txt
docs/           Documentación principal del proyecto
standards/      Estándares transversales
templates/      Plantillas reutilizables
prompts/        Prompts base para agentes de IA
.github/        Templates y workflows de GitHub
scripts/        Scripts de validación y mantenimiento
```

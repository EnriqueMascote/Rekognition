---
title: Contributing
status: active
owner: engineering
classification: public
mandatory: true
last_reviewed: 2026-05-22
tags: [contributing, git-flow, pull-requests]
---

# Guía de contribución

## Flujo de ramas

| Rama | Uso |
|---|---|
| `main` | Producción |
| `release` | Preproducción / estabilización |
| `develop` | Integración |
| `feature/*` | Nuevas funcionalidades |
| `fix/*` | Correcciones |
| `hotfix/*` | Correcciones urgentes |
| `docs/*` | Documentación |
| `security/*` | Correcciones de seguridad |

## Commits

Usar Conventional Commits:

```txt
feat: agregar módulo de usuarios
fix: corregir validación de login
docs: actualizar guía de despliegue
test: agregar pruebas unitarias
security: corregir control de autorización
```

## Pull Requests

Todo PR debe incluir:

- descripción del cambio;
- issue o tarea relacionada;
- impacto funcional;
- impacto técnico;
- impacto en seguridad;
- impacto en documentación;
- pruebas ejecutadas;
- evidencias generadas;
- riesgos conocidos.

## Revisión

No se debe aprobar un PR si:

- falla el pipeline;
- hay vulnerabilidades críticas;
- rompe contrato de API;
- reduce cobertura sin justificación;
- cambia comportamiento sin actualizar documentación;
- modifica permisos sin revisión de seguridad.

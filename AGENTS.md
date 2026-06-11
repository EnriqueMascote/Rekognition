---
title: Agent Instructions
status: active
owner: project-lead
classification: internal
mandatory: true
last_reviewed: 2026-05-22
tags: [agents, ai, governance]
---

# Instrucciones para agentes de IA

## Propósito

Este archivo define las reglas mínimas para cualquier agente de IA que lea, modifique, revise o genere contenido dentro del proyecto.

## Orden de lectura obligatorio

1. `README.md`
2. `AGENTS.md`
3. `docs/GUIDE.md`
4. `docs/agents/ai-context-map.md`
5. `docs/03-project-context.md`
6. `docs/02-scope.md`
7. `docs/04-srs.md`
8. `docs/09-technical-architecture.md`
9. `docs/12-security-model.md`
10. `docs/agents/context-memory.md`

## Reglas generales

- No modificar archivos fuera del alcance solicitado.
- No introducir dependencias nuevas sin justificación.
- No cambiar arquitectura sin ADR.
- No cambiar seguridad, permisos, autenticación o autorización sin revisión humana.
- No agregar secretos, tokens, API keys, contraseñas internas ni datos sensibles.
- No eliminar pruebas para hacer pasar pipelines.
- No alterar migraciones ya aplicadas.
- No cambiar contratos públicos sin actualizar documentación OpenAPI.
- No generar código sin considerar pruebas, seguridad, accesibilidad y mantenibilidad.

## Cuentas demo

Las cuentas descritas en `docs/security/demo-accounts.md` son públicas y solo aplican a entornos local, desarrollo o demo.

Prohibido crear o activar cuentas demo en producción.

## Cambios que requieren aprobación humana

- Arquitectura.
- Seguridad.
- Base de datos productiva.
- CI/CD.
- Permisos.
- Dependencias nuevas.
- Manejo de datos personales.
- Excepciones de seguridad.
- Release a producción.

## Registro de intervención

Cuando un agente haga una contribución relevante, debe actualizar:

- `docs/agents/agent-log.md`
- `docs/agents/agent-handoff.md` si queda trabajo pendiente.
- `docs/agents/context-memory.md` si el contexto debe preservarse.

## Entrega esperada del agente

Toda intervención debe dejar:

- resumen del cambio;
- archivos modificados;
- pruebas ejecutadas;
- riesgos detectados;
- documentación actualizada;
- pendientes.

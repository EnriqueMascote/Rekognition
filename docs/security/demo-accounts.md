---
title: Cuentas demo
status: draft
owner: security
classification: internal
mandatory: true
last_reviewed: 2026-05-22
tags: [security]
---


# Cuentas de demostración

## Propósito

Cuentas públicas para levantar y probar el proyecto en local o demo.

No aplican en producción.

## Cuentas disponibles

| Rol | Usuario | Contraseña | Propósito |
|---|---|---|---|
| Administrador demo | `admindemo` | `admin123!` | Validar administración |
| Usuario demo | `userdemo` | `user123!` | Validar flujo estándar |
| Operador demo | `operadordemo` | `operador123!` | Validar operación |

## Reglas

- No existen en producción.
- No acceden a datos reales.
- Se crean por seeders controlados.
- El seeder debe fallar en `NODE_ENV=production`.

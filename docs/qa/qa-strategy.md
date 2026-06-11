---
title: Estrategia QA
status: draft
owner: qa
classification: internal
mandatory: true
last_reviewed: 2026-05-22
tags: [qa]
---


# Estrategia de QA

## Propósito

Asegurar que el producto cumple requisitos, criterios de aceptación, estándares técnicos, seguridad, accesibilidad y expectativas de usuario.

## Ciclo

1. Revisión de requerimientos.
2. Revisión de criterios de aceptación.
3. Diseño de casos de prueba.
4. Validación en QA.
5. Registro de defectos.
6. Revalidación.
7. Aprobación QA.
8. Evidencia para release.

## Clasificación de defectos

| Severidad | Descripción | Puede salir a producción |
|---|---|---:|
| Crítica | Bloquea operación, pérdida de datos o riesgo grave | No |
| Alta | Funcionalidad crítica afectada | No salvo excepción |
| Media | Falla parcial con workaround | Condicional |
| Baja | Problema menor | Sí |

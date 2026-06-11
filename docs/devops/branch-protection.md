---
title: Branch Protection
status: draft
owner: devops
classification: internal
mandatory: true
last_reviewed: 2026-05-22
tags: [devops]
---


# Branch Protection

## main

- No push directo.
- PR obligatorio.
- Pipeline exitoso.
- Revisión requerida.
- CODEOWNERS requerido.
- Security gate exitoso.

## release

- PR obligatorio.
- QA requerido.
- Security checks requeridos.

## develop

- PR obligatorio.
- CI requerido.

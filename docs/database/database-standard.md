---
title: Estándar de base de datos
status: draft
owner: database
classification: internal
mandatory: true
last_reviewed: 2026-05-22
tags: [database]
---


# Estándar de base de datos

- Todo cambio estructural debe usar migración.
- No modificar migraciones ya aplicadas en entornos compartidos.
- Toda tabla debe tener llave primaria.
- Todo campo sensible debe clasificarse.
- Los seeders demo no deben ejecutarse en producción.

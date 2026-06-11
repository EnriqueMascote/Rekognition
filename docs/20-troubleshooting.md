---
title: Troubleshooting
status: draft
owner: project-lead
classification: internal
mandatory: true
last_reviewed: 2026-05-22
tags: [documentation]
---


# Troubleshooting

## Error: no conecta a base de datos

### Posibles causas

- Host incorrecto.
- Puerto cerrado.
- Credenciales erróneas.
- Servicio detenido.

### Diagnóstico

```bash
nc -vz DB_HOST DB_PORT
```

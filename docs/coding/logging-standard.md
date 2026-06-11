---
title: Logging
status: draft
owner: coding
classification: internal
mandatory: true
last_reviewed: 2026-05-22
tags: [coding]
---


# Estándar de logging

| Nivel | Uso |
|---|---|
| DEBUG | Diagnóstico local |
| INFO | Eventos normales relevantes |
| WARN | Anomalías recuperables |
| ERROR | Fallas que requieren atención |
| FATAL | Caída crítica |

## Prohibido registrar

- Contraseñas.
- Tokens.
- API keys.
- Secretos.
- Datos personales innecesarios.

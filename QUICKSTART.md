---
title: Quickstart
status: active
owner: project-lead
classification: public
mandatory: true
last_reviewed: 2026-05-22
tags: [quickstart, onboarding]
---

# Quickstart

## Requisitos

- Git.
- Python 3.11+ para MkDocs.
- Node.js LTS si el proyecto usa frontend/backend JS.
- Docker opcional.
- Editor compatible con Markdown.
- Obsidian opcional para navegación documental.

## Primeros pasos

```bash
git clone <repo>
cd <repo>
```

## Portal documental

Instalar dependencias:

```bash
pip install mkdocs mkdocs-material pymdown-extensions
```

Levantar portal local:

```bash
mkdocs serve
```

Abrir:

```txt
http://127.0.0.1:8000
```

## Validar documentación

```bash
python scripts/check_docs_metadata.py
python scripts/generate_docs_index.py
```

## Cuentas demo

Consultar:

```txt
docs/security/demo-accounts.md
```

Las cuentas demo no deben existir en producción.

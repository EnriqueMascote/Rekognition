---
title: Guía de Inicio Rápido
status: active
owner: Enrique Mascote
classification: public
mandatory: true
last_reviewed: 2026-06-11
tags: [quickstart, deployment, setup]
---

# Guía de Inicio Rápido - Rekognition

Esta guía detalla los pasos para levantar el entorno de desarrollo y probar la aplicación web de reconocimiento facial.

## Requisitos Previos

- **Node.js**: v18 o superior.
- **Python 3.10+** (para scripts opcionales de descarga y portal de documentación).
- **Cámara Web**: Para las pruebas de verificación en tiempo real.

## 1. Configuración de Dependencias

Instale los paquetes de Node.js necesarios en el proyecto:

```bash
npm install
```

## 2. Descarga de Modelos de Inteligencia Artificial

Los pesos del modelo de reconocimiento facial deben almacenarse en `public/models/`. Puede descargarlos ejecutando el script auxiliar de Python:

```bash
python scripts/download_models.py
```

Este script descargará:
- Detector de Rostros (SSD MobileNet V1)
- Extractor de 68 Landmarks Faciales
- Red de Reconocimiento y Generación de Embeddings

*Nota: La aplicación también implementa un fallback de CDN para descargar automáticamente los modelos si no se encuentran de forma local.*

## 3. Lanzar la Aplicación en Desarrollo

Inicie el servidor de desarrollo local de Vite:

```bash
npm run dev
```

La aplicación estará accesible en:
```txt
http://localhost:5173
```

## 4. Ejecución del Portal de Documentación

Si desea visualizar el portal de documentación estático interactivo mediante MkDocs:

```bash
# Instalar dependencias del portal
pip install mkdocs mkdocs-material

# Iniciar servidor de MkDocs
mkdocs serve
```

Acceda en su navegador a:
```txt
http://127.0.0.1:8000
```

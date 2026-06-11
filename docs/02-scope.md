---
title: Alcance
status: active
owner: Enrique Mascote
classification: internal
mandatory: true
last_reviewed: 2026-06-11
tags: [documentation, scope]
---

# Alcance del Proyecto: Rekognition

## Dentro del alcance

El proyecto comprende el desarrollo de una aplicación cliente-servidor autocontenida y de un informe de evaluación biométrica que incluye:

- **Infraestructura SPA**: Configuración de un cliente React con TypeScript y diseño de UI moderna en Dark Mode y con efectos de Glassmorphism.
- **Inferencia Facial de Cliente**: Descarga y ejecución local de modelos de deep learning de face-api.js.
- **Registro y Captura Activa**: Módulo de webcam para registrar un rostro de referencia y comprobar la distancia euclídea en vivo.
- **Evaluación por Lotes (Batch)**: Interfaz para subir múltiples archivos del usuario de referencia y suplantadores, clasificándolos interactivamente.
- **Métricas e Interactividad**: Tabulación de la matriz de confusión y visualización en tiempo real de curvas FAR y FRR y de la curva ROC.
- **Ajuste del Umbral de Decisión**: Control deslizante para ajustar el valor del umbral óptimo (0.0 a 1.0) y recalcular de inmediato todas las tasas.
- **Informe de Evaluación Técnico**: Documento Markdown con la justificación biométrica y el análisis de resistencia.

## Fuera del alcance

- **Sincronización en la Nube / Base de Datos**: Los embeddings y registros faciales no se guardarán en bases de datos externas como MongoDB o PostgreSQL.
- **Detección de Vitalidad por Hardware**: No se integrarán SDKs para hardware propietario de cámaras infrarrojas o de profundidad (como FaceID nativo).
- **Control de Acceso Físico**: No se conectará con hardware de relés o puertas de acceso físico.

## Alcance por fase

### Fase 1: MVP y Motor de Reconocimiento (Sprint 1)
- Estructura base del proyecto React y carga de los pesos locales del modelo.
- Módulo de registro por webcam y visualización interactiva de los 68 puntos de referencia faciales.
- Redacción inicial del informe de evaluación teórica.

### Fase 2: Módulo Estadístico y Visualización (Sprint 2)
- Módulo de carga interactiva de imágenes para evaluación en lotes.
- Motor matemático para calcular matriz de confusión, FAR, FRR, Precisión, Sensibilidad e histogramas de distancia.
- Gráficos interactivos de curvas ROC y sintonizador de umbrales.
- Funcionalidad de exportar el reporte finalizado de la evaluación.

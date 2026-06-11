---
title: Backlog
status: active
owner: Enrique Mascote
classification: internal
mandatory: true
last_reviewed: 2026-06-11
tags: [documentation, backlog]
---

# Backlog de Producto: Rekognition

## Épicas

| ID | Épica | Descripción | Prioridad | Estado |
|---|---|---|---|---|
| EP-001 | Core de Inferencia Facial | Configuración de la SPA React y del motor local de reconocimiento facial face-api.js. | Alta | En Progreso |
| EP-002 | Módulo de Evaluación y Métricas | Panel interactivo de carga por lotes, cálculo estadístico de biometría y sintonización de umbrales con gráficos. | Alta | Pendiente |
| EP-003 | Informe y Documentación | Redacción de la teoría algorítmica, resultados y actualización de políticas de plantilla. | Alta | En Progreso |

## Historias de usuario

| ID | Historia | Prioridad | Estado | Criterios de aceptación |
|---|---|---|---|---|
| US-001 | Como usuario, quiero ver el estado de carga de los modelos en la pantalla, para saber cuándo puedo empezar a usar la aplicación. | Alta | En Progreso | Barra de progreso visual que indique la descarga de cada modelo (SSD MobileNet, Landmarks, Recognition). |
| US-002 | Como usuario, quiero registrar mi rostro desde la webcam o un archivo, para establecerlo como identidad autorizada. | Alta | En Progreso | Capturar descriptor facial (128 floats) y mostrar overlay de 68 puntos faciales en tiempo real. |
| US-003 | Como usuario, quiero subir carpetas de imágenes del usuario y de suplantación, para evaluar la precisión del algoritmo de forma automatizada. | Alta | Pendiente | Cargar 30+ imágenes por categoría, procesar en lote y calcular matriz de confusión, FAR y FRR. |
| US-004 | Como usuario, quiero ajustar el umbral de aceptación facial y ver cómo cambian los gráficos, para encontrar el umbral óptimo. | Alta | Pendiente | Slider de 0.0 a 1.0 que actualice dinámicamente las curvas ROC y FAR/FRR vs Threshold. |
| US-005 | Como usuario, quiero exportar un reporte en Markdown con los resultados del lote, para incorporarlo a mi informe académico. | Media | Pendiente | Botón de descarga de archivo Markdown estructurado con los resultados numéricos obtenidos. |

## Tareas técnicas

| ID | Tarea | Módulo | Prioridad | Estado |
|---|---|---|---|---|
| TASK-001 | Inicialización de Vite y React/TS | Setup | Alta | En Progreso |
| TASK-002 | Descarga y precarga local de pesos del modelo | ML-Models | Alta | En Progreso |
| TASK-003 | Implementación de LiveVerification con webcam | Frontend | Alta | Pendiente |
| TASK-004 | Implementación de motor matemático de matriz de confusión | Core-Engine | Alta | Pendiente |
| TASK-005 | Integración de gráficos interactivos con Recharts | Frontend | Alta | Pendiente |
| TASK-006 | Redacción de informe técnico de 30 pág. en español | Docs | Alta | En Progreso |

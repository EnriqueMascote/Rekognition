---
title: SRS
status: active
owner: Enrique Mascote
classification: internal
mandatory: true
last_reviewed: 2026-06-11
tags: [documentation, requirements]
---

# Software Requirements Specification (SRS): Rekognition

## 1. Introducción

### 1.1 Propósito

Este documento especifica los requisitos funcionales y no funcionales de la plataforma de evaluación biométrica Rekognition. Está dirigido a evaluadores, desarrolladores y revisores del sistema de identificación.

### 1.2 Alcance

El sistema consiste en una aplicación SPA interactiva en React que implementa inferencia de redes neuronales convolucionales del lado del cliente para realizar verificación biométrica facial y análisis estadístico por lotes de la precisión del modelo frente a spoofing.

### 1.3 Definiciones

- **Embedding Facial**: Un vector descriptor de 128 números flotantes que representa las características únicas de un rostro humano.
- **Landmarks Faciales**: 68 puntos clave sobre la cara (ojos, cejas, nariz, boca, contorno) utilizados para alinear y normalizar la pose de un rostro.
- **FAR (False Acceptance Rate)**: Tasa de Falsa Aceptación. Probabilidad de que el sistema identifique incorrectamente a un suplantador como el usuario registrado.
- **FRR (False Rejection Rate)**: Tasa de Falso Rechazo. Probabilidad de que el sistema rechace incorrectamente al usuario registrado legítimo.
- **ROC (Receiver Operating Characteristic)**: Gráfico que muestra el rendimiento de un modelo de clasificación en todos los umbrales de decisión.

---

## 2. Descripción general

### 2.1 Perspectiva del producto

La aplicación web opera en modo autocontenido en el navegador web del cliente. No requiere servicios backend adicionales para el análisis de imagen ni el almacenamiento de datos, priorizando la privacidad biométrica y simplificando la instalación local.

### 2.2 Usuarios

El usuario principal es el estudiante o auditor técnico de seguridad que interactúa con la aplicación para cargar su dataset y obtener los gráficos de calibración.

### 2.3 Supuestos y dependencias

- Se asume que el usuario otorgará permisos de acceso a la cámara.
- La ejecución local depende de que el navegador soporte la aceleración WebGL para un rendimiento fluido de TensorFlow.js.

---

## 3. Requerimientos específicos

### 3.1 Requerimientos funcionales

| ID | Requerimiento | Prioridad | Criterio de aceptación |
|---|---|---|---|
| RF-001 | Carga de Modelos ML | Alta | La SPA descarga e inicializa los modelos SSD MobileNet, 68 Landmarks y Face Recognition, mostrando el estado de carga en la UI. |
| RF-002 | Captura y Registro | Alta | Permite capturar un rostro de referencia por webcam o archivo, extrayendo y guardando en memoria su embedding descriptor facial. |
| RF-003 | Verificación en Vivo | Alta | Compara fotogramas de la webcam en vivo contra el rostro registrado, mostrando el porcentaje de similitud basado en la distancia euclídea. |
| RF-004 | Overlay de Landmarks | Media | Dibuja una malla overlay sobre el rostro detectado conectando de forma precisa los 68 puntos de landmarks en vivo. |
| RF-005 | Carga por Lotes | Alta | Permite subir conjuntos de imágenes para dos clases: "Usuario Autorizado" (30+ fotos) y "Suplantación/Otros" (30+ fotos). |
| RF-006 | Cálculo Estadístico | Alta | Genera la matriz de confusión e índices de exactitud (FAR, FRR, Precisión, Sensibilidad, F1) a partir de los resultados del lote. |
| RF-007 | Sintonización de Umbral | Alta | Un slider interactivo permite modificar el umbral (0.0 a 1.0) recalculando inmediatamente la matriz de confusión y actualizando las gráficas. |
| RF-008 | Gráficas de Rendimiento | Media | Renderiza un gráfico FAR vs FRR y la curva ROC interactiva según las respuestas del lote. |
| RF-009 | Exportación de Reportes | Media | Permite descargar un reporte en formato Markdown con las métricas obtenidas. |

### 3.2 Requerimientos no funcionales

| ID | Categoría | Requerimiento | Métrica |
|---|---|---|---|
| RNF-001 | Seguridad (Privacidad) | Procesamiento local absoluto | Ninguna foto o descriptor facial se transmite fuera del navegador. |
| RNF-002 | Desempeño | Tiempo de respuesta | El procesamiento de un frame facial de la webcam tarda menos de 150ms. |
| RNF-003 | Accesibilidad | Cumplimiento WCAG | Contraste de colores adecuado y uso de etiquetas HTML semánticas. |
| RNF-004 | Usabilidad | Diseño Responsivo | Layout tipo Dashboard adaptado a resoluciones de laptop y monitor de escritorio. |

### 3.3 Reglas de negocio

| ID | Regla | Descripción |
|---|---|---|
| RB-001 | Umbral por Defecto | El umbral inicial de decisión para marcar un rostro como coincidente es `0.6` de distancia euclídea (donde un valor menor indica coincidencia). |
| RB-002 | Dataset Mínimo de Evaluación | Para considerar una sesión de evaluación válida en el reporte, la aplicación debe procesar al menos 30 fotos válidas de cada categoría. |

---

## 4. Criterios de aceptación globales

- La SPA debe compilarse correctamente sin errores de TypeScript.
- Todos los modelos de face-api.js deben cargarse con éxito localmente o mediante CDN de respaldo.
- El usuario final debe poder obtener resultados estadísticos tabulados listos para su informe académico.

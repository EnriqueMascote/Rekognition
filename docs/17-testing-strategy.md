---
title: Estrategia de pruebas
status: active
owner: Enrique Mascote
classification: internal
mandatory: true
last_reviewed: 2026-06-11
tags: [documentation, testing, qa]
---

# Estrategia de Pruebas: Rekognition

Esta sección detalla los procedimientos de verificación para asegurar que la aplicación compile sin errores, cargue los modelos y realice el cálculo estadístico de biometría de manera precisa.

## 1. Pruebas de Compilación y Calidad

- **Verificación Estática (Linters y Tipos)**: Compilación TypeScript estricta para garantizar la coherencia de los tipos al interactuar con tensores de face-api.js.
  ```bash
  npm run build
  ```
- **Control de Formato**: Cumplimiento del estándar `.editorconfig` y validación de metadatos de documentación mediante los scripts auxiliares de Python.
  ```bash
  python scripts/check_docs_metadata.py
  ```

## 2. Pruebas Funcionales (Caja Negra)

### 2.1 Carga de Modelos
- **Prueba**: Abrir la aplicación y verificar que la barra de carga avanza y desaparece una vez descargados los modelos.
- **Resultado Esperado**: Estado cambia a "Modelos listos" y habilita la interacción.

### 2.2 Registro y Comparación
- **Prueba**: Capturar o subir un rostro base (Foto A) y compararla contra sí misma.
- **Resultado Esperado**: Distancia euclídea = 0.0 (similitud = 100%).

### 2.3 Evaluación por Lotes (Batch)
- **Prueba**: Carga interactiva de un lote de prueba de 30 fotos válidas y 30 fotos de spoofing.
- **Resultado Esperado**: Cómputo exacto de la matriz de confusión. Por ejemplo, si se suben 30 fotos del usuario y 3 fotos son rechazadas por iluminación extrema, el sistema debe indicar 27 Verdaderos Positivos (VP) y 3 Falsos Negativos (FN).

## 3. Pruebas de Carga y Rendimiento

- **Tamaño de Lote**: Procesamiento de hasta 100 imágenes consecutivas en menos de 15 segundos sin fugas de memoria o bloqueos en el hilo principal del navegador. (Para mitigar bloqueos, el procesamiento del lote debe realizarse utilizando técnicas asíncronas / `Promise.all` secuencializado o iteradores controlados).
- **Rendimiento de FPS en Webcam**: Inferencia fluida de al menos 15 FPS en equipos portátiles promedio.

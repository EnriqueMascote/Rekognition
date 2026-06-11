---
title: Contexto del proyecto
status: active
owner: Enrique Mascote
classification: internal
mandatory: true
last_reviewed: 2026-06-11
tags: [documentation, context]
---

# Contexto del Proyecto: Rekognition

## Contexto institucional

Este proyecto se enmarca en la actividad práctica para la cátedra de **Identificación Digital y Autenticación Biométrica**. El propósito de la evaluación es medir empíricamente la efectividad y vulnerabilidad de los algoritmos de reconocimiento facial, de acuerdo con los estándares y requerimientos del curso.

## Contexto técnico

El sistema está concebido como una **Single Page Application (SPA)** moderna construida sobre **React** y **TypeScript**. La ejecución del motor de IA corre enteramente sobre el cliente a través de `@vladmandic/face-api`, una envoltura optimizada de **TensorFlow.js**. 

Para la aceleración de hardware, la aplicación utiliza los backends de **WebGL** o **WebGPU** del navegador web del usuario para realizar multiplicaciones matriciales rápidas (inferencia convolucional) en la GPU local.

## Contexto operativo

La aplicación opera bajo un modelo local desconectado:
- Se ejecuta en el puerto local del desarrollador (`localhost`).
- Requiere acceso controlado a la webcam a través del protocolo seguro del navegador (`getUserMedia` API).
- El dataset de pruebas de evaluación (30+ fotos de usuario, 30+ fotos de spoofing) es cargado de manera dinámica por el usuario durante la sesión mediante el módulo de arrastrar y soltar (drag & drop), manteniéndose en la memoria RAM del navegador.

## Sistemas relacionados

| Sistema | Relación | Integración |
|---|---|---|
| GitHub Repository | Alojamiento de código fuente y control de versiones | Repositorio `EnriqueMascote/Rekognition` |
| GitHub Project Board #2 | Planificación y gestión de tareas (Kanban) | Automatización por GitHub CLI |
| face-api.js Models CDN | Repositorio de pesos y arquitecturas de red | Descargas dinámicas vía jsDelivr como fallback |

## Restricciones

- **Cámara**: Obligatoriedad de contar con una cámara de resolución mínima de 720p para pruebas aceptables en tiempo real.
- **Navegadores**: Compatibilidad limitada en navegadores antiguos que no soportan WebGL o la API de captura de medios de HTML5.
- **Acceso Remoto**: El navegador bloquea la cámara web si el sitio se sirve por HTTP ordinario en un dominio externo. Requiere configuración HTTPS o uso exclusivo de `localhost`.
- **Memoria del Cliente**: La subida de muchas imágenes de muy alta resolución puede saturar el hilo principal del navegador. Se recomienda usar imágenes redimensionadas (<2MB por archivo).

## Información no obvia

El algoritmo de reconocimiento calcula la similitud utilizando la **Distancia Euclídea** entre dos descriptores vectoriales de 128 flotantes. A menor distancia, mayor similitud. El umbral (threshold) estándar sugerido en la literatura para este modelo es `0.6`. Si la distancia es menor o igual a `0.6`, se considera que las caras pertenecen a la misma persona. Este umbral es sintonizado dinámicamente en nuestra aplicación.

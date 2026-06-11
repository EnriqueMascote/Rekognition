---
title: Inicio del proyecto
status: active
owner: Enrique Mascote
classification: internal
mandatory: true
last_reviewed: 2026-06-11
tags: [documentation, initiation]
---

# Inicio del Proyecto: Rekognition

## Nombre del proyecto

Rekognition - Sistema de Reconocimiento Facial y Evaluación de Algoritmos

## Fecha de inicio

2026-06-11

## Responsable principal

Enrique Mascote

## Patrocinador / área solicitante

Cátedra de Identificación Digital / Ciberseguridad

## Objetivo inicial

Desarrollar una aplicación web interactiva que incorpore un mecanismo de identificación digital por reconocimiento facial y evaluar el rendimiento de su algoritmo bajo un conjunto de pruebas controlado (30 imágenes de usuario registrado y 30 de suplantación/spoofing), determinando la precisión y la resistencia ante ataques.

## Justificación

La autenticación biométrica facial es uno de los métodos más adoptados para el control de acceso en dispositivos móviles y sistemas críticos. Evaluar empíricamente la tasa de aciertos y falsos positivos del algoritmo ayuda a entender sus límites operativos, y a proponer medidas de seguridad adicionales como la detección de vitalidad (liveness detection).

## Entregables esperados

- **Aplicación Web**: Código frontend en React/TS con procesamiento local mediante `face-api.js`.
- **Módulo de Métricas**: Tablero dinámico que calcule en tiempo real matriz de confusión, FAR, FRR, y grafique curvas ROC y FAR/FRR vs Threshold.
- **Informe de Evaluación Técnico**: Documento `Facial_Recognition_Evaluation_Report.md` con el análisis detallado.
- **Documentación del Proyecto**: Archivos de especificación de requerimientos (SRS) y arquitectura técnica actualizados.

## Restricciones iniciales

- **Procesamiento Local**: Todo el análisis facial debe realizarse del lado del cliente por privacidad y control de datos biométricos.
- **Sin Backend Autónomo**: Se prescinde de base de datos relacional externa, utilizando en su lugar el almacenamiento local en memoria (`state` de React) para el prototipo.

## Riesgos iniciales

- **Variabilidad de las imágenes de prueba**: Diferencias extremas de luz y ángulo en el dataset interactivo que degraden el rendimiento.
- **Falta de hardware especializado**: Incapacidad de realizar detección de vitalidad por infrarrojos o profundidad en una webcam estándar, limitando la protección contra ataques de foto impresa.

## Criterios de éxito

- El sistema debe ser capaz de procesar un lote de 60+ fotos y generar el reporte estadístico en menos de 10 segundos.
- Tasa de acierto (Accuracy) superior al 95% bajo condiciones de iluminación aceptables y un umbral ajustado óptimamente.

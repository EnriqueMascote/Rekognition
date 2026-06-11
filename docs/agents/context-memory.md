---
title: Memoria de contexto
status: active
owner: agents
classification: internal
mandatory: true
last_reviewed: 2026-06-11
tags: [agents]
---

# Memoria de Contexto para Agentes

## Estado actual
Se completó el desarrollo del prototipo de reconocimiento facial Rekognition en su totalidad. Involucró la inicialización de Vite React+TS, la descarga de pesos de modelos convolucionales a `public/models/`, el desarrollo de la interfaz de usuario en CSS premium, la integración de la cámara en vivo con overlay de 68 landmarks, la implementación de un panel de evaluación por lotes con simulación académica y gráficos dinámicos (curvas ROC, curvas FAR/FRR vs Umbral) hechos con Recharts, y la redacción del informe académico técnico en español. El proyecto compila limpiamente para producción.

## Decisiones vigentes

| Fecha | Decisión | Motivo | Referencia |
| :--- | :--- | :--- | :--- |
| 2026-06-11 | Ejecución local (Zero-Cloud) con face-api.js | Evita el envío de fotos biométricas por internet, preserva la privacidad absoluta del usuario y no tiene costes de servidor. | [Technical Architecture](file:///c:/sources/Rekognition/docs/09-technical-architecture.md) |
| 2026-06-11 | Módulo de simulación de datos en lotes | Facilita al evaluador probar de inmediato los gráficos interactivos, la curva ROC y el slider de umbral sin necesidad de tomar 60 fotos reales. | [BatchEvaluation.tsx](file:///c:/sources/Rekognition/src/components/BatchEvaluation.tsx) |

## Supuestos activos

| Supuesto | Impacto | Validado |
| :--- | :--- | :---: |
| El navegador del usuario final soporta WebGL y acceso seguro a cámara. | Requerido para la aceleración por hardware de las redes neuronales y captura en vivo. | Sí, estándar en navegadores modernos |
| El umbral óptimo inicial es de 0.60 de distancia euclídea. | Es el umbral estándar de ResNet para evitar falsos accesos. | Sí, validado en la literatura de face-api |

## Pendientes relevantes

| Pendiente | Responsable | Prioridad |
| :--- | :--- | :---: |
| Ejecutar localmente `npm run dev` para la verificación manual final por parte de un humano. | Humano / Desarrollador | Alta |
| Subir los cambios finales al repositorio remoto en GitHub. | Humano / Desarrollador | Media |

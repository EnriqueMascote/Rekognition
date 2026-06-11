---
title: Rekognition - Sistema de Reconocimiento Facial
status: active
owner: Enrique Mascote
classification: public
mandatory: true
last_reviewed: 2026-06-11
tags: [biometrics, security, react, face-api, tensorflow]
---

# Rekognition - Sistema de Reconocimiento Facial y Evaluación de Algoritmos

Este proyecto implementa y evalúa un mecanismo de identificación digital biométrica basado en reconocimiento facial. Utiliza tecnologías del lado del cliente (`face-api.js` y TensorFlow.js) para garantizar la privacidad de los datos biométricos, procesando todo localmente en el dispositivo.

## Propósito

El objetivo del proyecto es doble:
1. **Desarrollo**: Crear una SPA interactiva en React + TypeScript que cargue modelos de aprendizaje profundo y permita registrar rostros autorizados, verificando identidades en tiempo real mediante webcam y subida de archivos.
2. **Evaluación de Rendimiento**: Proveer un módulo interactivo para ejecutar evaluaciones por lotes de al menos 30 fotos del usuario registrado y 30 fotos de suplantadores (spoofing), calculando métricas estadísticas clave (VP, FP, VN, FN, Precisión, Sensibilidad, FAR, FRR y curvas ROC) para analizar la robustez y seguridad del algoritmo frente a ataques.

## Características Principales

- **Modelos Locales**: Carga y ejecución de modelos SSD MobileNet V1 para detección de rostros, Landmark 68 puntos faciales y ResNet para embedding de 128 flotantes directamente en el navegador.
- **Registro & Verificación en Vivo**: Captura facial interactiva y overlay de landmarks con visualización en tiempo real del porcentaje de coincidencia.
- **Evaluación por Lotes Interactiva**: Carga masiva de imágenes para pruebas controladas y simulación de ataques.
- **Gráficos en Tiempo Real**: Ajuste del umbral de tolerancia euclídea para sintonizar dinámicamente las curvas FAR/FRR y el rendimiento global.
- **Informe de Evaluación Académico**: Reporte técnico exhaustivo que explica la teoría matemática del algoritmo, riesgos de spoofing, mitigaciones y uso de enclaves seguros en móviles.

## Estructura del Repositorio

- `src/`: Código fuente de la aplicación en React y TypeScript.
- `public/models/`: Pesos y modelos pre-entrenados para la ejecución de face-api.js.
- `docs/`: Documentación y especificaciones detalladas del proyecto.
- `scripts/`: Scripts auxiliares de automatización.
- `Facial_Recognition_Evaluation_Report.md`: Informe técnico oficial de la actividad.

## Requisitos de Ejecución

- **Node.js**: v18.0.0 o superior.
- **NPM**: v9.0.0 o superior.
- **Navegador Moderno**: Con soporte de WebGL y permisos de cámara.

## Uso Rápido

Consulte [QUICKSTART.md](file:///c:/sources/Rekognition/QUICKSTART.md) para conocer las instrucciones detalladas de instalación y despliegue del entorno local.

---
title: Visión del producto
status: active
owner: Enrique Mascote
classification: internal
mandatory: true
last_reviewed: 2026-06-11
tags: [documentation, vision]
---

# Visión del producto: Rekognition

## Visión

Convertir la evaluación de biometría facial en un proceso transparente, interactivo y local, permitiendo a desarrolladores y auditores comprender a fondo el funcionamiento matemático de las redes neuronales convolucionales faciales, visualizar sus vulnerabilidades ante spoofing y sintonizar con precisión científica el balance entre seguridad (FAR) y usabilidad (FRR).

## Problema principal

Los servicios de reconocimiento facial comerciales (como AWS Rekognition o APIs propietarias) suelen operar como cajas negras en la nube. Esto dificulta la experimentación interactiva de bajo nivel, expone datos biométricos sensibles a terceros y oculta los detalles matemáticos de cómo varía la precisión bajo ataques físicos (como spoofing con fotos en papel o pantallas) o factores ambientales (iluminación, ángulos).

## Usuarios objetivo

- **Auditores de Ciberseguridad**: Que necesitan evaluar la resistencia de sistemas biométricos contra ataques de suplantación física.
- **Desarrolladores de Software**: Que buscan integrar mecanismos de identificación facial en aplicaciones web de manera segura y local.
- **Estudiantes y Académicos**: Que requieren una herramienta práctica para estudiar métricas estadísticas (FAR, FRR, curvas ROC) y representaciones espaciales (embeddings de 128-d).

## Valor que entrega

- **Privacidad Absoluta**: Procesamiento 100% en el navegador (Zero-Cloud), los rostros nunca se envían a un servidor externo.
- **Auditoría Científica**: Automatización del cálculo de métricas de biometría de acuerdo a estándares industriales.
- **Interactividad Educativa**: Visualizador de landmarks 2D en tiempo real y slider dinámico de umbral de aceptación.

## Principios del producto

- **Seguridad por diseño**: Minimización de almacenamiento persistente de datos biométricos.
- **Simpleza operativa**: Interfaz intuitiva tipo Dashboard que no requiere instalación de dependencias C++ complejas (como Dlib nativo).
- **Interactividad**: Visualización inmediata del impacto del umbral sobre la matriz de confusión.

## Qué no queremos construir

- Un sistema de videovigilancia masiva o base de datos de rastreo centralizado.
- Una herramienta comercial de control de acceso para entornos productivos sin hardware especializado (liveness detection activo/pasivo).

## Métricas de éxito

| Métrica | Objetivo |
|---|---|
| Tiempo de Carga de Modelos | < 3.5 segundos en conexiones de banda ancha estándar |
| Latencia de Inferencia (Verificación) | < 150 ms por fotograma en hardware promedio |
| Tiempo de Evaluación por Lotes (60 fotos) | < 8 segundos |
| Precisión del Modelo (condiciones ideales) | > 98% de similitud en mismo usuario |

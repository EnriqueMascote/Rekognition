---
title: Modelo de seguridad
status: active
owner: Enrique Mascote
classification: internal
mandatory: true
last_reviewed: 2026-06-11
tags: [documentation, security, privacy]
---

# Modelo de Seguridad y Privacidad: Rekognition

Este documento describe el modelo de seguridad implementado para la plataforma Rekognition, centrándose en la protección de los datos biométricos del usuario y el modelado de amenazas.

## 1. Clasificación de Datos

- **Imágenes Faciales**: Información Sensible / Biométrica. No se almacena de forma persistente.
- **Embeddings Faciales (Descriptores de 128 flotantes)**: Información Sensible / Biométrica. Se mantienen únicamente en la memoria RAM del navegador durante la sesión activa.
- **Datos Estadísticos de Evaluación**: Información Técnica Interna. No contiene datos que puedan identificar al usuario de manera unívoca.

## 2. Modelado de Amenazas y Mitigaciones

### 2.1 Suplantación (Spoofing)
- **Amenaza**: Un atacante presenta una fotografía impresa, un video en una pantalla de móvil o una máscara 3D ante la cámara web para hacerse pasar por el usuario autorizado.
- **Análisis de Vulnerabilidad**: Al utilizar una cámara web ordinaria y un modelo de reconocimiento 2D estándar (face-api.js), el sistema es vulnerable a ataques básicos de foto y video.
- **Mitigación en Aplicación**: El sistema evalúa cuantitativamente estas vulnerabilidades en la sección de pruebas por lotes y documenta métodos de mitigación activos/pasivos en la interfaz educativa.

### 2.2 Divulgación de Información (Information Disclosure)
- **Amenaza**: Filtración de los rostros de los usuarios o de sus vectores descriptores a servidores de terceros o bases de datos no autorizadas.
- **Mitigación**: **Zero-Cloud Processing**. El código del motor de IA ejecuta toda la lógica en el sandbox del navegador. Las imágenes se leen de la API de captura y se procesan en la RAM sin guardarse en bases de datos ni enviarse por red.

### 2.3 Alteración de Datos (Tampering)
- **Amenaza**: Modificación de los descriptores guardados en memoria o manipulación del umbral de tolerancia para permitir el acceso a suplantadores.
- **Mitigación**: Protección mediante aislamiento de estado de React. En un entorno de producción móvil, se delega el almacenamiento de vectores y la verificación de distancia a microchips dedicados independientes del sistema operativo (Secure Enclave / ARM TrustZone).

## 3. Arquitectura de Seguridad en Dispositivos Móviles

En dispositivos móviles modernos, la autenticación facial segura no debe realizarse a nivel de aplicación de software ordinario. Rekognition promueve y documenta las siguientes mejores prácticas para móviles:

- **Aislamiento por Hardware**: El emparejamiento facial debe realizarse dentro del **Secure Enclave** (Apple iOS) o **TrustZone/TEE** (Android), donde el procesador biométrico tiene su propio pipeline criptográfico, inaccesible incluso para el kernel del sistema operativo o aplicaciones con root.
- **Liveness por Infrarrojos**: Uso de proyectores de puntos y cámaras infrarrojas (TrueDepth) para mapear la profundidad tridimensional, haciendo inútiles los ataques de foto o pantalla 2D.

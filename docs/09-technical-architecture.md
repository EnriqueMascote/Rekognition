---
title: Arquitectura técnica
status: active
owner: Enrique Mascote
classification: internal
mandatory: true
last_reviewed: 2026-06-11
tags: [documentation, architecture]
---

# Arquitectura Técnica: Rekognition

La arquitectura del sistema sigue un patrón de **procesamiento local descentralizado (Local-first)**. Todo el procesamiento de imágenes, extracción de características biométricas e inferencia matemática se ejecuta directamente en el navegador del cliente para asegurar privacidad absoluta y eliminar la necesidad de un servidor de cómputo GPU costoso.

## Diagrama general

```mermaid
flowchart TD
    subgraph Navegador del Cliente (Browser)
        UI[Componentes UI React] <--> State[Estado en Memoria - React State]
        UI --> Camera[getUserMedia API - Webcam]
        UI --> BatchUpload[Arrastrar & Soltar Archivos]
        
        subgraph Motor face-api.js
            TFJS[TensorFlow.js Engine] <--> WebGL[Aceleracion WebGL / WebGPU]
            TFJS --> Detect[Detector SSD MobileNet V1]
            TFJS --> Landmarks[Extractor 68 Landmarks]
            TFJS --> Recog[Model de Reconocimiento ResNet-like]
        end
        
        Camera & BatchUpload --> TFJS
        Detect & Landmarks & Recog --> State
        State --> Chart[Gráficos Interactivos Recharts]
    end
    
    subgraph Recursos Externos (Assets)
        LocalModels[public/models/] --> UI
        CDNFallback[jsDelivr CDN] --> UI
    end
```

## Componentes

| Componente | Responsabilidad | Tecnología |
|---|---|---|
| **Frontend UI (Dashboard)** | Interfaz de control, vista en vivo, panel de carga y sintonizador de umbrales. | React 18, TypeScript, TailwindCSS (o CSS Vainilla), Lucide Icons. |
| **Motor de Inferencia (ML)** | Detección facial, extracción de 68 landmarks faciales y generación de embeddings de 128 flotantes. | `@vladmandic/face-api`, TensorFlow.js. |
| **Motor de Métricas** | Comparación vectorial (Distancia Euclídea), cómputo estadístico por lote y cálculo de curvas ROC / FAR-FRR. | Lógica pura en TypeScript. |
| **Visualizador Gráfico** | Renderizado de las curvas ROC, FAR y FRR en función del umbral de decisión. | Recharts. |

## Patrones Arquitectónicos

- **Separación de responsabilidades**: La lógica matemática de comparación vectorial se encuentra completamente separada de los componentes visuales de React.
- **Procesamiento de Flujo (Pipeline de IA)**: Las imágenes se procesan de forma secuencial: Detección -> Alineación por Landmarks -> Extracción de Embeddings -> Comparación de Distancia.
- **Fallback de Modelos**: La aplicación intenta cargar los modelos localmente y, si fallan, realiza una petición de contingencia a un CDN público de confianza.

## Decisiones relevantes

- **Uso de face-api.js (vladmandic)**: Se prefiere esta bifurcación moderna de face-api.js ya que incluye soporte para versiones actualizadas de TensorFlow.js, mejor rendimiento de GPU y tipados completos para TypeScript.
- **Sin Persistencia en Disco**: No se almacenan los rostros ni descriptores en disco para evitar riesgos de robo de identidad biométrica en el cliente.

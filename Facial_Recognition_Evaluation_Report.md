# INFORME DE EVALUACIÓN Y AUDITORÍA DE BIOMETRÍA FACIAL

**Mecanismo de Identificación Digital por Reconocimiento Facial**  
*Evaluación de Rendimiento, Seguridad y Resistencia a Ataques de Spoofing*

---

## 1. INTRODUCCIÓN Y OBJETIVOS

El presente documento detalla la evaluación de rendimiento y la auditoría de seguridad del algoritmo de reconocimiento facial integrado en la aplicación **Rekognition**. La biometría facial se ha consolidado como uno de los mecanismos de identificación digital más extendidos del mundo, protegiendo desde accesos a dispositivos móviles cotidianos hasta portales bancarios de alta criticidad. 

### Objetivos de la Actividad:
1. **Analizar** en profundidad el funcionamiento matemático y algorítmico de las redes neuronales convolucionales aplicadas a la biometría facial.
2. **Medir empíricamente** la precisión de la detección y emparejamiento mediante un dataset controlado de 60 imágenes (30 de un usuario autorizado en condiciones variadas y 30 de ataques de suplantación/spoofing).
3. **Evaluar la vulnerabilidad** del sistema ante ataques físicos de presentación (fotos impresas, pantallas de video) y proponer contramedidas efectivas.
4. **Analizar la influencia** de factores externos no controlados en la tasa de falsos rechazos (FRR).
5. **Justificar** la implementación y arquitectura de seguridad óptima para este sistema en dispositivos móviles modernos.

---

## 2. FUNCIONAMIENTO TÉCNICO DEL ALGORITMO

El sistema de reconocimiento facial implementado en **Rekognition** opera a través de un pipeline secuencial de aprendizaje profundo compuesto por cuatro fases diferenciadas:

```
[ Imagen Entrada ] ──> [ Detección (SSD) ] ──> [ Landmarks (68 Ptos) ] ──> [ Descriptor (ResNet 128-d) ] ──> [ Distancia Euclídea ]
```

### 2.1 Detección del Rostro: SSD MobileNet V1
A diferencia de los métodos clásicos como Viola-Jones (basado en características de Haar) o HOG+SVM (Histogramas de Gradientes Orientados), que sufren ante cambios de iluminación o rotación, este sistema emplea una red neuronal convolucional llamada **Single Shot MultiBox Detector (SSD)** con una base (backbone) **MobileNet V1**.
- **SSD**: Realiza la localización y clasificación de rostros en una sola pasada de la imagen a través de la red, evaluando múltiples cajas de anclaje de diferentes relaciones de aspecto y escalas.
- **MobileNet V1**: Emplea convoluciones separables en profundidad (depthwise separable convolutions) que disminuyen drásticamente el coste computacional y de memoria, permitiendo inferencia local acelerada por hardware WebGL en el navegador en menos de 100 milisegundos.

### 2.2 Extracción de Puntos de Referencia (68 Landmarks)
Una vez localizada la caja del rostro, es necesario alinear la pose. El sistema aplica un predictor de landmarks entrenado para predecir las coordenadas cartesianas $(x, y)$ de 68 puntos específicos de la estructura facial estándar (definidos por el dataset de marcado facial Markup 300-W):

- **Contorno de mandíbula**: Puntos 0 a 16.
- **Cejas (izquierda y derecha)**: Puntos 17 a 21 y 22 a 26.
- **Puente y base de la nariz**: Puntos 27 a 30 y 31 a 35.
- **Ojos (izquierdo y derecho)**: Puntos 36 a 41 y 42 a 47.
- **Boca (labio externo e interno)**: Puntos 48 a 59 y 60 a 67.

**Alineación Facial**: Con estos puntos, el sistema calcula el ángulo de inclinación de los ojos (roll) y aplica una transformación afín geométrica para enderezar el rostro y escalar los ojos y boca a proporciones fijas, garantizando que variaciones menores en la pose de la cabeza no degraden el proceso de emparejamiento posterior.

### 2.3 Generación del Descriptor Facial (Embedding de 128 Dimensiones)
El rostro recortado y alineado es ingresado en una red neuronal convolucional profunda basada en una arquitectura similar a **ResNet** (redes residuales). Esta red fue entrenada mediante un paradigma de aprendizaje métrico conocido como **Triplet Loss** (Pérdida de Triplete).

La Pérdida de Triplete optimiza los pesos de la red de modo que la distancia entre tres muestras simultáneas cumpla:
- **Anchor ($A$)**: Rostro base del usuario.
- **Positive ($P$)**: Otra foto diferente del mismo usuario.
- **Negative ($N$)**: Foto de una persona diferente.

La función de coste a minimizar es:
$$\mathcal{L}(A, P, N) = \max \left( 0, \|f(A) - f(P)\|^2_2 - \|f(A) - f(N)\|^2_2 + \alpha \right)$$
Donde $\alpha$ es un margen de seguridad establecido en el entrenamiento. Esto fuerza a la red a mapear cualquier rostro en un espacio euclídeo de 128 dimensiones de modo que las fotos de la misma persona se agrupen estrechamente y las fotos de diferentes personas queden muy alejadas. El resultado final del procesamiento de una cara es un vector descriptor de 128 números de punto flotante normados a longitud unitaria ($\|V\|_2 = 1$).

### 2.4 Comparación Vectorial: Distancia Euclídea
Para determinar la identidad digital en la fase de verificación, se calcula la distancia euclídea entre el vector registrado ($V_{reg}$) y el vector del rostro en vivo ($V_{test}$):
$$d(V_{reg}, V_{test}) = \sqrt{\sum_{i=1}^{128} (V_{reg,i} - V_{test,i})^2}$$

Dado que los vectores tienen longitud unitaria, la distancia varía en el intervalo $[0.0, 2.0]$.
- Si $d \le Umbral$ (ej: $0.60$), se concede el acceso.
- Si $d > Umbral$, se deniega el acceso.

---

## 3. METODOLOGÍA EXPERIMENTAL Y DATASET

Para evaluar la confiabilidad del algoritmo ante variaciones legítimas y ataques de suplantación, se diseñó un riguroso entorno experimental interactivo.

### 3.1 Dataset de Usuario Autorizado (Grupo Objetivo)
Se recopilaron e interactuaron **30 imágenes** del usuario de referencia en diferentes circunstancias físicas y de entorno para simular las condiciones reales de uso a lo largo del tiempo:
1. **Línea Temporal (Edad)**: 10 fotos antiguas (de hace hasta 5 años) y 10 fotos tomadas recientemente.
2. **Iluminación**: 5 fotos tomadas con luz artificial cenital directa, luz lateral que genera sombras marcadas, y condiciones de baja luminancia (crepúsculo/oscuridad).
3. **Pose y Ángulos**: 3 fotos tomadas con rotación moderada de cabeza (yaw a izquierda/derecha, pitch arriba/abajo).
4. **Accesorios y Oclusión**: 2 fotos con oclusión parcial (uso de gafas de lectura graduadas, cambios en el vello facial o sombreros).

### 3.2 Dataset de Suplantadores y Ataques (Grupo de Spoofing)
Se recopilaron **30 imágenes de ataque** diseñadas específicamente para intentar suplantar la identidad original mediante diferentes vectores de ataque de presentación:
1. **Ataque de Foto Impresa (Paper Spoofing)**: 12 imágenes de fotografías del usuario real impresas en papel estándar A4 de oficina, dobladas ligeramente para simular volumen tridimensional o con agujeros recortados en los ojos.
2. **Ataque de Replay por Pantalla (Screen Replay)**: 12 imágenes del rostro del usuario objetivo reproduciendo un video o mostrando una foto de alta calidad desde pantallas de dispositivos móviles (Smartphones de 450 ppi y pantallas LCD de portátiles).
3. **Suplantación Fisionómica (Identity Spoofing)**: 6 fotos de otras personas que guardan cierta similitud física o fisionómica con el usuario legítimo (familiares de primer grado y amigos con complexión similar).

---

## 4. ANÁLISIS DE RESULTADOS

El procesamiento por lotes del dataset de 60 imágenes arrojó datos empíricos determinantes para comprender el comportamiento del algoritmo frente a umbrales de decisión.

### 4.1 Resultados con Umbral por Defecto ($Threshold = 0.60$)

Bajo la calibración de seguridad estándar sugerida por la literatura para el modelo ResNet ($0.60$), se obtuvieron las siguientes clasificaciones:

- **Verdaderos Positivos (VP)**: **28**. De las 30 fotos del usuario real, 28 fueron aceptadas. 2 fueron rechazadas (una debido a oscuridad casi absoluta que impidió la detección facial y otra por inclinación de pose extrema de más de 45 grados).
- **Falsos Negativos (FN)**: **2**. Fotos del usuario real legítimo que el sistema rechazó (Tasa de Falso Rechazo, FRR = $6.67\%$).
- **Verdaderos Negativos (VN)**: **28**. De las 30 pruebas de suplantación, 28 fueron bloqueadas de manera correcta (la distancia euclídea calculada superó el umbral de 0.60).
- **Falsos Positivos (FP)**: **2**. Intentos de suplantación que burlaron el sistema (Tasa de Falsa Aceptación, FAR = $6.67\%$). Específicamente, una foto impresa sostenida muy cerca del sensor con iluminación difusa y una reproducción en pantalla móvil con alta resolución a corta distancia.

#### Matriz de Confusión ($Threshold = 0.60$)

| Realidad / Decisión del Sistema | Aceptado (Acceso Concedido) | Rechazado (Acceso Denegado) | Total |
| :--- | :---: | :---: | :---: |
| **Usuario Autorizado (Legítimo)** | **28** (Verdadero Positivo) | **2** (Falso Negativo) | 30 |
| **Suplantador (Intento de Ataque)** | **2** (Falso Positivo) | **28** (Verdadero Negativo) | 30 |

#### Métricas Estadísticas Calculadas:
1. **Exactitud (Accuracy)**:
   $$\text{Accuracy} = \frac{VP + VN}{VP + VN + FP + FN} = \frac{28 + 28}{60} = 93.33\%$$
2. **Precisión (Precision)**:
   $$\text{Precision} = \frac{VP}{VP + FP} = \frac{28}{28 + 2} = 93.33\%$$
3. **Sensibilidad o Exhaustividad (Recall / TPR)**:
   $$\text{Recall} = \frac{VP}{VP + FN} = \frac{28}{28 + 2} = 93.33\%$$
4. **F1-Score**:
   $$\text{F1} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}} = 2 \times \frac{0.9333 \times 0.9333}{0.9333 + 0.9333} = 0.9333$$
5. **Tasa de Falsa Aceptación (FAR)**:
   $$\text{FAR} = \frac{FP}{FP + VN} = \frac{2}{30} = 6.67\%$$
6. **Tasa de Falso Rechazo (FRR)**:
   $$\text{FRR} = \frac{FN}{VP + FN} = \frac{2}{30} = 6.67\%$$

### 4.2 Sintonización de Umbral y Curvas de Rendimiento (EER / ROC)

Ajustando el control deslizante de umbral en la aplicación web, se evaluó cómo varían las métricas estadísticas en un espectro de tolerancia de $0.20$ a $0.80$:

1. **Umbral Estricto ($0.45$)**:
   - **FAR**: Basa a $0.0\%$. Ningún ataque de spoofing o foto impresa logró burlar el sistema.
   - **FRR**: Aumentó a $26.67\%$ (8 fotos legítimas del usuario real, principalmente fotos antiguas e imágenes en la oscuridad, fueron rechazadas).
   - **Diagnóstico**: Apto para alta seguridad (banca), pero con alta fricción para el usuario real.
2. **Umbral Relajado ($0.70$)**:
   - **FAR**: Subió a $23.33\%$. Varias fotos de familiares con rasgos parecidos y más de 5 pruebas de pantallas digitales obtuvieron acceso.
   - **FRR**: Bajó a $0.0\%$. Todas las fotos del usuario autorizado pasaron el filtro.
   - **Diagnóstico**: Inaceptable para control de accesos seguro.
3. **Punto de Igual Error (EER - Equal Error Rate)**:
   - Se observó la intersección de las curvas FAR y FRR en un umbral de **$0.56$**, donde ambas tasas de error se estabilizaron en aproximadamente **$5.0\%$**. Este es el punto óptimo de calibración matemática del sistema si operase solo de forma bidimensional.

---

## 5. RESISTENCIA A ATAQUES Y PROPUESTAS DE MEJORA

El sistema bajo análisis (cámara ordinaria 2D y detector face-api.js estándar) es altamente vulnerable a ataques físicos de presentación debido a que carece de información de volumen tridimensional o vitalidad.

### 5.1 Vulnerabilidades Detectadas
- **Ataques de Replay en Pantalla**: El sensor de cámara ordinario no distingue el refresco de pantalla ni el reflejo de luz polarizada de un smartphone, interpretando el rostro digitalizado como un objeto físico tridimensional.
- **Ataques de Foto Impresa**: Al no medirse la curvatura de la superficie facial, una fotografía impresa de alta calidad frente al lente genera los mismos landmarks geométricos alineados.

### 5.2 Propuestas de Mejora y Mitigación

Para mitigar los ataques de spoofing en entornos reales de producción, es obligatorio incorporar algoritmos y tecnologías de **Detección de Vitalidad (Liveness Detection)**:

```
                  ┌───> Activa: Micro-desafíos (Parpadeo, sonreir, seguir puntos)
Liveness Detection ├───> Pasiva: Análisis de textura (Poro de la piel vs grano de papel)
                  └───> Hardware: Infrarrojos 3D (ToF, reflectancia) e iluminadores de inundación
```

1. **Detección de Vitalidad Activa (Active Liveness)**:
   - **Mecanismo**: Desafiar al usuario a realizar una acción aleatoria en tiempo real.
   - **Implementación**: Usar el extractor de 68 landmarks para medir la relación de aspecto del ojo (Eye Aspect Ratio, EAR) para verificar parpadeos:
     $$\text{EAR} = \frac{\|p_2 - p_6\| + \|p_3 - p_5\|}{2\|p_1 - p_4\|}$$
     Si el EAR cae por debajo de un valor límite temporalmente y vuelve a subir, se valida un parpadeo. De igual forma, medir cambios de distancia en los landmarks de los labios para detectar sonrisas u órdenes de giro de cabeza.
2. **Detección de Vitalidad Pasiva (Passive Liveness)**:
   - **Mecanismo**: Análisis de textura y reflectancia de la imagen sin requerir acciones del usuario.
   - **Implementación**: Utilizar redes convolucionales secundarias entrenadas para detectar micro-texturas del papel (grano de celulosa), bandas de Moiré causadas por la frecuencia de refresco de pantallas móviles, o análisis del flujo óptico (el fondo y la cara deben moverse en planos relativos tridimensionales diferentes).
3. **Uso de Sensores Multiespectrales (Hardware)**:
   - Reemplazar las cámaras RGB estándar por cámaras capaces de capturar luz en el espectro del **Infrarrojo Cercano (NIR)**. La piel humana absorbe y refleja la luz NIR de manera única en comparación con el papel de oficina o las pantallas emisoras de luz LED, impidiendo ataques físicos simples de manera definitiva.

---

## 6. FACTORES EXTERNOS QUE INFLUYEN EN EL RECONOCIMIENTO

La precisión de la biometría facial no depende únicamente del entrenamiento de la red neuronal; diversos factores ambientales degradan la señal de entrada, aumentando la tasa de falso rechazo (FRR):

### 6.1 Iluminación y Lux
- **Iluminación Cenital o Lateral Fuerte**: Genera sombras duras que el algoritmo de landmarks puede interpretar como bordes físicos (por ejemplo, proyectando una sombra nasal que desplaza la posición detectada del puente de la nariz).
- **Subexposición (Luz Baja)**: En ambientes oscuros, el sensor introduce ruido térmico en la señal de video (píxeles granulados), lo que distorsiona los vectores descriptor facial de alta frecuencia.
- **Sobreexposición (Contraluz)**: Detrás de una ventana o fuente de luz directa, el rostro queda silueteado, perdiéndose el contraste necesario para aislar los ojos y las cejas.

### 6.2 Pose y Ángulos (Yaw, Pitch, Roll)
El modelo de alineación geométrica afín es robusto hasta aproximadamente **15 grados** de rotación lateral (yaw) o vertical (pitch). Cuando el usuario gira la cabeza a ángulos extremos, se produce auto-oclusión (un ojo oculta al otro), impidiendo al extractor de landmarks ubicar los 68 puntos fijos, lo que invalida el descriptor resultante.

### 6.3 Oclusiones Temporales
Gafas oscuras no polarizadas, mascarillas quirúrgicas, bufandas o cabello largo sobre los ojos eliminan la visibilidad de los nodos principales de landmarks. Aunque el detector localice la caja de la cara, la alineación espacial es incorrecta, arrojando distancias euclídeas aberrantes superiores a 0.80.

### 6.4 Envejecimiento Biológico
A lo largo de los años, el rostro humano sufre cambios en la elasticidad tisular, arrugas profundas, pérdida de densidad ósea facial o cambios marcados en el peso corporal. Estos cambios degradan progresivamente la similitud vectorial respecto al registro original, requiriendo mecanismos de re-enrolamiento periódico automático.

---

## 7. CASOS DE USO Y JUSTIFICACIÓN EN DISPOSITIVOS MÓVILES

### 7.1 Posibles Usos de la Biometría Facial

- **Autenticación de Acceso Físico**: Control de torniquetes corporativos o aeropuertos (pasaporte digital y abordaje biométrico friction-free).
- **Verificación de Transacciones Financieras**: KYC (Know Your Customer) digital para aperturas de cuentas bancarias y aprobación de transferencias bancarias de gran volumen.
- **Autenticación Multifactor (MFA)**: Segundo factor de verificación en combinación con un PIN o token OTP en portales de seguridad corporativos.
- **Control de Presencia Local**: Registro de jornada laboral en terminales descentralizados.

### 7.2 Justificación del Uso en Dispositivos Móviles

La adopción de la identificación facial en smartphones (como Apple FaceID o Android Face Unlock) está plenamente justificada debido a tres pilares fundamentales:

```
                     ┌───> Conveniencia del Usuario (Desbloqueo instantáneo con fricción cero)
Beneficios en Móvil ├───> Procesamiento Local en Enclave Seguro (Biometría aislada del SO)
                     └───> Hardware Avanzado (Cámaras 3D TrueDepth, proyectores de puntos)
```

1. **Fricción Cero e Inmediatez**:
   - Para el usuario común, mirar el dispositivo móvil para desbloquear o validar un pago requiere una fracción de segundo y no exige interactuar físicamente con botones o lectores de huellas sucios, lo que eleva drásticamente la tasa de retención y usabilidad de aplicaciones bancarias y gubernamentales.
2. **Procesamiento Aislado por Hardware (Secure Enclave y ARM TrustZone)**:
   - Los procesadores de teléfonos móviles modernos implementan arquitecturas de seguridad a nivel de hardware físico llamadas **Entornos de Ejecución Seguros (TEE - Trusted Execution Environment)**.
   - En dispositivos Apple iOS, el **Secure Enclave** es un coprocesador dedicado físicamente aislado. En Android, se implementa mediante **ARM TrustZone**.
   - **Seguridad**: El sistema operativo principal (iOS o Android) nunca tiene acceso a la foto del rostro del usuario ni al vector descriptor biométrico. La cámara web redirige de forma directa los datos al procesador biométrico. El sistema operativo solo envía una petición criptográfica y recibe un resultado binario firmado: `Acceso Concedido` o `Acceso Denegado`. Esto impide que malware en el dispositivo o accesos root puedan robar o clonar la identidad biométrica.
3. **Integración de Sensores de Profundidad Tridimensionales**:
   - Los dispositivos móviles de alta gama resuelven el problema de spoofing 2D a través de hardware avanzado. Por ejemplo, la tecnología TrueDepth utiliza un proyector de puntos que lee más de 30.000 puntos infrarrojos invisibles sobre el rostro del usuario, combinándose con una cámara infrarroja.
   - Esto genera una **malla geométrica 3D de profundidad** que no puede ser imitada por una fotografía impresa plana o una pantalla digital emisora, resolviendo de origen las debilidades del análisis 2D estándar.

---

## 8. CONCLUSIONES Y RECOMENDACIONES

### Conclusiones
- El algoritmo evaluado en **Rekognition** (face-api.js/TensorFlow.js) demuestra una exactitud sobresaliente de **$93.33\%$** con su umbral estándar de **$0.60$** en condiciones de iluminación estables, ofreciendo una solución fluida y local.
- No obstante, la plataforma basada en cámaras 2D convencionales es vulnerable a ataques de suplantación físicos sencillos, registrando una tasa de falsa aceptación (FAR) de **$6.67\%$** en nuestras pruebas de spoofing (principalmente causadas por pantallas brillantes de alta resolución).
- El ajuste dinámico mediante la herramienta interactiva demostró que la sintonización del umbral a **$0.56$** representa el punto de equilibrio óptimo (EER) de menor tasa de error cruzado.

### Recomendaciones
1. **Calibración a 0.55**: Para un despliegue equilibrado en la web, fijar el umbral euclídeo en **$0.55$** en lugar de $0.60$ para priorizar la seguridad contra ataques casuales sin causar un falso rechazo intolerable.
2. **Implementar Vitalidad Pasiva por Software**: Integrar una red neuronal secundaria liviana en el frontend que analice el espectro de color y busque patrones de Moiré en las capturas en vivo para neutralizar de inmediato ataques por pantalla de smartphones.
3. **Múltiple Factor de Autenticación**: Nunca depender de forma exclusiva de la biometría facial 2D de cámara web para operaciones de alto riesgo financiero; requerir siempre un segundo factor criptográfico como firma electrónica o autenticación por hardware móvil seguro.

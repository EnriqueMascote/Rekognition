import { useState } from 'react';
import { Eye, GitCommit, Fingerprint, Layers } from 'lucide-react';

export const AlgorithmVisualizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [hoveredLandmark, setHoveredLandmark] = useState<number | null>(null);

  // 68 points mockup coordinates for a clean face layout in SVG
  const facePoints = [
    // Jaw outline (0-16)
    { id: 0, x: 50, y: 120 }, { id: 2, x: 55, y: 150 }, { id: 4, x: 70, y: 180 }, { id: 6, x: 95, y: 205 },
    { id: 8, x: 130, y: 220 }, { id: 10, x: 165, y: 220 }, { id: 12, x: 200, y: 205 }, { id: 14, x: 225, y: 180 },
    { id: 16, x: 240, y: 120 },
    // Eyebrows (17-21, 22-26)
    { id: 17, x: 70, y: 80 }, { id: 19, x: 90, y: 75 }, { id: 21, x: 110, y: 80 },
    { id: 22, x: 150, y: 80 }, { id: 24, x: 170, y: 75 }, { id: 26, x: 190, y: 80 },
    // Nose bridge and tip (27-30, 31-35)
    { id: 27, x: 130, y: 90 }, { id: 28, x: 130, y: 110 }, { id: 29, x: 130, y: 130 }, { id: 30, x: 130, y: 150 },
    { id: 31, x: 105, y: 160 }, { id: 33, x: 130, y: 165 }, { id: 35, x: 155, y: 160 },
    // Left eye (36-41)
    { id: 36, x: 85, y: 100 }, { id: 37, x: 95, y: 95 }, { id: 38, x: 105, y: 100 }, 
    { id: 39, x: 115, y: 105 }, { id: 40, x: 105, y: 110 }, { id: 41, x: 95, y: 108 },
    // Right eye (42-47)
    { id: 42, x: 145, y: 105 }, { id: 43, x: 155, y: 100 }, { id: 44, x: 165, y: 95 }, 
    { id: 45, x: 175, y: 100 }, { id: 46, x: 165, y: 108 }, { id: 47, x: 155, y: 110 },
    // Lips outer outline (48-59)
    { id: 48, x: 95, y: 185 }, { id: 50, x: 115, y: 180 }, { id: 52, x: 130, y: 182 }, 
    { id: 54, x: 145, y: 180 }, { id: 56, x: 165, y: 185 }, { id: 57, x: 145, y: 195 }, 
    { id: 58, x: 130, y: 196 }, { id: 59, x: 115, y: 195 }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem' }}>Visualizador del Algoritmo</h2>
        <p>Aprenda cómo funciona internamente la biometría y las redes neuronales convolucionales faciales.</p>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
        
        {/* Navigation tabs */}
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', height: 'fit-content' }}>
          <button 
            className={`nav-item ${activeStep === 1 ? 'active' : ''}`}
            onClick={() => setActiveStep(1)}
            style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left' }}
          >
            <Eye size={16} /> 1. Detección (SSD)
          </button>
          
          <button 
            className={`nav-item ${activeStep === 2 ? 'active' : ''}`}
            onClick={() => setActiveStep(2)}
            style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left' }}
          >
            <GitCommit size={16} /> 2. Landmarks 68
          </button>

          <button 
            className={`nav-item ${activeStep === 3 ? 'active' : ''}`}
            onClick={() => setActiveStep(3)}
            style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left' }}
          >
            <Layers size={16} /> 3. Embedding (128-d)
          </button>

          <button 
            className={`nav-item ${activeStep === 4 ? 'active' : ''}`}
            onClick={() => setActiveStep(4)}
            style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left' }}
          >
            <Fingerprint size={16} /> 4. Distancia Euclídea
          </button>
        </div>

        {/* Content details based on active step */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          {activeStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.4s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="badge badge-primary" style={{ padding: '0.4rem' }}><Eye size={18} /></span>
                <h3 style={{ fontSize: '1.4rem' }}>Paso 1: Detección del Rostro (Bounding Box)</h3>
              </div>
              <p>
                Antes de reconocer un rostro, el software debe encontrarlo en la imagen. Rekognition utiliza la red <strong>SSD (Single Shot MultiBox Detector)</strong> con una red base optimizada para móviles llamada <strong>MobileNet V1</strong>.
              </p>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--secondary)' }}>¿Cómo funciona?</h4>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <li>La imagen de entrada se procesa a través de capas convolucionales que extraen mapas de características de diferente resolución.</li>
                  <li>El algoritmo evalúa miles de cajas de anclaje predefinidas (cajas candidatas) buscando patrones faciales comunes.</li>
                  <li>Calcula la probabilidad de que cada caja contenga una cara (puntuación de confianza) y ajusta sus coordenadas tridimensionales de frontera.</li>
                  <li><strong>Límite de Inferencia</strong>: Solo se procesan las detecciones con una confianza superior al 50% para mitigar falsos positivos.</li>
                </ul>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', animation: 'fadeIn 0.4s' }}>
              <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="badge badge-primary" style={{ padding: '0.4rem' }}><GitCommit size={18} /></span>
                  <h3 style={{ fontSize: '1.4rem' }}>Paso 2: Puntos de Referencia (68 Landmarks)</h3>
                </div>
                <p>
                  Una vez detectado el rostro, este puede estar ligeramente rotado, inclinado o con una perspectiva distorsionada. El extractor de <strong>landmarks de 68 puntos</strong> localiza regiones críticas.
                </p>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Alineación Geométrica</h4>
                  <p style={{ fontSize: '0.85rem' }}>
                    Utilizando la posición de los ojos y la nariz, el software realiza una transformación afín (rotación, traslación y escalado) para centrar y alinear horizontalmente el rostro antes de enviarlo al reconocedor. Esto previene pérdidas de precisión por inclinación facial (pose roll).
                  </p>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  * Pase el cursor sobre los nodos del rostro interactivo de la derecha para ver los identificadores faciales oficiales.
                </p>
              </div>

              {/* Interactive Face Grid SVG */}
              <div style={{ 
                width: '260px', 
                height: '260px', 
                background: '#090c15', 
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative'
              }}>
                <svg width="240" height="240" viewBox="0 0 280 240">
                  {/* Draw contour lines connecting nodes to look like a mesh */}
                  <path d="M 50 120 Q 95 205 130 220 Q 165 220 240 120" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
                  <path d="M 85 100 L 105 100 L 130 90 L 155 105 L 175 100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
                  <path d="M 95 185 Q 130 196 165 185" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
                  
                  {facePoints.map((pt) => (
                    <circle
                      key={pt.id}
                      cx={pt.x}
                      cy={pt.y}
                      r={hoveredLandmark === pt.id ? 6 : 4}
                      fill={hoveredLandmark === pt.id ? 'var(--secondary)' : 'var(--primary)'}
                      style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                      onMouseEnter={() => setHoveredLandmark(pt.id)}
                      onMouseLeave={() => setHoveredLandmark(null)}
                    />
                  ))}
                </svg>
                {hoveredLandmark !== null && (
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-glass)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    Punto Landmark #{hoveredLandmark}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.4s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="badge badge-primary" style={{ padding: '0.4rem' }}><Layers size={18} /></span>
                <h3 style={{ fontSize: '1.4rem' }}>Paso 3: Red de Embeddings (Representación Espacial)</h3>
              </div>
              <p>
                Una vez alineado el rostro, se procesa en una red neuronal profunda tipo <strong>ResNet (Red Residual)</strong> entrenada con millones de rostros. Su salida no es una clase ("Persona A" o "Persona B"), sino un <strong>vector descriptor de 128 dimensiones</strong>.
              </p>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--secondary)' }}>¿Qué es un vector embedding?</h4>
                <p style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  Es una firma digital numérica de 128 números de punto flotante que condensa las características geométricas esenciales del rostro, independientemente de variaciones de luz o edad.
                </p>
                <div style={{ background: '#090c15', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.03)' }}>
                  [ -0.1148, 0.0824, -0.0152, 0.1245, ..., -0.0632, 0.1581 ] (128 flotantes)
                </div>
              </div>
              <p style={{ fontSize: '0.875rem' }}>
                <strong>Pérdida de Triplete (Triplet Loss)</strong>: La red se entrena para que la distancia vectorial entre rostros de la misma persona sea mínima (cercana a 0), y la distancia entre rostros de diferentes personas sea muy grande (cercana a 1.0).
              </p>
            </div>
          )}

          {activeStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.4s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="badge badge-primary" style={{ padding: '0.4rem' }}><Fingerprint size={18} /></span>
                <h3 style={{ fontSize: '1.4rem' }}>Paso 4: Distancia Euclídea (Comparación Matemática)</h3>
              </div>
              <p>
                Para autenticar, el software compara el vector descriptor del rostro actual (V<sub>1</sub>) con el vector de referencia guardado del usuario registrado (V<sub>2</sub>) mediante la <strong>distancia euclídea</strong>.
              </p>
              
              <div className="grid-2" style={{ gap: '1.25rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Ecuación Matemática</h4>
                  <div style={{ padding: '0.5rem', background: '#090c15', borderRadius: 'var(--radius-sm)', textAlign: 'center', fontFamily: 'monospace', fontSize: '1.05rem', fontWeight: 600 }}>
                    d = √ Σ (V<sub>1,i</sub> - V<sub>2,i</sub>)<sup>2</sup>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Calcula la raíz cuadrada de la suma de las diferencias al cuadrado de cada uno de los 128 componentes vectoriales.
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--success)' }}>Criterio de Decisión</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Si la distancia <strong>d ≤ Umbral (ej: 0.60)</strong>, los rostros corresponden a la <strong>misma identidad</strong> (Acceso Concedido).
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Si la distancia <strong>d &gt; Umbral</strong>, los rostros corresponden a <strong>diferentes identidades</strong> (Acceso Denegado).
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

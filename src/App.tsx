import { useState } from 'react';
import { ModelLoader } from './components/ModelLoader';
import { LiveVerification } from './components/LiveVerification';
import { BatchEvaluation } from './components/BatchEvaluation';
import { AlgorithmVisualizer } from './components/AlgorithmVisualizer';
import { 
  Fingerprint, 
  Camera, 
  FolderLock, 
  HelpCircle, 
  Info, 
  Cpu, 
  ShieldCheck, 
  Smartphone,
  BookOpen
} from 'lucide-react';

type Tab = 'dashboard' | 'live' | 'batch' | 'visualizer' | 'theory';

export default function App() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [registeredDescriptor, setRegisteredDescriptor] = useState<Float32Array | null>(null);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            color: 'white',
            padding: '0.5rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Fingerprint size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Rekognition</h2>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Biometrics Lab</span>
          </div>
        </div>

        <nav>
          <ul className="nav-menu">
            <li>
              <button 
                onClick={() => setActiveTab('dashboard')} 
                className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left' }}
              >
                <Cpu size={18} /> Resumen General
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('live')} 
                className={`nav-item ${activeTab === 'live' ? 'active' : ''}`}
                style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left' }}
              >
                <Camera size={18} /> Verificación en Vivo
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('batch')} 
                className={`nav-item ${activeTab === 'batch' ? 'active' : ''}`}
                style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left' }}
              >
                <FolderLock size={18} /> Pruebas por Lotes
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('visualizer')} 
                className={`nav-item ${activeTab === 'visualizer' ? 'active' : ''}`}
                style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left' }}
              >
                <HelpCircle size={18} /> Cómo Funciona
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('theory')} 
                className={`nav-item ${activeTab === 'theory' ? 'active' : ''}`}
                style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left' }}
              >
                <BookOpen size={18} /> Apuntes Teóricos
              </button>
            </li>
          </ul>
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Modelos IA:</span>
            {modelsLoaded ? (
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>Cargados</span>
            ) : (
              <span style={{ color: 'var(--warning)', fontWeight: 600 }}>Cargando...</span>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Usuario base:</span>
            {registeredDescriptor ? (
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Registrado</span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>Ninguno</span>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {!modelsLoaded ? (
          <ModelLoader onLoaded={() => setModelsLoaded(true)} />
        ) : (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            
            {/* View 1: Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div>
                  <h1>Rekognition Biometrics Lab</h1>
                  <p>Mecanismo interactivo de identificación digital y auditoría de redes neuronales convolucionales faciales.</p>
                </div>

                <div className="grid-2">
                  <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ color: 'var(--primary)', background: 'var(--primary-glow)', width: 'fit-content', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                      <Camera size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.3rem' }}>1. Verificación Facial en Vivo</h3>
                    <p style={{ fontSize: '0.9rem' }}>
                      Pruebe la precisión del algoritmo en vivo. Registre una firma facial única de 128 descriptores y pruebe la verificación biométrica con landmarks tridimensionales superpuestos.
                    </p>
                    <button className="btn btn-primary" onClick={() => setActiveTab('live')} style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                      Iniciar Captura
                    </button>
                  </div>

                  <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ color: 'var(--secondary)', background: 'var(--secondary-glow)', width: 'fit-content', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                      <FolderLock size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.3rem' }}>2. Evaluación y Auditoría por Lotes</h3>
                    <p style={{ fontSize: '0.9rem' }}>
                      Suba un conjunto de fotos (30 del usuario autorizado y 30 de suplantación) para calcular automáticamente métricas de biometría: FAR, FRR, Precisión, Sensibilidad y Curva ROC interactiva.
                    </p>
                    <button className="btn btn-secondary" onClick={() => setActiveTab('batch')} style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                      Cargar Archivos
                    </button>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={20} style={{ color: 'var(--success)' }} /> Seguridad y Privacidad Absoluta (Zero-Cloud)
                  </h3>
                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    Este software se ejecuta localmente. Toda la inferencia de las redes neuronales artificiales convolucionales y el cálculo de distancias vectoriales ocurren dentro del motor de JavaScript de su navegador de manera offline.
                  </p>
                  <p style={{ fontSize: '0.9rem' }}>
                    <strong>Ninguna imagen, rostro o descriptor facial es subido a internet o almacenado en disco.</strong> Al recargar la página o cerrar la pestaña, los descriptores faciales se destruyen de la memoria RAM automáticamente.
                  </p>
                </div>
              </div>
            )}

            {/* View 2: Live Verification */}
            {activeTab === 'live' && (
              <LiveVerification 
                registeredDescriptor={registeredDescriptor}
                setRegisteredDescriptor={setRegisteredDescriptor}
              />
            )}

            {/* View 3: Batch Evaluation */}
            {activeTab === 'batch' && (
              <BatchEvaluation registeredDescriptor={registeredDescriptor} />
            )}

            {/* View 4: How it works visualizer */}
            {activeTab === 'visualizer' && (
              <AlgorithmVisualizer />
            )}

            {/* View 5: Theoretical Notes */}
            {activeTab === 'theory' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div>
                  <h1>Apuntes Teóricos y Respuestas Técnicas</h1>
                  <p>Factores externos, vulnerabilidades, mitigaciones y arquitectura móvil del reconocimiento facial.</p>
                </div>

                <div className="grid-2">
                  <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)' }}>
                      <Info size={16} /> Factores Externos Críticos
                    </h3>
                    <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <li><strong>Iluminación (Lux/Sombras)</strong>: La luz tenue o sombras marcadas desalinean los landmarks.</li>
                      <li><strong>Ángulo y Pose</strong>: Rotaciones extremas de la cara (yaw/pitch/roll) reducen la visibilidad de puntos clave.</li>
                      <li><strong>Oclusión</strong>: Gafas, mascarillas, bufandas o cabello largo bloquean regiones faciales críticas.</li>
                      <li><strong>Envejecimiento Biológico</strong>: Cambios tisulares que degradan las distancias euclídeas a lo largo de los años.</li>
                      <li><strong>Calidad del Sensor</strong>: El ruido de cámara de baja resolución altera los vectores de características.</li>
                    </ul>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                      <Smartphone size={16} /> Justificación en Dispositivos Móviles
                    </h3>
                    <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <li><strong>Conveniencia del Usuario</strong>: Desbloqueo instantáneo con fricción cero (FaceID/Face Unlock).</li>
                      <li><strong>Procesamiento en Enclaves Seguros</strong>: Los teléfonos modernos delegan el reconocimiento a hardware criptográfico aislado (Secure Enclave o ARM TrustZone TEE).</li>
                      <li><strong>Mitigación de Spoofing Físico</strong>: Cámaras móviles 3D (TrueDepth) usan proyectores infrarrojos para crear mapas de profundidad tridimensional, invalidando fotos impresas o pantallas.</li>
                    </ul>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                    Mitigaciones contra Ataques de Suplantación (Spoofing)
                  </h3>
                  <p style={{ fontSize: '0.85rem' }}>
                    Los sistemas basados en imágenes de cámara web 2D son inherentemente vulnerables a ataques sencillos con fotos impresas en papel o pantallas de teléfonos móviles. Para mejorar su resiliencia, en producción se deben incorporar:
                  </p>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <li><strong>Detección de Vitalidad Activa (Active Liveness)</strong>: Obliga al usuario a realizar micro-desafíos aleatorios en tiempo real: parpadear, sonreír, girar la cabeza o seguir un punto con la mirada.</li>
                    <li><strong>Detección de Vitalidad Pasiva (Passive Liveness)</strong>: Redes neuronales secundarias entrenadas para detectar texturas artificiales (papel vs piel), reflejos de pantallas móviles o distorsión de flujo óptico 2D.</li>
                    <li><strong>Hardware Multiespectral</strong>: Sensores infrarrojos y de tiempo de vuelo (ToF) que miden calor facial real e imperfecciones en 3D.</li>
                  </ul>
                </div>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}

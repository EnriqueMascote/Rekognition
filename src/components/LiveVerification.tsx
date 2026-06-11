import { useRef, useState, useEffect } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Camera, UserCheck, ShieldAlert, Sparkles, UserX, Info } from 'lucide-react';

interface LiveVerificationProps {
  registeredDescriptor: Float32Array | null;
  setRegisteredDescriptor: (desc: Float32Array | null) => void;
}

export const LiveVerification: React.FC<LiveVerificationProps> = ({
  registeredDescriptor,
  setRegisteredDescriptor
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [statusText, setStatusText] = useState('Active la cámara para comenzar');
  const [matchStatus, setMatchStatus] = useState<'idle' | 'matched' | 'no-match' | 'no-face'>('idle');
  const [currentDistance, setCurrentDistance] = useState<number | null>(null);
  const [threshold, setThreshold] = useState(0.6); // Default standard
  const [registeredPhoto, setRegisteredPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Stop camera stream helper
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
    setStatusText('Cámara apagada');
    setMatchStatus('idle');
  };

  // Start camera stream
  const startCamera = async () => {
    try {
      setStatusText('Solicitando acceso a la cámara...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCameraActive(true);
        setStatusText('Analizando flujo de video en vivo...');
      } else {
        // Detener flujo si el componente se desmontó mientras se aceptaba el permiso
        mediaStream.getTracks().forEach(track => track.stop());
      }
    } catch (err) {
      console.error('Error al iniciar la cámara:', err);
      setStatusText('Error: No se pudo acceder a la webcam. Verifique los permisos.');
    }
  };

  // Handle live detection loop
  useEffect(() => {
    let active = true;
    let detectionInterval: any;

    const runDetection = async () => {
      if (!cameraActive || !videoRef.current || !canvasRef.current || !active) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Ensure video is playing and metadata is loaded
      if (video.paused || video.ended || video.readyState < 2) return;

      // Extract face dimensions
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      
      // Resize canvas to match video
      if (canvas.width !== displaySize.width || canvas.height !== displaySize.height) {
        canvas.width = displaySize.width;
        canvas.height = displaySize.height;
      }
      
      const detections = await faceapi
        .detectSingleFace(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!active) return;

      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detections) {
        // Match dimensions
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        // Draw bounding box and landmarks
        ctx!.lineWidth = 2;
        ctx!.strokeStyle = registeredDescriptor ? '#06b6d4' : '#6366f1';
        
        // Draw customizable landmarks overlay
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        
        const box = resizedDetections.detection.box;
        ctx!.strokeRect(box.x, box.y, box.width, box.height);

        // Perform validation if descriptor is registered
        if (registeredDescriptor && resizedDetections.descriptor) {
          const distance = faceapi.euclideanDistance(
            resizedDetections.descriptor,
            registeredDescriptor
          );
          
          setCurrentDistance(distance);
          if (distance <= threshold) {
            setMatchStatus('matched');
            // Draw matching box green
            ctx!.strokeStyle = '#10b981';
            ctx!.fillStyle = 'rgba(16, 185, 129, 0.15)';
            ctx!.fillRect(box.x, box.y, box.width, box.height);
          } else {
            setMatchStatus('no-match');
            // Draw matching box red
            ctx!.strokeStyle = '#ef4444';
            ctx!.fillStyle = 'rgba(239, 68, 68, 0.15)';
            ctx!.fillRect(box.x, box.y, box.width, box.height);
          }
        } else {
          setMatchStatus('idle');
          setCurrentDistance(null);
        }
      } else {
        setMatchStatus('no-face');
        setCurrentDistance(null);
      }
    };

    if (cameraActive) {
      detectionInterval = setInterval(runDetection, 120); // 8-10 FPS loops to keep CPU chill
    }

    return () => {
      active = false;
      if (detectionInterval) clearInterval(detectionInterval);
    };
  }, [cameraActive, registeredDescriptor, threshold]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Register Current Face
  const registerFace = async () => {
    if (!videoRef.current || isProcessing) return;
    setIsProcessing(true);
    setStatusText('Capturando datos biométricos...');

    try {
      const video = videoRef.current;
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.6 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        // Save descriptor
        setRegisteredDescriptor(detection.descriptor);
        
        // Take video screenshot for UI registered photo display
        const canvasSnapshot = document.createElement('canvas');
        canvasSnapshot.width = video.videoWidth;
        canvasSnapshot.height = video.videoHeight;
        const ctx = canvasSnapshot.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
          setRegisteredPhoto(canvasSnapshot.toDataURL('image/jpeg'));
        }
        
        setStatusText('✓ Rostro registrado con éxito en memoria.');
      } else {
        setStatusText('✗ Error: No se detecta ningún rostro en el encuadre.');
      }
    } catch (err) {
      console.error(err);
      setStatusText('Error al procesar la captura.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearRegistry = () => {
    setRegisteredDescriptor(null);
    setRegisteredPhoto(null);
    setCurrentDistance(null);
    setMatchStatus('idle');
    setStatusText('Registro biométrico borrado.');
  };

  const similarityPercentage = currentDistance !== null 
    ? Math.max(0, Math.round((1 - currentDistance) * 100)) 
    : 0;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem' }}>Verificación Biométrica</h2>
          <p>Pruebe el reconocimiento facial en tiempo real usando su cámara web.</p>
        </div>
        <div>
          {cameraActive ? (
            <button className="btn btn-secondary" onClick={stopCamera}>
              Apagar Cámara
            </button>
          ) : (
            <button className="btn btn-primary" onClick={startCamera}>
              <Camera size={18} /> Encender Cámara
            </button>
          )}
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: Webcam Scanner */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            maxWidth: '540px', 
            aspectRatio: '4/3', 
            background: '#090c15', 
            borderRadius: 'var(--radius-sm)', 
            overflow: 'hidden',
            border: '1px solid var(--border-glass)',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)'
          }}>
            {!cameraActive && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                color: 'var(--text-muted)'
              }}>
                <Camera size={48} style={{ opacity: 0.2 }} />
                <span style={{ fontSize: '0.875rem' }}>Haga clic en "Encender Cámara" para activar la webcam</span>
              </div>
            )}
            
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: cameraActive ? 'block' : 'none'
              }}
            />
            
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                display: cameraActive ? 'block' : 'none'
              }}
            />

            {/* Scanning Laser Line effect */}
            {cameraActive && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '2px',
                background: 'linear-gradient(to right, transparent, var(--secondary), transparent)',
                boxShadow: '0 0 10px var(--secondary)',
                animation: 'pulse-glow 2s infinite ease-in-out',
                opacity: 0.7,
                pointerEvents: 'none'
              }} />
            )}
          </div>
          
          <div style={{ 
            marginTop: '1.25rem', 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            fontSize: '0.85rem'
          }}>
            <span style={{ color: 'var(--text-secondary)' }}>{statusText}</span>
            {cameraActive && (
              <button 
                className="btn btn-primary" 
                onClick={registerFace}
                disabled={isProcessing}
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              >
                <Sparkles size={14} /> Registrar Rostro
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Registry and Validation Results */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Identidad Registrada</h3>
            {registeredPhoto ? (
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <img 
                  src={registeredPhoto} 
                  alt="Registered" 
                  style={{ 
                    width: '90px', 
                    height: '90px', 
                    borderRadius: 'var(--radius-sm)', 
                    objectFit: 'cover', 
                    border: '2px solid var(--primary)' 
                  }} 
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span className="badge badge-success" style={{ alignSelf: 'flex-start' }}>Usuario Autorizado</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Vector embedding: 128 flotantes almacenados localmente en RAM.
                  </p>
                  <button 
                    onClick={clearRegistry}
                    style={{ 
                      alignSelf: 'flex-start',
                      background: 'transparent', 
                      border: 'none', 
                      color: 'var(--danger)', 
                      fontSize: '0.75rem', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <UserX size={12} /> Borrar Registro
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ 
                border: '1px dashed var(--border-glass)', 
                borderRadius: 'var(--radius-sm)', 
                padding: '1.5rem', 
                textAlign: 'center', 
                color: 'var(--text-muted)',
                fontSize: '0.85rem' 
              }}>
                Ningún rostro registrado. Apunte su rostro a la cámara y haga clic en "Registrar Rostro".
              </div>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Estado de Coincidencia</h3>
              {matchStatus === 'matched' && <span className="badge badge-success"><UserCheck size={12} /> Acceso Concedido</span>}
              {matchStatus === 'no-match' && <span className="badge badge-danger"><ShieldAlert size={12} /> Acceso Denegado</span>}
              {matchStatus === 'no-face' && <span className="badge badge-warning">Buscando Rostro...</span>}
              {matchStatus === 'idle' && <span className="badge badge-primary">Esperando Registro</span>}
            </div>

            {registeredDescriptor ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    <span>Similitud:</span>
                    <strong style={{ color: matchStatus === 'matched' ? 'var(--success)' : 'var(--danger)' }}>
                      {currentDistance !== null ? `${similarityPercentage}%` : 'N/A'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span>Distancia Euclídea:</span>
                    <strong style={{ fontFamily: 'monospace' }}>
                      {currentDistance !== null ? currentDistance.toFixed(4) : 'N/A'}
                    </strong>
                  </div>
                </div>

                {/* Threshold tuning */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Umbral de Tolerancia: 
                      <span style={{ color: 'var(--text-muted)', cursor: 'help' }} title="Umbral de aceptación (distancia euclídea máxima). Menor valor = más estricto.">
                        <Info size={12} />
                      </span>
                    </span>
                    <strong>{threshold.toFixed(2)}</strong>
                  </div>
                  <input 
                    type="range" 
                    min="0.2" 
                    max="0.8" 
                    step="0.05"
                    value={threshold} 
                    onChange={(e) => setThreshold(parseFloat(e.target.value))}
                    className="custom-slider"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    <span>Estricto (Alta Seguridad)</span>
                    <span>Laxó (Fácil Acceso)</span>
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Registre una identidad para activar el motor de emparejamiento biométrico en vivo.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

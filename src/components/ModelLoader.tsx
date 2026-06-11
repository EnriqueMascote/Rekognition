import React, { useEffect, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Cpu, ShieldCheck, AlertTriangle } from 'lucide-react';

interface ModelLoaderProps {
  onLoaded: () => void;
}

export const ModelLoader: React.FC<ModelLoaderProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingSource, setLoadingSource] = useState<'local' | 'cdn'>('local');

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        if (!active) return;
        setStatus('loading');
        setProgress(15);
        setLoadingSource('local');

        try {
          // Attempt local load
          await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
          if (!active) return;
          setProgress(45);
          
          await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
          if (!active) return;
          setProgress(75);
          
          await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
          if (!active) return;
          setProgress(100);
        } catch (localErr) {
          console.warn('Local models failed to load, falling back to public CDN...', localErr);
          if (!active) return;
          setLoadingSource('cdn');
          setProgress(20);
          
          const CDN_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
          
          await faceapi.nets.ssdMobilenetv1.loadFromUri(CDN_URL);
          if (!active) return;
          setProgress(50);
          
          await faceapi.nets.faceLandmark68Net.loadFromUri(CDN_URL);
          if (!active) return;
          setProgress(80);
          
          await faceapi.nets.faceRecognitionNet.loadFromUri(CDN_URL);
          if (!active) return;
          setProgress(100);
        }

        if (active) {
          setStatus('success');
          // Small delay for satisfying completion animation
          setTimeout(() => {
            onLoaded();
          }, 800);
        }
      } catch (err: any) {
        console.error('Fatal error loading face recognition models:', err);
        if (active) {
          setStatus('error');
          setErrorMsg(err?.message || 'Error al descargar o compilar los pesos del modelo.');
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [onLoaded]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      maxWidth: '500px',
      margin: '0 auto',
      animation: 'fadeIn 0.6s ease'
    }}>
      <div className="glass-panel" style={{
        padding: '2.5rem',
        width: '100%',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background pulse */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 60%)',
          animation: 'pulse-glow 4s infinite ease-in-out',
          zIndex: 0,
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--primary)',
            marginBottom: '1.5rem',
            animation: status === 'loading' ? 'float 3s infinite ease-in-out' : 'none'
          }}>
            {status === 'error' ? (
              <AlertTriangle size={36} className="text-danger" style={{ color: 'var(--danger)' }} />
            ) : status === 'success' ? (
              <ShieldCheck size={36} className="text-success" style={{ color: 'var(--success)' }} />
            ) : (
              <Cpu size={36} />
            )}
          </div>

          <h2 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>
            {status === 'error' && 'Error de Inicialización'}
            {status === 'success' && 'Motores Listos'}
            {status === 'loading' && 'Inicializando Redes Neuronales'}
          </h2>

          <p style={{ fontSize: '0.875rem', marginBottom: '2rem' }}>
            {status === 'error' && 'No se pudieron inicializar los modelos. Verifique su conexión.'}
            {status === 'success' && '¡Los pesos de las redes convolucionales se han cargado en GPU!'}
            {status === 'loading' && (
              loadingSource === 'local' 
                ? 'Cargando modelos faciales locales en memoria GPU...' 
                : 'Descargando modelos desde el CDN de respaldo (jsDelivr)...'
            )}
          </p>

          {status === 'loading' && (
            <div style={{ width: '100%', marginBottom: '0.5rem' }}>
              <div style={{
                height: '6px',
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '0.5rem'
              }}>
                <span>Progreso: {progress}%</span>
                <span>Inferencia Local: WebGL/WebGPU</span>
              </div>
            </div>
          )}

          {status === 'success' && (
            <span className="badge badge-success">Listos para inferencia</span>
          )}

          {status === 'error' && (
            <div style={{ textAlign: 'left', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)', overflowX: 'auto', marginBottom: '1rem' }}>
              <code>{errorMsg}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

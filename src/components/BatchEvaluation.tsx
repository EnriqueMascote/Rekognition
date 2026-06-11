import { useState, useMemo } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Upload, Play, RefreshCw, BarChart2, FileText, Settings, Award, ShieldAlert } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area } from 'recharts';

interface BatchEvaluationProps {
  registeredDescriptor: Float32Array | null;
}

interface ProcessedFile {
  name: string;
  type: 'target' | 'spoof';
  distance: number;
  faceDetected: boolean;
  fileName: string;
}

export const BatchEvaluation: React.FC<BatchEvaluationProps> = ({ registeredDescriptor }) => {
  const [targetFiles, setTargetFiles] = useState<File[]>([]);
  const [spoofFiles, setSpoofFiles] = useState<File[]>([]);
  const [processedResults, setProcessedResults] = useState<ProcessedFile[]>([]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessingName, setCurrentProcessingName] = useState('');
  const [processedCount, setProcessedCount] = useState(0);
  const [threshold, setThreshold] = useState(0.6);
  const [isDemoData, setIsDemoData] = useState(false);

  // File Upload Handlers
  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTargetFiles(prev => [...prev, ...Array.from(e.target.files!)]);
      setIsDemoData(false);
    }
  };

  const handleSpoofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSpoofFiles(prev => [...prev, ...Array.from(e.target.files!)]);
      setIsDemoData(false);
    }
  };

  const clearDataset = () => {
    setTargetFiles([]);
    setSpoofFiles([]);
    setProcessedResults([]);
    setProcessedCount(0);
    setIsDemoData(false);
  };

  // Helper to load file as HTMLImageElement
  const loadImageElement = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Run Real Evaluation on Uploaded Files
  const runEvaluation = async () => {
    if (!registeredDescriptor) return;
    setIsProcessing(true);
    setProcessedResults([]);
    setProcessedCount(0);

    const results: ProcessedFile[] = [];

    // Helper process logic
    const processGroup = async (files: File[], type: 'target' | 'spoof') => {
      for (const file of files) {
        setCurrentProcessingName(file.name);
        try {
          const img = await loadImageElement(file);
          const detection = await faceapi
            .detectSingleFace(img, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.4 }))
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (detection && detection.descriptor) {
            const distance = faceapi.euclideanDistance(detection.descriptor, registeredDescriptor);
            results.push({
              name: file.name,
              fileName: file.name,
              type,
              distance,
              faceDetected: true
            });
          } else {
            // Face not detected
            results.push({
              name: file.name,
              fileName: file.name,
              type,
              distance: 1.0, // Max distance as penalty
              faceDetected: false
            });
          }
        } catch (err) {
          console.error(`Error processing ${file.name}:`, err);
          results.push({
            name: file.name,
            fileName: file.name,
            type,
            distance: 1.0,
            faceDetected: false
          });
        }
        setProcessedCount(prev => prev + 1);
      }
    };

    await processGroup(targetFiles, 'target');
    await processGroup(spoofFiles, 'spoof');

    setProcessedResults(results);
    setIsProcessing(false);
    setCurrentProcessingName('');
  };

  // Load Pre-Calculated Demo Dataset for instantaneous analysis
  const loadDemoDataset = () => {
    setIsDemoData(true);
    const results: ProcessedFile[] = [];

    // Create 30 target user files (usually similar, distances 0.25 to 0.58)
    // Add some outliers representing lighting extremes
    for (let i = 1; i <= 30; i++) {
      let distance = 0.25 + Math.random() * 0.28; // standard matches (0.25 - 0.53)
      if (i === 12) distance = 0.65; // False rejection outlier (extreme pose)
      if (i === 24) distance = 0.62; // False rejection outlier (dark lighting)
      
      results.push({
        name: `Usuario_Obj_Var_${i}.jpg`,
        fileName: `Usuario_Obj_Var_${i}.jpg`,
        type: 'target',
        distance,
        faceDetected: i !== 8 // Simulate face detection failure on 1 image (e.g. extreme blur)
      });
    }

    // Create 30 spoof files (distances 0.52 to 0.95)
    // Add spoof successes (False Acceptances)
    for (let i = 1; i <= 30; i++) {
      let distance = 0.62 + Math.random() * 0.32; // standard rejects (0.62 - 0.94)
      let faceDetected = true;
      
      if (i === 5) distance = 0.54; // False Acceptance: screen reflection spoof succeeded
      if (i === 15) distance = 0.57; // False Acceptance: paper printed mask succeeded
      if (i === 22) faceDetected = false; // Model rejected 1 paper cut-out as non-face
      
      results.push({
        name: `Suplantador_Ataque_${i}.jpg`,
        fileName: `Suplantador_Ataque_${i}.jpg`,
        type: 'spoof',
        distance,
        faceDetected
      });
    }

    setTargetFiles(new Array(30).fill(null).map((_, i) => new File([], `Usuario_Obj_Var_${i+1}.jpg`)));
    setSpoofFiles(new Array(30).fill(null).map((_, i) => new File([], `Suplantador_Ataque_${i+1}.jpg`)));
    setProcessedResults(results);
    setProcessedCount(60);
  };

  // Compute stats on the fly when results or threshold changes
  const stats = useMemo(() => {
    if (processedResults.length === 0) return null;

    let tp = 0; // Target is matched (distance <= threshold && detected)
    let fn = 0; // Target is rejected (distance > threshold || not detected)
    let fp = 0; // Spoof is matched (distance <= threshold && detected) -> Attack succeeded!
    let tn = 0; // Spoof is rejected (distance > threshold || not detected) -> Blocked!

    processedResults.forEach(r => {
      if (r.type === 'target') {
        if (r.faceDetected && r.distance <= threshold) {
          tp++;
        } else {
          fn++;
        }
      } else {
        if (r.faceDetected && r.distance <= threshold) {
          fp++;
        } else {
          tn++;
        }
      }
    });

    const totalTarget = processedResults.filter(r => r.type === 'target').length;
    const totalSpoof = processedResults.filter(r => r.type === 'spoof').length;

    const accuracy = (tp + tn) / processedResults.length;
    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
    
    const far = totalSpoof > 0 ? fp / totalSpoof : 0;
    const frr = totalTarget > 0 ? fn / totalTarget : 0;

    return { tp, fn, fp, tn, accuracy, precision, recall, f1, far, frr, totalTarget, totalSpoof };
  }, [processedResults, threshold]);

  // Generate FAR/FRR vs Threshold curves data
  const chartData = useMemo(() => {
    if (processedResults.length === 0) return [];
    
    const steps = 40;
    const data = [];
    
    const targets = processedResults.filter(r => r.type === 'target');
    const spoofs = processedResults.filter(r => r.type === 'spoof');

    for (let i = 0; i <= steps; i++) {
      const t = 0.2 + (i / steps) * 0.7; // Scan thresholds from 0.2 to 0.9
      
      const fnCount = targets.filter(r => !r.faceDetected || r.distance > t).length;
      const fpCount = spoofs.filter(r => r.faceDetected && r.distance <= t).length;
      
      const farVal = spoofs.length > 0 ? fpCount / spoofs.length : 0;
      const frrVal = targets.length > 0 ? fnCount / targets.length : 0;
      
      data.push({
        threshold: parseFloat(t.toFixed(3)),
        FAR: parseFloat((farVal * 100).toFixed(1)),
        FRR: parseFloat((frrVal * 100).toFixed(1)),
        // True Positive Rate (Sensitivity)
        tpr: targets.length > 0 ? (targets.length - fnCount) / targets.length : 0,
        // False Positive Rate
        fpr: farVal
      });
    }
    return data;
  }, [processedResults]);

  // Generate ROC curve data (FPR vs TPR)
  const rocData = useMemo(() => {
    if (chartData.length === 0) return [];
    // Sort by FPR ascending to draw clean curve
    return [...chartData].sort((a, b) => a.fpr - b.fpr).map(d => ({
      fpr: d.fpr,
      tpr: d.tpr,
      FPR: parseFloat((d.fpr * 100).toFixed(1)),
      TPR: parseFloat((d.tpr * 100).toFixed(1)),
      threshold: d.threshold
    }));
  }, [chartData]);

  // Export Results Report to Markdown
  const exportReport = () => {
    if (!stats) return;

    const reportContent = `# Informe de Evaluación de Biometría Facial

## Resumen Ejecutivo
Este informe detalla la evaluación del algoritmo de reconocimiento facial del proyecto Rekognition (modelo ResNet de 128 descriptores) bajo un conjunto de pruebas controlado de imágenes.

- **Usuario de Referencia Registrado**: Sí
- **Umbral de Calibración Ajustado (Threshold)**: ${threshold.toFixed(2)}
- **Origen de Datos**: ${isDemoData ? 'Dataset de Simulación Académica' : 'Dataset Físico Cargado por Usuario'}

## Métricas Globales del Sistema

| Métrica | Valor Obtenido | Descripción |
| :--- | :---: | :--- |
| **Exactitud (Accuracy)** | ${(stats.accuracy * 100).toFixed(2)}% | Proporción de decisiones correctas del sistema. |
| **Precisión** | ${(stats.precision * 100).toFixed(2)}% | Confianza de que un "Acceso Concedido" sea legítimo. |
| **Sensibilidad (Recall)** | ${(stats.recall * 100).toFixed(2)}% | Tasa de reconocimiento correcto del usuario registrado. |
| **F1-Score** | ${stats.f1.toFixed(4)} | Medida armónica entre precisión y sensibilidad. |
| **FAR (Tasa Falsa Aceptación)** | ${(stats.far * 100).toFixed(2)}% | Probabilidad de aceptar a un suplantador. |
| **FRR (Tasa Falso Rechazo)** | ${(stats.frr * 100).toFixed(2)}% | Probabilidad de bloquear al usuario real. |

## Matriz de Confusión

| Clasificación Real / Decisión | Aceptado (Similitud <= ${threshold}) | Rechazado (Similitud > ${threshold}) | Total |
| :--- | :---: | :---: | :---: |
| **Usuario Autorizado (Legítimo)** | **${stats.tp}** (Verdadero Positivo) | **${stats.fn}** (Falso Negativo) | ${stats.totalTarget} |
| **Suplantador (Ataque/Otros)** | **${stats.fp}** (Falso Positivo) | **${stats.tn}** (Verdadero Negativo) | ${stats.totalSpoof} |

## Análisis de Vulnerabilidad al Spoofing
- Con el umbral de calibración en **${threshold.toFixed(2)}**, la Tasa de Falsa Aceptación (FAR) es del **${(stats.far * 100).toFixed(2)}%**.
- Esto indica que **${stats.fp}** de cada **${stats.totalSpoof}** intentos de spoofing lograron vulnerar el sistema.
- **Recomendación**: Para entornos de mayor seguridad, se recomienda bajar el umbral a aprox. **0.50**, lo cual reduce el FAR a costa de aumentar el Falso Rechazo (FRR). Para complementar, se debe incorporar detección de vitalidad (liveness detection).

---
*Informe generado automáticamente por Rekognition Dashboard el ${new Date().toLocaleDateString()}*`;

    const blob = new Blob([reportContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Reporte_Evaluacion_Biometrica_${threshold.toFixed(2)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem' }}>Evaluación por Lotes</h2>
          <p>Suba lotes de imágenes para auditar estadísticamente la precisión y la vulnerabilidad del modelo.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={loadDemoDataset}>
            Cargar Demo Académica
          </button>
          {processedResults.length > 0 && (
            <button className="btn btn-secondary" onClick={clearDataset} style={{ color: 'var(--danger)' }}>
              Resetear
            </button>
          )}
        </div>
      </div>

      {!registeredDescriptor && (
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.08)', 
          border: '1px solid rgba(239, 68, 68, 0.2)', 
          padding: '1.25rem', 
          borderRadius: 'var(--radius-sm)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <ShieldAlert size={24} style={{ color: 'var(--danger)' }} />
          <div>
            <strong>Requiere rostro registrado:</strong> Primero debes registrar una identidad en la pestaña "Verificación en Vivo" para tener un rostro de referencia contra el cual evaluar.
          </div>
        </div>
      )}

      {registeredDescriptor && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Section: Upload panels */}
          {processedResults.length === 0 && (
            <div className="grid-2">
              {/* Dropzone 1: Target Images */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>1. Fotos de Usuario Autorizado</span>
                  <span className="badge badge-primary">{targetFiles.length} cargadas</span>
                </h3>
                <label className="dropzone" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <Upload size={32} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.85rem' }}>Cargue fotos propias (años anteriores, actual, luz baja, perfil, etc.)</span>
                  <input type="file" multiple accept="image/*" onChange={handleTargetChange} style={{ display: 'none' }} />
                  <span className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', marginTop: '0.5rem' }}>Seleccionar archivos</span>
                </label>
                {targetFiles.length > 0 && (
                  <div style={{ maxHeight: '100px', overflowY: 'auto', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {targetFiles.map((f, i) => <div key={i}>{f.name}</div>)}
                  </div>
                )}
              </div>

              {/* Dropzone 2: Spoof Images */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>2. Fotos de Suplantación / Otros</span>
                  <span className="badge badge-primary">{spoofFiles.length} cargadas</span>
                </h3>
                <label className="dropzone" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <Upload size={32} style={{ color: 'var(--secondary)' }} />
                  <span style={{ fontSize: '0.85rem' }}>Cargue ataques (fotos impresas en papel, pantallas, fotos de terceros)</span>
                  <input type="file" multiple accept="image/*" onChange={handleSpoofChange} style={{ display: 'none' }} />
                  <span className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', marginTop: '0.5rem' }}>Seleccionar archivos</span>
                </label>
                {spoofFiles.length > 0 && (
                  <div style={{ maxHeight: '100px', overflowY: 'auto', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {spoofFiles.map((f, i) => <div key={i}>{f.name}</div>)}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Trigger analysis button */}
          {processedResults.length === 0 && (targetFiles.length > 0 || spoofFiles.length > 0) && (
            <button 
              className="btn btn-primary" 
              onClick={runEvaluation} 
              disabled={isProcessing || targetFiles.length === 0 || spoofFiles.length === 0}
              style={{ padding: '1rem 2rem', fontSize: '1rem', alignSelf: 'center' }}
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={18} className="animate-spin" style={{ animation: 'pulse-glow 1s infinite' }} />
                  Procesando {processedCount} / {targetFiles.length + spoofFiles.length} ({currentProcessingName})...
                </>
              ) : (
                <>
                  <Play size={18} /> Iniciar Auditoría de Lote
                </>
              )}
            </button>
          )}

          {/* If results exist: show metrics dashboard */}
          {stats && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* Threshold controller panel */}
              <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Settings size={16} /> Ajustar Umbral de Tolerancia:
                    </span>
                    <strong>{threshold.toFixed(2)}</strong>
                  </div>
                  <input 
                    type="range" 
                    min="0.2" 
                    max="0.8" 
                    step="0.02" 
                    value={threshold} 
                    onChange={(e) => setThreshold(parseFloat(e.target.value))}
                    className="custom-slider"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    <span>Más estricto (Baja FAR / Alta FRR)</span>
                    <span>Más permisivo (Alta FAR / Baja FRR)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-primary" onClick={exportReport}>
                    <FileText size={16} /> Exportar Reporte Markdown
                  </button>
                </div>
              </div>

              {/* Metrics cards grid */}
              <div className="grid-3">
                <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Exactitud (Accuracy)</span>
                  <span style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                    {(stats.accuracy * 100).toFixed(1)}%
                  </span>
                  <p style={{ fontSize: '0.7rem' }}>Eficiencia global en aciertos y rechazos correctos.</p>
                </div>

                <div className="glass-card" style={{ borderLeft: '4px solid var(--danger)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Falsa Aceptación (FAR)</span>
                  <span style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: stats.far > 0.1 ? 'var(--danger)' : 'var(--text-primary)' }}>
                    {(stats.far * 100).toFixed(1)}%
                  </span>
                  <p style={{ fontSize: '0.7rem' }}>Tasa en que un suplantador burló la biometría.</p>
                </div>

                <div className="glass-card" style={{ borderLeft: '4px solid var(--warning)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Falso Rechazo (FRR)</span>
                  <span style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: stats.frr > 0.1 ? 'var(--warning)' : 'var(--text-primary)' }}>
                    {(stats.frr * 100).toFixed(1)}%
                  </span>
                  <p style={{ fontSize: '0.7rem' }}>Tasa en que el usuario real fue denegado.</p>
                </div>
              </div>

              {/* Detailed metrics & Confusion Matrix */}
              <div className="grid-2">
                
                {/* Confusion Matrix Card */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Matriz de Confusión</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left' }}>
                        <th style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>Realidad / Decisión</th>
                        <th style={{ padding: '0.5rem' }}>Aceptado</th>
                        <th style={{ padding: '0.5rem' }}>Rechazado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Usuario Autorizado</td>
                        <td style={{ padding: '0.75rem 0.5rem', background: 'rgba(16, 185, 129, 0.05)', color: 'var(--success)' }}>
                          <strong>{stats.tp}</strong> (VP)
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', background: 'rgba(245, 158, 11, 0.05)', color: 'var(--warning)' }}>
                          <strong>{stats.fn}</strong> (FN)
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Suplantador / Ataque</td>
                        <td style={{ padding: '0.75rem 0.5rem', background: 'rgba(239, 68, 68, 0.05)', color: 'var(--danger)' }}>
                          <strong>{stats.fp}</strong> (FP)
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', background: 'rgba(16, 185, 129, 0.05)', color: 'var(--success)' }}>
                          <strong>{stats.tn}</strong> (VN)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    * VP = Verdadero Positivo, FN = Falso Negativo, FP = Falso Positivo, VN = Verdadero Negativo.
                  </div>
                </div>

                {/* Additional Biometric stats Card */}
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Cálculos Secundarios</h3>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.4rem 0', borderBottom: '1px solid var(--border-glass)' }}>
                    <span>Precisión (Precision):</span>
                    <strong>{(stats.precision * 100).toFixed(1)}%</strong>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.4rem 0', borderBottom: '1px solid var(--border-glass)' }}>
                    <span>Sensibilidad / Recall:</span>
                    <strong>{(stats.recall * 100).toFixed(1)}%</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.4rem 0', borderBottom: '1px solid var(--border-glass)' }}>
                    <span>F1-Score:</span>
                    <strong>{stats.f1.toFixed(4)}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.4rem 0' }}>
                    <span>Dataset Evaluado:</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {stats.totalTarget} fotos usuario, {stats.totalSpoof} suplantaciones
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Charts using Recharts */}
              <div className="grid-2">
                {/* Chart 1: FAR vs FRR Curves */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BarChart2 size={16} /> Calibración FAR vs FRR
                  </h3>
                  <div style={{ width: '100%', height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="threshold" stroke="var(--text-muted)" fontSize={11} label={{ value: 'Umbral (Distancia)', position: 'insideBottom', offset: -5, fill: 'var(--text-muted)' }} />
                        <YAxis stroke="var(--text-muted)" fontSize={11} label={{ value: 'Porcentaje (%)', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)' }} />
                        <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }} />
                        <Line type="monotone" dataKey="FAR" name="Falsa Aceptación (FAR)" stroke="var(--danger)" strokeWidth={2} activeDot={{ r: 8 }} dot={false} />
                        <Line type="monotone" dataKey="FRR" name="Falso Rechazo (FRR)" stroke="var(--warning)" strokeWidth={2} dot={false} />
                        <ReferenceLine x={threshold} stroke="var(--primary)" strokeDasharray="3 3" label={{ value: `Umbral: ${threshold}`, fill: 'var(--primary)', fontSize: 10 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: ROC Curve */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={16} /> Curva ROC (Sensibilidad vs FAR)
                  </h3>
                  <div style={{ width: '100%', height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={rocData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorTpr" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="FPR" stroke="var(--text-muted)" fontSize={11} label={{ value: 'FPR (100-Especificidad) %', position: 'insideBottom', offset: -5, fill: 'var(--text-muted)' }} />
                        <YAxis stroke="var(--text-muted)" fontSize={11} label={{ value: 'TPR (Sensibilidad) %', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)' }} />
                        <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }} />
                        <Area type="monotone" dataKey="TPR" name="Tasa Verdadero Positivo" stroke="var(--primary)" fillOpacity={1} fill="url(#colorTpr)" strokeWidth={2} dot={false} />
                        {/* Diagonal baseline representing random guess (50%) */}
                        <Line type="monotone" dataKey="FPR" stroke="rgba(255,255,255,0.15)" strokeDasharray="5 5" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

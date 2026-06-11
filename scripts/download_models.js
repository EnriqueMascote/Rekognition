import fs from 'fs';
import path from 'path';
import https from 'https';

const MODELS_DIR = path.join(process.cwd(), 'public', 'models');
const BASE_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

const files = [
  'ssd_mobilenetv1_model-weights_manifest.json',
  'ssd_mobilenetv1_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1'
];

if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true });
}

function download(file) {
  const dest = path.join(MODELS_DIR, file);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 100) {
    console.log(`[Skip] ${file} ya existe.`);
    return Promise.resolve();
  }
  
  return new Promise((resolve, reject) => {
    console.log(`[Download] ${file}...`);
    const fileStream = fs.createWriteStream(dest);
    
    https.get(BASE_URL + file, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${file}: ${response.statusCode}`));
        return;
      }
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(` [OK] Guardado ${file}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  try {
    for (const file of files) {
      await download(file);
    }
    console.log('Todos los modelos descargados con éxito en public/models/');
  } catch (err) {
    console.error('Error descargando modelos:', err);
    process.exit(1);
  }
}

main();

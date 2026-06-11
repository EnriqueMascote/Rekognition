import os
import urllib.request

MODELS_DIR = os.path.join("public", "models")
BASE_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/"

files_to_download = [
    "ssd_mobilenetv1_model-weights_manifest.json",
    "ssd_mobilenetv1_model-shard1",
    "face_landmark_68_model-weights_manifest.json",
    "face_landmark_68_model-shard1",
    "face_recognition_model-weights_manifest.json",
    "face_recognition_model-shard1"
]

def download_file(file_name):
    url = BASE_URL + file_name
    dest_path = os.path.join(MODELS_DIR, file_name)
    print(f"Descargando {file_name}...")
    try:
        # User-Agent header to avoid blocking
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req) as response:
            with open(dest_path, 'wb') as out_file:
                out_file.write(response.read())
        print(f" [OK] Guardado en {dest_path}")
    except Exception as e:
        print(f" [ERROR] al descargar {file_name}: {e}")

def main():
    if not os.path.exists(MODELS_DIR):
        os.makedirs(MODELS_DIR)
        print(f"Creado directorio: {MODELS_DIR}")
    else:
        print(f"Directorio ya existe: {MODELS_DIR}")
    
    for file_name in files_to_download:
        download_file(file_name)
    print("Proceso de descarga completado.")

if __name__ == "__main__":
    main()

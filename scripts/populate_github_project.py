import subprocess

issues = [
    {
        "title": "Documentación de Plantilla y Estructura Inicial",
        "body": "Reemplazar los archivos Markdown de la plantilla (README.md, QUICKSTART.md, AGENTS.md y archivos de docs/) con los detalles reales del proyecto de reconocimiento facial 'Rekognition' y sus políticas."
    },
    {
        "title": "Inicialización del Entorno de Desarrollo y Vite React/TS",
        "body": "Configurar la estructura base del proyecto Frontend, package.json, TypeScript y configurar dependencias clave como `@vladmandic/face-api`, `recharts`, `lucide-react` y dependencias de UI."
    },
    {
        "title": "Descarga de Pesos de Modelos y Componente de Carga",
        "body": "Descargar y almacenar localmente en `public/models/` los pesos de los modelos pre-entrenados de face-api.js (SSD MobileNet V1, Landmarks 68 y Face Recognition). Implementar el componente de interfaz `ModelLoader` para carga asíncrona con feedback visual."
    },
    {
        "title": "Registro de Rostro y Verificación Facial en Vivo",
        "body": "Desarrollar la vista de webcam en vivo con superposición de puntos de referencia (68 landmarks). Permitir el registro de un rostro objetivo y su comparación en tiempo real, calculando la distancia euclídea y mostrando el porcentaje de similitud."
    },
    {
        "title": "Módulo de Evaluación de Rendimiento por Lotes",
        "body": "Implementar el panel de evaluación masiva donde el usuario pueda cargar interactivamente carpetas o conjuntos de imágenes del usuario objetivo (mínimo 30) y de spoofing/otros usuarios (mínimo 30). El sistema ejecutará el análisis por lotes y computará de forma automática Verdaderos Positivos, Falsos Negativos, Falsos Positivos, Verdaderos Negativos, Precisión, Sensibilidad, F1-Score, FAR y FRR."
    },
    {
        "title": "Visualizaciones Dinámicas de Umbral y Gráficos (ROC/FAR-FRR)",
        "body": "Desarrollar gráficos interactivos con Recharts que muestren la relación entre FAR y FRR en función del umbral de distancia. Graficar la curva ROC e incorporar un slider interactivo para ajustar el umbral y recalcular las métricas del sistema dinámicamente."
    }
]

def create_issue_and_add_to_project(issue):
    # Step 1: Create issue in repository
    create_cmd = [
        "gh", "issue", "create",
        "--title", issue["title"],
        "--body", issue["body"]
    ]
    print(f"Creando issue: {issue['title']}...")
    result = subprocess.run(create_cmd, capture_output=True, text=True, encoding="utf-8")
    
    if result.returncode != 0:
        print(f" [ERROR] creando issue en repo: {result.stderr.strip()}")
        return
    
    issue_url = result.stdout.strip()
    print(f" [OK] Creado: {issue_url}")
    
    # Step 2: Add issue to project 2
    add_cmd = [
        "gh", "project", "item-add", "2",
        "--owner", "EnriqueMascote",
        "--url", issue_url
    ]
    print(f" Agregando a Project Board #2...")
    add_result = subprocess.run(add_cmd, capture_output=True, text=True, encoding="utf-8")
    
    if add_result.returncode == 0:
        print(" [OK] Agregado a project board.")
    elif "Content already exists in this project" in add_result.stderr:
        print(" [INFO] El elemento ya existe en el project board (agregado automáticamente).")
    else:
        print(f" [ERROR] agregando a project board: {add_result.stderr.strip()}")

def main():
    print("Iniciando la creacion del Backlog restante en GitHub y Project Board...")
    for issue in issues:
        create_issue_and_add_to_project(issue)
    print("Proceso completado.")

if __name__ == "__main__":
    main()

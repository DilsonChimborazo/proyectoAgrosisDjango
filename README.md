# Agrosoft

Este proyecto tiene como objetivo implementar un sistema que permita medir variables agropecuarias en tiempo real mediante sensores, y llevar una trazabilidad completa de los datos recolectados en entornos productivos del área PAE (Producción Agropecuaria Ecológica).

## 🚀 Características

- 📡 Monitoreo en tiempo real de variables ambientales (humedad, temperatura, etc.).
- 📊 Registro histórico y trazabilidad de todos los datos capturados.
- 🌱 Enfoque específico para procesos de producción agropecuaria.
- 🔧 Interfaz intuitiva para consulta y análisis.
- ⚙️ Integración con sensores físicos mediante Arduino/ESP32.

## 🛠️ Tecnologías utilizadas

- ⚙️ Arduino / ESP32
- 🌐 Frontend: React.js / TypeScript / tailwind
- 🧠 Backend: Django 
- 🗃️ Base de datos: PostgreSQL / Firebase / MongoDB (ajustar según lo que uses)

## 📦 Requisitos

- Node.js
- Python 
- npm / pip
- Docker Desktop 
- Arduino IDE 
- Git

## ⚙️ Instalación

descarga el repositorio del proyecto en el siguiente enlace

https://github.com/DilsonChimborazo/proyectoAgrosisDjango.git

### cd proyectoAgrosisDjango


# 2. Instala dependencias (para trabajar localmente)
cd frontAgrosis
### crear archivo .env (con el siguiente contenido)
VITE_API_URL=http://back-end:8000/api/
VITE_WS_URL=ws://back-end:8000/ws/api/
VITE_WEATHER_API_KEY=d1eac6ff7d294b7d90c162117252605
VITE_GOOGLE_MAPS_API_KEY=d1eac6ff7d294b7d90c162117252605

--------------------------
npm install --legacy-peer-deps
-------------------------
cd back-end       
pip install -r requirements.txt  

# 3. Ejecuta el proyecto (para trabajar localmente)
npm run dev         
python manage.py runserver 0.0.0.0:8000


# 4. Crear los contenedores (para trabajar con los contenedores en docker)

### abre cmd en la raiz del proyecto
docker compose up --build -d



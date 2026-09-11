# 🤖 Nova Chat

> Chat web para conversar con Nova, un agente de IA construido desde cero con Google Gemini y FastAPI.

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-API-009688?style=flat&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

## 📖 Sobre el proyecto

**Nova Chat** es la evolución de [agente-gemini-desde-cero](https://github.com/ortiz10m/agente-gemini-desde-cero): un agente de IA que empezó como script de consola y ahora es una aplicación web completa con backend y frontend separados.

El proyecto demuestra cómo construir un producto real de IA desde cero:

- **Backend en FastAPI** que expone el agente Nova como API REST.
- **Frontend en Next.js** con una interfaz de chat moderna.
- **Comunicación cliente-servidor** vía HTTP con sesiones independientes por usuario.

## 🏗️ Arquitectura

```
┌─────────────────┐         ┌──────────────────┐
│                 │  HTTP   │                  │
│   FRONTEND      │ ◄─────► │   BACKEND        │
│   Next.js       │         │   FastAPI        │
│   localhost:3000│         │   localhost:8000 │
│                 │         │                  │
└─────────────────┘         └──────────────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │  Google Gemini   │
                            │  API             │
                            └──────────────────┘
```

## 📁 Estructura del proyecto

```
nova-chat/
├── backend/                  # API REST en FastAPI
│   ├── agente/               # Módulo del agente Nova
│   │   ├── __init__.py
│   │   ├── config.py         # Modelo y personalidad
│   │   ├── herramientas.py   # Herramientas (leer/listar archivos)
│   │   └── agente.py         # Lógica del agente
│   ├── main.py               # Servidor FastAPI
│   ├── requirements.txt      # Dependencias Python
│   └── .env                  # API key (NO se sube a GitHub)
└── frontend/                 # Interfaz en Next.js (próximamente)
```

## 🚀 Backend — Instalación y uso

```bash
# 1. Entrar al backend
cd backend

# 2. Crear entorno virtual
python -m venv venv

# 3. Activarlo
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 4. Instalar dependencias
pip install -r requirements.txt

# 5. Configurar la API key
# Crea un archivo .env con:
# GEMINI_API_KEY=tu_clave_aqui

# 6. Levantar el servidor
uvicorn main:app --reload
```

El servidor queda disponible en `http://localhost:8000`.

- Documentación interactiva: `http://localhost:8000/docs`
- Endpoint principal: `POST /chat`

## 🛠️ Tecnologías

**Backend:**
- Python 3.10+
- FastAPI — framework web
- Uvicorn — servidor ASGI
- google-genai — SDK oficial de Google Gemini
- python-dotenv — manejo de variables de entorno

**Frontend (en desarrollo):**
- Next.js 14+
- React
- TypeScript
- Tailwind CSS

## 🗺️ Roadmap

- [x] Backend con FastAPI
- [x] Endpoint `/chat` funcional
- [x] Sesiones independientes por usuario
- [x] Documentación automática con Swagger
- [ ] Frontend con Next.js
- [ ] Diseño brutal (dark mode, animaciones, markdown)
- [ ] Deploy (backend + frontend online)

## 🔑 Cómo obtener tu API key de Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crea una API key gratuita (no pide tarjeta)
3. Pégala en `backend/.env`

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.
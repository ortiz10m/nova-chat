# 🤖 Nova Chat

> Chat web para conversar con Nova, un agente de IA construido desde cero con Google Gemini y FastAPI.

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-API-009688?style=flat&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16+-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

## 🚀 Demo en vivo

**Prueba Nova Chat online:** [https://nova-chat-app-one.vercel.app](https://nova-chat-app-one.vercel.app)

## 📖 Sobre el proyecto

**Nova Chat** es la evolución de [agente-gemini-desde-cero](https://github.com/ortiz10m/agente-gemini-desde-cero): un agente de IA que empezó como script de consola y ahora es una aplicación web completa con backend y frontend separados, desplegada en producción.

El proyecto demuestra cómo construir un producto real de IA desde cero:

- **Backend en FastAPI** que expone el agente Nova como API REST.
- **Frontend en Next.js** con una interfaz de chat moderna tipo ChatGPT.
- **Comunicación cliente-servidor** vía HTTP con sesiones independientes por usuario.
- **Deploy en producción** con backend en Render y frontend en Vercel.

## 🏗️ Arquitectura

```
┌──────────────────────────────┐
│  USUARIO (navegador)         │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  FRONTEND (Vercel)           │
│  nova-chat-app-one.vercel.app│
└──────────────┬───────────────┘
               │ POST /chat
               ▼
┌──────────────────────────────┐
│  BACKEND (Render)            │
│  nova-chat-api-60wk.onrender │
└──────────────┬───────────────┘
               │
               ▼
        ┌─────────────┐
        │  GEMINI API │
        └─────────────┘
```

## ✨ Características

- 💬 **Chat con IA** en tiempo real
- 🎨 **Interfaz moderna** con tema oscuro tipo ChatGPT
- 📝 **Markdown renderizado** en las respuestas
- 🎯 **Syntax highlighting** para bloques de código
- 📚 **Múltiples conversaciones** con sidebar
- 💾 **Historial persistente** (localStorage)
- 📱 **Responsive** (desktop + móvil)
- 🔧 **Herramientas de agente**: leer archivos y listar directorios
- ⚡ **Reintentos automáticos** ante errores de red

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
├── frontend/                 # Interfaz en Next.js
│   ├── app/
│   │   ├── layout.tsx        # Estructura general
│   │   ├── page.tsx          # Página principal (chat)
│   │   ├── components.tsx    # Componentes de mensajes y markdown
│   │   ├── Sidebar.tsx       # Sidebar con historial
│   │   ├── icon.svg          # Favicon personalizado
│   │   └── globals.css       # Estilos globales
│   ├── public/               # Assets estáticos
│   ├── package.json          # Dependencias Node.js
│   └── next.config.ts        # Configuración de Next.js
├── vercel.json               # Configuración de deploy en Vercel
├── render.yaml               # Configuración de deploy en Render
└── README.md
```

## 🚀 Instalación y uso local

### Backend

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

El backend queda disponible en `http://localhost:8000`.

- Documentación interactiva: `http://localhost:8000/docs`
- Endpoint principal: `POST /chat`

### Frontend

En otra terminal:

```bash
# 1. Entrar al frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Levantar el servidor de desarrollo
npm run dev
```

El frontend queda disponible en `http://localhost:3000`.

**Importante:** el backend debe estar corriendo para que el chat funcione.

## 🌐 Deploy en producción

- **Backend:** [Render](https://render.com) → `https://nova-chat-api-60wk.onrender.com`
- **Frontend:** [Vercel](https://vercel.com) → `https://nova-chat-app-one.vercel.app`

Ambos servicios se actualizan automáticamente cuando se hace push a `main`.

## 🛠️ Tecnologías

**Backend:**
- Python 3.10+
- FastAPI — framework web
- Uvicorn — servidor ASGI
- google-genai — SDK oficial de Google Gemini
- python-dotenv — manejo de variables de entorno

**Frontend:**
- Next.js 16+
- React 19
- TypeScript
- Tailwind CSS
- react-markdown — renderizado de markdown
- remark-gfm — soporte GitHub Flavored Markdown
- react-syntax-highlighter — coloreado de código
- lucide-react — iconos

## 🗺️ Roadmap

- [x] Backend con FastAPI
- [x] Endpoint `/chat` funcional
- [x] Sesiones independientes por usuario
- [x] Documentación automática con Swagger
- [x] Frontend con Next.js
- [x] Chat funcional conectado al backend
- [x] Diseño brutal (animaciones, markdown renderizado, sidebar)
- [x] Deploy en producción (backend + frontend)
- [ ] Fase 6: Seguridad (rate limiting, CORS cerrado)

## 🔑 Cómo obtener tu API key de Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crea una API key gratuita (no pide tarjeta)
3. Pégala en `backend/.env`

## 📚 Lo que aprendí

- Cómo construir una API REST con FastAPI
- Cómo manejar sesiones independientes por usuario en el backend
- Cómo configurar CORS para comunicación entre frontend y backend
- Cómo crear una interfaz de chat con React + Next.js
- Cómo gestionar estado con `useState` y hacer llamadas HTTP con `fetch`
- Cómo estilizar interfaces modernas con Tailwind CSS
- Cómo renderizar markdown y código con syntax highlighting
- Cómo implementar un sidebar con historial persistente en localStorage
- Cómo deployar backend y frontend en plataformas distintas
- Arquitectura cliente-servidor completa en producción

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

# 🤖 Nova Chat

> Chat web para conversar con Nova, un agente de IA con BYOK (cada usuario trae su propia API key de Gemini).

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-API-009688?style=flat&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16+-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat&logo=typescript&logoColor=white)
![BYOK](https://img.shields.io/badge/BYOK-Bring%20Your%20Own%20Key-orange?style=flat)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

## 🚀 Demo en vivo

**Prueba Nova Chat online:** [https://nova-chat-app-one.vercel.app](https://nova-chat-app-one.vercel.app)

> **Nota:** Nova Chat es BYOK. Necesitas tu propia API key de Google Gemini (gratis) para usarlo. El modal te explica cómo obtenerla.

## 📖 Sobre el proyecto

**Nova Chat** es un chat con IA full-stack construido desde cero, deployado en producción, y diseñado con **BYOK (Bring Your Own Key)** para ser sostenible.

- **Backend en FastAPI** que expone el agente Nova como API REST.
- **Frontend en Next.js** con una interfaz moderna tipo ChatGPT.
- **BYOK**: cada usuario usa su propia API key de Gemini, guardada solo en su navegador.
- **Seguridad**: rate limiting, CORS cerrado, validación de entrada, prompt defensivo, y `leer_archivo` restringido a una carpeta permitida.

## 🏗️ Arquitectura

```
┌──────────────────────────────┐
│  USUARIO (navegador)         │
│  - API key en localStorage   │
└──────────────┬───────────────┘
               │ POST /chat + X-API-Key header
               ▼
┌──────────────────────────────┐
│  FRONTEND (Vercel)           │
│  nova-chat-app-one.vercel.app│
└──────────────┬───────────────┘
               │ POST /chat + X-API-Key header
               ▼
┌──────────────────────────────┐
│  BACKEND (Render)            │
│  nova-chat-api-60wk.onrender │
│  - No guarda keys            │
│  - Usa la key del usuario    │
└──────────────┬───────────────┘
               │ API call con la key del usuario
               ▼
        ┌─────────────┐
        │  GEMINI API │
        └─────────────┘
```

## ✨ Características

- 💬 **Chat con IA** en tiempo real
- 🔑 **BYOK**: cada usuario trae su propia API key
- 🎨 **Interfaz moderna** con tema oscuro tipo ChatGPT
- 📝 **Markdown renderizado** en las respuestas
- 🎯 **Syntax highlighting** para bloques de código
- 📚 **Múltiples conversaciones** con sidebar
- 💾 **Historial persistente** (localStorage)
- 📱 **Responsive** (desktop + móvil)
- 🔧 **Herramientas de agente**: leer archivos y listar directorios
- 🛡️ **Seguridad**:
  - Rate limiting (20 req/min por IP)
  - CORS cerrado a orígenes específicos
  - Validación de entrada (max 5000 chars)
  - Prompt defensivo contra injection
  - `leer_archivo` restringido a `backend/docs/`

## 📁 Estructura del proyecto

```
nova-chat/
├── backend/                  # API REST en FastAPI
│   ├── agente/               # Módulo del agente Nova
│   │   ├── __init__.py
│   │   ├── config.py         # Modelo, personalidad y configuración de seguridad
│   │   ├── herramientas.py   # Herramientas con validación de rutas
│   │   └── agente.py         # (Deprecado — lógica movida a main.py)
│   ├── docs/                 # Carpeta permitida para leer_archivo
│   ├── main.py               # Servidor FastAPI con BYOK y seguridad
│   ├── requirements.txt      # Dependencias Python
│   └── .env                  # (Ya no se usa en producción — BYOK)
├── frontend/                 # Interfaz en Next.js
│   ├── app/
│   │   ├── layout.tsx        # Estructura general
│   │   ├── page.tsx          # Página principal (chat + lógica BYOK)
│   │   ├── components.tsx    # Componentes de mensajes y markdown
│   │   ├── Sidebar.tsx       # Sidebar con historial y botón de API key
│   │   ├── ModalApiKey.tsx   # Modal para configurar la API key
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

# 5. Levantar el servidor
uvicorn main:app --reload
```

El backend queda disponible en `http://localhost:8000`.

- Documentación interactiva: `http://localhost:8000/docs`
- Endpoint principal: `POST /chat` (requiere header `X-API-Key`)

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

Al abrirlo, verás el modal de configuración de API key.

## 🔑 Cómo funciona BYOK

1. Al abrir Nova Chat por primera vez, aparece un modal pidiendo tu API key.
2. La key se guarda **solo en tu navegador** (`localStorage`).
3. Cada petición al backend incluye la key en el header `X-API-Key`.
4. El backend usa esa key para llamar a Gemini, y **nunca la almacena**.
5. Puedes cambiar tu key en cualquier momento desde el botón "Cambiar API key" del sidebar.

**Beneficios:**
- El dueño de la app no paga el consumo de nadie.
- Cada usuario controla su propio costo.
- Las keys no se almacenan en ningún servidor.
- La app es sostenible a escala.

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
- slowapi — rate limiting
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
- [x] Diseño brutal (markdown, sidebar, responsive)
- [x] Deploy en producción (backend + frontend)
- [x] **Seguridad: rate limiting, CORS, validación, prompt defensivo**
- [x] **BYOK: cada usuario trae su API key**

## 📚 Lo que aprendí

- Cómo construir una API REST con FastAPI
- Cómo manejar sesiones independientes por usuario en el backend
- Cómo configurar CORS para producción
- Cómo implementar rate limiting con slowapi
- Cómo validar entradas con Pydantic
- Cómo crear un patrón BYOK (Bring Your Own Key)
- Cómo proteger un agente contra prompt injection
- Cómo restringir herramientas a rutas permitidas
- Cómo crear una interfaz de chat con React + Next.js
- Cómo gestionar estado con `useState` y `useEffect`
- Cómo renderizar markdown y código con syntax highlighting
- Cómo implementar persistencia con `localStorage`
- Cómo deployar backend y frontend en plataformas distintas
- Arquitectura cliente-servidor completa en producción

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

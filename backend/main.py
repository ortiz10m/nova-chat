# main.py - API web del agente Nova

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types

from agente.config import MODELO, PERSONALIDAD
from agente.herramientas import leer_archivo, listar_archivos


# --- Modelos de datos (lo que entra y sale de la API) ---

class MensajeEntrada(BaseModel):
    mensaje: str
    sesion_id: str = "default"


class MensajeSalida(BaseModel):
    respuesta: str
    sesion_id: str


# --- Almacenamiento de sesiones (en memoria por ahora) ---
# Cada sesion_id tiene su propio chat con historial independiente.
sesiones: dict = {}
cliente_global = None


# --- Ciclo de vida de la app ---

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Se ejecuta al arrancar y al apagar el servidor."""
    global cliente_global

    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Falta GEMINI_API_KEY en el archivo .env")

    cliente_global = genai.Client(api_key=api_key)
    print("✅ Cliente de Gemini inicializado")

    yield

    sesiones.clear()
    print("🔴 Servidor apagado, sesiones limpiadas")


# --- App FastAPI ---

app = FastAPI(
    title="Nova API",
    description="API del agente Nova construida con Gemini",
    version="1.0.0",
    lifespan=lifespan,
)

# Permitir que el frontend (en otro puerto) pueda llamar a esta API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, cambiar por la URL del frontend
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Utilidades ---

def obtener_o_crear_chat(sesion_id: str):
    """Devuelve el chat de la sesión o crea uno nuevo si no existe."""
    if sesion_id not in sesiones:
        sesiones[sesion_id] = cliente_global.chats.create(
            model=MODELO,
            config=types.GenerateContentConfig(
                system_instruction=PERSONALIDAD,
                tools=[leer_archivo, listar_archivos],
            ),
        )
    return sesiones[sesion_id]


# --- Endpoints ---

@app.get("/")
def raiz():
    """Endpoint de bienvenida."""
    return {"mensaje": "Nova API funcionando. Ve a /docs para probarla."}


@app.post("/chat", response_model=MensajeSalida)
def chat(entrada: MensajeEntrada):
    """Recibe un mensaje, lo procesa con Nova y devuelve la respuesta."""
    if not entrada.mensaje.strip():
        raise HTTPException(status_code=400, detail="El mensaje está vacío.")

    try:
        chat_sesion = obtener_o_crear_chat(entrada.sesion_id)
        response = chat_sesion.send_message(entrada.mensaje)
        return MensajeSalida(respuesta=response.text, sesion_id=entrada.sesion_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error del agente: {e}")


@app.post("/limpiar/{sesion_id}")
def limpiar(sesion_id: str):
    """Elimina el historial de una sesión."""
    sesiones.pop(sesion_id, None)
    return {"mensaje": f"Sesión '{sesion_id}' reiniciada."}


@app.get("/sesiones")
def listar_sesiones():
    """Lista las sesiones activas (útil para debug)."""
    return {"sesiones": list(sesiones.keys()), "total": len(sesiones)}
# main.py - API web del agente Nova (con BYOK)

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from dotenv import load_dotenv
from google import genai
from google.genai import types

from agente.config import (
    MODELO,
    PERSONALIDAD,
    CORS_ORIGINS,
    MAX_MENSAJE_LENGTH,
    RATE_LIMIT,
)
from agente.herramientas import leer_archivo, listar_archivos


# --- Rate limiter ---
limiter = Limiter(key_func=get_remote_address)


# --- Modelos de datos ---
class MensajeEntrada(BaseModel):
    mensaje: str = Field(..., min_length=1, max_length=MAX_MENSAJE_LENGTH)
    sesion_id: str = Field(default="default", max_length=100)


class MensajeSalida(BaseModel):
    respuesta: str
    sesion_id: str


# --- Almacenamiento de sesiones (por sesion_id) ---
# Estructura:
#   sesiones["<sesion_id>"] = objeto chat de Gemini
#   sesiones["<sesion_id>__cliente"] = cliente de Gemini (para que no se cierre)
#   sesiones["<sesion_id>__key"] = API key del usuario (para invalidar si cambia)
sesiones: dict = {}


# --- Ciclo de vida ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    load_dotenv()
    print("✅ Nova API lista (modo BYOK)")
    yield
    sesiones.clear()
    print("🔴 Servidor apagado, sesiones limpiadas")


# --- App FastAPI ---
app = FastAPI(
    title="Nova API",
    description="API del agente Nova con BYOK (cada usuario trae su API key de Gemini)",
    version="2.0.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "X-API-Key"],
)


# --- Utilidades ---
def crear_cliente_con_key(api_key: str):
    """Crea un cliente de Gemini con la API key del usuario."""
    return genai.Client(api_key=api_key)


def obtener_o_crear_chat(sesion_id: str, api_key: str):
    """Devuelve el chat de la sesión o crea uno nuevo si no existe.

    Si la api_key cambia para la misma sesión, se invalida el chat anterior
    (el chat está atado a un cliente específico, y el cliente a una key).
    """
    key_sesion = sesiones.get(f"{sesion_id}__key")

    if key_sesion != api_key:
        # Si la key cambió, invalidar la sesión (el cliente anterior ya no sirve)
        sesiones.pop(sesion_id, None)
        sesiones.pop(f"{sesion_id}__cliente", None)
        sesiones[f"{sesion_id}__key"] = api_key

    if sesion_id not in sesiones:
        cliente = crear_cliente_con_key(api_key)
        chat = cliente.chats.create(
            model=MODELO,
            config=types.GenerateContentConfig(
                system_instruction=PERSONALIDAD,
                tools=[leer_archivo, listar_archivos],
            ),
        )
        # Guardamos cliente Y chat para que el cliente no se cierre
        sesiones[sesion_id] = chat
        sesiones[f"{sesion_id}__cliente"] = cliente

    return sesiones[sesion_id]


# --- Endpoints ---
@app.get("/")
def raiz():
    return {"mensaje": "Nova API funcionando (modo BYOK). Ve a /docs para probarla."}


@app.post("/chat", response_model=MensajeSalida)
@limiter.limit(RATE_LIMIT)
def chat(
    request: Request,
    entrada: MensajeEntrada,
    x_api_key: str = Header(..., alias="X-API-Key"),
):
    """Recibe un mensaje y la API key del usuario en el header X-API-Key."""
    if not x_api_key or not x_api_key.strip():
        raise HTTPException(
            status_code=400,
            detail="Falta la API key. Mándala en el header 'X-API-Key'.",
        )

    try:
        chat_sesion = obtener_o_crear_chat(entrada.sesion_id, x_api_key.strip())
        response = chat_sesion.send_message(entrada.mensaje)
        return MensajeSalida(respuesta=response.text, sesion_id=entrada.sesion_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error del agente: {e}")


@app.post("/limpiar/{sesion_id}")
def limpiar(sesion_id: str):
    sesiones.pop(sesion_id, None)
    sesiones.pop(f"{sesion_id}__key", None)
    sesiones.pop(f"{sesion_id}__cliente", None)
    return {"mensaje": f"Sesión '{sesion_id}' reiniciada."}


@app.get("/sesiones")
def listar_sesiones():
    # Filtramos las claves internas que usamos para trackear la key y el cliente
    ids = [
        k for k in sesiones.keys()
        if not k.endswith("__key") and not k.endswith("__cliente")
    ]
    return {"sesiones": ids, "total": len(ids)}
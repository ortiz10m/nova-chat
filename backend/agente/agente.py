# Lógica del agente Nova

import os
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types

from agente.config import MODELO, PERSONALIDAD, MAX_REINTENTOS, ESPERA_ENTRE_REINTENTOS
from agente.herramientas import leer_archivo, listar_archivos


def crear_cliente():
    """Carga la API key y crea el cliente de Gemini."""
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Falta GEMINI_API_KEY en el archivo .env")
    return genai.Client(api_key=api_key)


def enviar_con_reintentos(chat, mensaje):
    """Envía un mensaje al chat. Si falla, reintenta hasta MAX_REINTENTOS veces."""
    for intento in range(1, MAX_REINTENTOS + 1):
        try:
            return chat.send_message(mensaje)
        except Exception as e:
            if intento == MAX_REINTENTOS:
                raise
            print(f"⚠️  Error (intento {intento}/{MAX_REINTENTOS}): {e}")
            print(f"   Reintentando en {ESPERA_ENTRE_REINTENTOS}s...")
            time.sleep(ESPERA_ENTRE_REINTENTOS)


def crear_chat(client):
    """Crea una sesión de chat con la personalidad y herramientas configuradas."""
    return client.chats.create(
        model=MODELO,
        config=types.GenerateContentConfig(
            system_instruction=PERSONALIDAD,
            tools=[leer_archivo, listar_archivos],
        ),
    )


def mostrar_ayuda():
    """Muestra los comandos disponibles."""
    print("""
Comandos disponibles:
  /ayuda     - Muestra esta ayuda
  /limpiar   - Reinicia la conversación (borra el contexto)
  salir      - Termina el programa
""")


def ejecutar():
    """Loop principal del agente."""
    client = crear_cliente()

    print("🤖 Nova lista. Escribe '/ayuda' para ver los comandos.")
    print("-" * 40)

    chat = crear_chat(client)

    while True:
        try:
            user_input = input("Tú: ").strip()

            if not user_input:
                continue

            if user_input.lower() == "salir":
                print("Nova: Hasta luego.")
                break

            if user_input.lower() == "/ayuda":
                mostrar_ayuda()
                continue

            if user_input.lower() == "/limpiar":
                chat = crear_chat(client)
                print("Nova: Conversación reiniciada.")
                continue

            response = enviar_con_reintentos(chat, user_input)
            print(f"Nova: {response.text}")

        except KeyboardInterrupt:
            print("\nNova: Hasta luego.")
            break
        except Exception as e:
            print(f"⚠️  Error: {e}")
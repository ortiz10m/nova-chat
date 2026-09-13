# Herramientas que el agente puede usar
# Cada función aquí se expone al LLM para que decida cuándo llamarla.

import os
from pathlib import Path

from agente.config import ALLOWED_DIR


def _resolver_ruta_segura(ruta: str) -> Path | None:
    """Resuelve una ruta asegurándose de que esté dentro de ALLOWED_DIR.

    Devuelve la ruta absoluta si es válida, o None si intenta salir de la carpeta.
    """
    base = Path(__file__).parent.parent / ALLOWED_DIR
    base = base.resolve()

    # Unir la ruta base con la ruta pedida y resolver
    try:
        solicitada = (base / ruta).resolve()
    except Exception:
        return None

    # Verificar que la ruta solicitada esté DENTRO de la base
    if not str(solicitada).startswith(str(base)):
        return None

    return solicitada


def leer_archivo(ruta: str) -> str:
    """Lee el contenido de un archivo de texto dentro de la carpeta de documentos permitida.

    Args:
        ruta: Ruta del archivo, relativa a la carpeta de documentos.

    Returns:
        El contenido del archivo o un mensaje de error.
    """
    ruta_segura = _resolver_ruta_segura(ruta)

    if ruta_segura is None:
        return "Error: no tienes permiso para acceder a esa ruta."

    try:
        with open(ruta_segura, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return f"Error: el archivo '{ruta}' no existe."
    except Exception as e:
        return f"Error al leer el archivo: {e}"


def listar_archivos(directorio: str = "") -> str:
    """Lista los archivos dentro de la carpeta de documentos permitida.

    Args:
        directorio: Subcarpeta dentro de la carpeta de documentos. Por defecto, la raíz.

    Returns:
        Una lista con los nombres de archivos, o un mensaje de error.
    """
    ruta_segura = _resolver_ruta_segura(directorio)

    if ruta_segura is None:
        return "Error: no tienes permiso para acceder a esa ruta."

    try:
        items = os.listdir(ruta_segura)
        return "\n".join(items) if items else "La carpeta está vacía."
    except FileNotFoundError:
        return f"Error: el directorio '{directorio}' no existe."
    except Exception as e:
        return f"Error al listar el directorio: {e}"
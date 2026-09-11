# Herramientas que el agente puede usar
# Cada función aquí se expone al LLM para que decida cuándo llamarla.


def leer_archivo(ruta: str) -> str:
    """Lee el contenido de un archivo de texto en la ruta especificada.

    Args:
        ruta: La ruta del archivo a leer.

    Returns:
        El contenido del archivo o un mensaje de error.
    """
    try:
        with open(ruta, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return f"Error: el archivo '{ruta}' no existe."
    except Exception as e:
        return f"Error al leer el archivo: {e}"


def listar_archivos(directorio: str = ".") -> str:
    """Lista los archivos y carpetas dentro de un directorio.

    Args:
        directorio: La ruta del directorio a listar. Por defecto, el actual.

    Returns:
        Una lista con los nombres de archivos y carpetas, o un mensaje de error.
    """
    import os

    try:
        items = os.listdir(directorio)
        return "\n".join(items) if items else "El directorio está vacío."
    except FileNotFoundError:
        return f"Error: el directorio '{directorio}' no existe."
    except Exception as e:
        return f"Error al listar el directorio: {e}"
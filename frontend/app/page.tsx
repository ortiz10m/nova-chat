"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Menu } from "lucide-react";
import { MensajeItem, Puntitos } from "./components";
import { Sidebar, Conversacion } from "./Sidebar";
import { ModalApiKey } from "./ModalApiKey";

const STORAGE_KEY = "nova-conversaciones";
const API_KEY_STORAGE = "nova-api-key";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function generarId() {
  return Math.random().toString(36).substring(2, 10);
}

function crearConversacionVacia(): Conversacion {
  return {
    id: generarId(),
    titulo: "Nueva conversación",
    mensajes: [],
  };
}

export default function Home() {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [conversacionActivaId, setConversacionActivaId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const [hidratado, setHidratado] = useState(false);
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  // --- API key ---
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [esCambioKey, setEsCambioKey] = useState(false);

  const finDelChat = useRef<HTMLDivElement>(null);

  // Cargar de localStorage al iniciar
  useEffect(() => {
    // Conversaciones
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
      try {
        const data = JSON.parse(guardado);
        setConversaciones(data.conversaciones || []);
        setConversacionActivaId(data.activa || null);
      } catch (e) {
        console.error("Error al cargar conversaciones:", e);
      }
    } else {
      const nueva = crearConversacionVacia();
      setConversaciones([nueva]);
      setConversacionActivaId(nueva.id);
    }

    // API key
    const keyGuardada = localStorage.getItem(API_KEY_STORAGE);
    if (keyGuardada) {
      setApiKey(keyGuardada);
    } else {
      setMostrarModal(true);
      setEsCambioKey(false);
    }

    setHidratado(true);
  }, []);

  // Guardar conversaciones
  useEffect(() => {
    if (!hidratado) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ conversaciones, activa: conversacionActivaId })
    );
  }, [conversaciones, conversacionActivaId, hidratado]);

  // Auto-scroll
  useEffect(() => {
    finDelChat.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversaciones, conversacionActivaId, cargando]);

  const conversacionActiva = conversaciones.find(
    (c) => c.id === conversacionActivaId
  );
  const mensajes = conversacionActiva?.mensajes || [];

  // --- API key handlers ---
  function guardarApiKey(key: string) {
    localStorage.setItem(API_KEY_STORAGE, key);
    setApiKey(key);
    setMostrarModal(false);
    setEsCambioKey(false);
  }

  function abrirCambioKey() {
    setEsCambioKey(true);
    setMostrarModal(true);
    setSidebarAbierto(false);
  }

  function cerrarModal() {
    setMostrarModal(false);
    setEsCambioKey(false);
  }

  // --- Conversaciones handlers ---
  function nuevaConversacion() {
    const nueva = crearConversacionVacia();
    setConversaciones((prev) => [nueva, ...prev]);
    setConversacionActivaId(nueva.id);
  }

  function seleccionarConversacion(id: string) {
    setConversacionActivaId(id);
  }

  function eliminarConversacion(id: string) {
    setConversaciones((prev) => {
      const filtradas = prev.filter((c) => c.id !== id);
      if (id === conversacionActivaId) {
        if (filtradas.length > 0) {
          setConversacionActivaId(filtradas[0].id);
        } else {
          const nueva = crearConversacionVacia();
          setConversacionActivaId(nueva.id);
          return [nueva];
        }
      }
      return filtradas;
    });
  }

  // --- Envío de mensajes ---
  async function enviarMensaje() {
    if (!input.trim() || cargando || !conversacionActiva || !apiKey) return;

    const mensajeUsuario = input.trim();
    const idConv = conversacionActiva.id;
    setInput("");
    setCargando(true);

    setConversaciones((prev) =>
      prev.map((c) => {
        if (c.id !== idConv) return c;
        const esPrimerMensaje = c.mensajes.length === 0;
        return {
          ...c,
          titulo: esPrimerMensaje
            ? mensajeUsuario.slice(0, 40) + (mensajeUsuario.length > 40 ? "..." : "")
            : c.titulo,
          mensajes: [...c.mensajes, { rol: "usuario", texto: mensajeUsuario }],
        };
      })
    );

    try {
      const respuesta = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify({
          mensaje: mensajeUsuario,
          sesion_id: idConv,
        }),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => null);
        throw new Error(errorData?.detail || `Error ${respuesta.status}`);
      }

      const data = await respuesta.json();

      setConversaciones((prev) =>
        prev.map((c) =>
          c.id === idConv
            ? {
                ...c,
                mensajes: [...c.mensajes, { rol: "nova", texto: data.respuesta }],
              }
            : c
        )
      );
    } catch (error) {
      setConversaciones((prev) =>
        prev.map((c) =>
          c.id === idConv
            ? {
                ...c,
                mensajes: [
                  ...c.mensajes,
                  { rol: "nova", texto: `⚠️ Error: ${error}` },
                ],
              }
            : c
        )
      );
    } finally {
      setCargando(false);
    }
  }

  function manejarTecla(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  }

  return (
    <div className="h-screen flex bg-gradient-to-b from-zinc-950 to-black text-white">
      <Sidebar
        conversaciones={conversaciones}
        conversacionActivaId={conversacionActivaId}
        onNueva={nuevaConversacion}
        onSeleccionar={seleccionarConversacion}
        onEliminar={eliminarConversacion}
        onCambiarApiKey={abrirCambioKey}
        abierto={sidebarAbierto}
        onCerrar={() => setSidebarAbierto(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header móvil */}
        <div className="md:hidden flex-shrink-0 border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-sm">
          <div className="px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setSidebarAbierto(true)}
              className="p-1 text-zinc-400 hover:text-white"
              aria-label="Abrir sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h1 className="text-lg font-semibold">Nova</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            {mensajes.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-32">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">¿En qué te ayudo hoy?</h2>
                <p className="text-zinc-400 max-w-md">
                  Pregúntame lo que quieras. Puedo leer archivos, listar directorios y responder consultas técnicas.
                </p>
              </div>
            )}

            {mensajes.map((msg, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <MensajeItem mensaje={msg} />
              </div>
            ))}

            {cargando && (
              <div className="flex gap-3 items-start animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3">
                  <Puntitos />
                </div>
              </div>
            )}

            <div ref={finDelChat} />
          </div>
        </div>

        <div className="flex-shrink-0 border-t border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto p-4">
            <div className="relative flex items-end gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 focus-within:border-zinc-600 transition-colors">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={manejarTecla}
                placeholder={apiKey ? "Escribe un mensaje..." : "Configura tu API key primero..."}
                disabled={cargando || !apiKey}
                rows={1}
                className="flex-1 bg-transparent text-white placeholder-zinc-500 focus:outline-none resize-none px-3 py-2 max-h-40 disabled:opacity-50"
                style={{ minHeight: "40px" }}
              />
              <button
                onClick={enviarMensaje}
                disabled={cargando || !input.trim() || !apiKey}
                className="bg-white hover:bg-zinc-200 disabled:bg-zinc-700 disabled:cursor-not-allowed text-black rounded-xl p-2.5 transition-colors flex-shrink-0"
                aria-label="Enviar mensaje"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-600 text-center mt-2">
              Nova puede cometer errores. Verifica la información importante.
            </p>
          </div>
        </div>
      </div>

      {/* Modal de API key */}
      <ModalApiKey
        abierto={mostrarModal}
        apiKeyActual={apiKey}
        onGuardar={guardarApiKey}
        onCerrar={esCambioKey ? cerrarModal : undefined}
        esCambio={esCambioKey}
      />
    </div>
  );
}
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User } from "lucide-react";

type Mensaje = {
  rol: "usuario" | "nova";
  texto: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [cargando, setCargando] = useState(false);

  const finDelChat = useRef<HTMLDivElement>(null);

  useEffect(() => {
    finDelChat.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, cargando]);

  async function enviarMensaje() {
    if (!input.trim() || cargando) return;

    const mensajeUsuario = input.trim();
    setInput("");
    setMensajes((prev) => [...prev, { rol: "usuario", texto: mensajeUsuario }]);
    setCargando(true);

    try {
      const respuesta = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensaje: mensajeUsuario,
          sesion_id: "web",
        }),
      });

      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}`);
      }

      const data = await respuesta.json();
      setMensajes((prev) => [...prev, { rol: "nova", texto: data.respuesta }]);
    } catch (error) {
      setMensajes((prev) => [
        ...prev,
        { rol: "nova", texto: `⚠️ Error: ${error}` },
      ]);
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
    <div className="h-screen flex flex-col bg-gradient-to-b from-zinc-950 to-black text-white">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-zinc-800/50 backdrop-blur-sm bg-zinc-950/50">
  <div className="px-6 py-3 flex items-center gap-2">
    <Sparkles className="w-5 h-5 text-orange-500" />
    <h1 className="text-lg font-semibold">Nova</h1>
  </div>
</header>

      {/* Área de mensajes (con scroll) */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 min-h-full">
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
            <div
              key={i}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
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

      {/* Input */}
      <div className="flex-shrink-0 border-t border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-4">
          <div className="relative flex items-end gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 focus-within:border-zinc-600 transition-colors">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={manejarTecla}
              placeholder="Escribe un mensaje..."
              disabled={cargando}
              rows={1}
              className="flex-1 bg-transparent text-white placeholder-zinc-500 focus:outline-none resize-none px-3 py-2 max-h-40 disabled:opacity-50"
              style={{ minHeight: "40px" }}
            />
            <button
              onClick={enviarMensaje}
              disabled={cargando || !input.trim()}
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
  );
}

// --- Componentes ---

function MensajeItem({ mensaje }: { mensaje: Mensaje }) {
  const esUsuario = mensaje.rol === "usuario";

  return (
    <div className={`flex gap-3 ${esUsuario ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          esUsuario
            ? "bg-zinc-700"
            : "bg-gradient-to-br from-orange-500 to-orange-700"
        }`}
      >
        {esUsuario ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Sparkles className="w-4 h-4 text-white" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          esUsuario
            ? "bg-zinc-800 text-white"
            : "bg-zinc-900 border border-zinc-800 text-zinc-100"
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{mensaje.texto}</p>
      </div>
    </div>
  );
}

function Puntitos() {
  return (
    <div className="flex gap-1">
      <span
        className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}
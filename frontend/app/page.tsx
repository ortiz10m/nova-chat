"use client";

import { useState } from "react";

type Mensaje = {
  rol: "usuario" | "nova";
  texto: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [cargando, setCargando] = useState(false);

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

  function manejarTecla(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 p-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          ⚡ Nova
        </h1>
      </header>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensajes.length === 0 && (
          <div className="text-center text-zinc-500 mt-20">
            <p className="text-4xl mb-4">⚡</p>
            <p>Empieza una conversación con Nova</p>
          </div>
        )}

        {mensajes.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.rol === "usuario" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                msg.rol === "usuario"
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-100"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.texto}</p>
            </div>
          </div>
        ))}

        {cargando && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 rounded-2xl px-4 py-2 text-zinc-400">
              Nova está pensando...
            </div>
          </div>
        )}
      </div>

      {/* Caja de texto */}
      <div className="border-t border-zinc-800 p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={manejarTecla}
            placeholder="Escribe un mensaje..."
            disabled={cargando}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
          <button
            onClick={enviarMensaje}
            disabled={cargando || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl transition-colors"
          >
            Enviar
          </button>
        </div>
      </div>
    </main>
  );
}
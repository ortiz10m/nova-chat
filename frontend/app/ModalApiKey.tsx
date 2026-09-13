"use client";

import { useState } from "react";
import { Key, ExternalLink, X } from "lucide-react";

type ModalApiKeyProps = {
  abierto: boolean;
  apiKeyActual: string | null;
  onGuardar: (key: string) => void;
  onCerrar?: () => void;
  esCambio?: boolean;
};

export function ModalApiKey({
  abierto,
  apiKeyActual,
  onGuardar,
  onCerrar,
  esCambio = false,
}: ModalApiKeyProps) {
  const [key, setKey] = useState(apiKeyActual || "");
  const [error, setError] = useState("");

  if (!abierto) return null;

  function manejarGuardar() {
    const limpia = key.trim();
    if (!limpia) {
      setError("La API key no puede estar vacía.");
      return;
    }
    if (limpia.length < 20) {
      setError("La API key parece inválida. Debe tener al menos 20 caracteres.");
      return;
    }
    setError("");
    onGuardar(limpia);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center flex-shrink-0">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {esCambio ? "Cambiar API key" : "Configura tu API key"}
              </h2>
              <p className="text-xs text-zinc-500">
                Nova Chat funciona con tu propia key
              </p>
            </div>
          </div>
          {esCambio && onCerrar && (
            <button
              onClick={onCerrar}
              className="text-zinc-500 hover:text-white p-1"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Explicación */}
        <div className="mb-4 text-sm text-zinc-400 space-y-2">
          <p>
            Nova Chat es <strong className="text-white">BYOK</strong> (Bring Your Own Key). Para usarlo necesitas una API key gratuita de Google Gemini.
          </p>
          <p>
            Tu key se guarda <strong className="text-white">solo en tu navegador</strong>.
            Nunca se envía a nuestros servidores más que para hacer la consulta a Gemini.
          </p>
        </div>

        {/* Link para obtener key */}
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl px-4 py-3 mb-4 text-sm transition-colors"
        >
          <span className="text-zinc-300">
            Obtener una API key gratis en Google AI Studio
          </span>
          <ExternalLink className="w-4 h-4 text-zinc-500 flex-shrink-0" />
        </a>

        {/* Input */}
        <label className="block text-xs text-zinc-500 mb-2">
          Pega tu API key aquí
        </label>
        <input
          type="password"
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") manejarGuardar();
          }}
          placeholder="AIzaSy..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors font-mono text-sm"
          autoFocus
        />

        {error && (
          <p className="text-red-400 text-xs mt-2">{error}</p>
        )}

        {/* Botones */}
        <div className="flex gap-2 mt-5">
          {esCambio && onCerrar && (
            <button
              onClick={onCerrar}
              className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl px-4 py-3 text-sm transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={manejarGuardar}
            disabled={!key.trim()}
            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white font-medium rounded-xl px-4 py-3 transition-colors"
          >
            Guardar y empezar
          </button>
        </div>

        {/* Nota legal */}
        <p className="text-[11px] text-zinc-600 text-center mt-4">
          Puedes revocar tu key en cualquier momento desde Google AI Studio.
        </p>
      </div>
    </div>
  );
}
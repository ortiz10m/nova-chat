"use client";

import { Plus, MessageSquare, Trash2, Sparkles } from "lucide-react";

export type Conversacion = {
  id: string;
  titulo: string;
  mensajes: { rol: "usuario" | "nova"; texto: string }[];
};

type SidebarProps = {
  conversaciones: Conversacion[];
  conversacionActivaId: string | null;
  onNueva: () => void;
  onSeleccionar: (id: string) => void;
  onEliminar: (id: string) => void;
};

export function Sidebar({
  conversaciones,
  conversacionActivaId,
  onNueva,
  onSeleccionar,
  onEliminar,
}: SidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-zinc-800/50 bg-zinc-950 flex flex-col h-full">
      {/* Header del sidebar */}
      <div className="p-3 border-b border-zinc-800/50">
        <div className="flex items-center gap-2 mb-3 px-1">
          <Sparkles className="w-5 h-5 text-orange-500" />
          <h1 className="text-lg font-semibold">Nova</h1>
        </div>
        <button
          onClick={onNueva}
          className="w-full flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg px-3 py-2 text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva conversación</span>
        </button>
      </div>

      {/* Lista de conversaciones */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversaciones.length === 0 && (
          <p className="text-xs text-zinc-600 text-center py-4 px-2">
            No hay conversaciones todavía
          </p>
        )}

        {conversaciones.map((conv) => {
          const activa = conv.id === conversacionActivaId;
          return (
            <div
              key={conv.id}
              className={`group flex items-center gap-2 rounded-lg px-2 py-2 cursor-pointer transition-colors ${
                activa
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
              onClick={() => onSeleccionar(conv.id)}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm truncate flex-1">{conv.titulo}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEliminar(conv.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-400"
                aria-label="Eliminar conversación"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer del sidebar (opcional) */}
      <div className="p-3 border-t border-zinc-800/50">
        <p className="text-xs text-zinc-600">Nova v1.0</p>
      </div>
    </aside>
  );
}
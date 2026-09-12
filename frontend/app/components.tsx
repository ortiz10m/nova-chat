"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Sparkles } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export type Mensaje = {
  rol: "usuario" | "nova";
  texto: string;
};

export function MensajeItem({ mensaje }: { mensaje: Mensaje }) {
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
        {esUsuario ? (
          <p className="whitespace-pre-wrap leading-relaxed">{mensaje.texto}</p>
        ) : (
          <MensajeMarkdown contenido={mensaje.texto} />
        )}
      </div>
    </div>
  );
}

export function MensajeMarkdown({ contenido }: { contenido: string }) {
  return (
    <div className="text-[15px] leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const lenguaje = match ? match[1] : "text";

            return !inline ? (
              <div className="my-3 rounded-lg overflow-hidden border border-zinc-800">
                <SyntaxHighlighter
                  language={lenguaje}
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    padding: "1rem",
                    background: "#0a0a0a",
                    fontSize: "13px",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    },
                  }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code
                className="bg-zinc-800 text-orange-300 px-1.5 py-0.5 rounded text-[13px] font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          p({ children }) {
            return <p className="mb-3 last:mb-0">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>;
          },
          li({ children }) {
            return <li>{children}</li>;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 underline"
              >
                {children}
              </a>
            );
          },
          strong({ children }) {
            return <strong className="font-semibold text-white">{children}</strong>;
          },
          em({ children }) {
            return <em className="italic text-zinc-200">{children}</em>;
          },
          h1({ children }) {
            return <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-lg font-bold mt-4 mb-2">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-base font-semibold mt-3 mb-2">{children}</h3>;
          },
          hr() {
            return <hr className="border-zinc-800 my-4" />;
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-3">
                <table className="w-full border-collapse border border-zinc-800 rounded-lg overflow-hidden">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border border-zinc-800 bg-zinc-800/50 px-3 py-2 text-left font-semibold">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border border-zinc-800 px-3 py-2">{children}</td>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-orange-500 pl-4 my-3 text-zinc-300 italic">
                {children}
              </blockquote>
            );
          },
        }}
      >
        {contenido}
      </ReactMarkdown>
    </div>
  );
}

export function Puntitos() {
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
// src/components/BookerScreen.tsx
import React, { useEffect, useState } from "react";

interface BookerScreenProps {
  // optional navigation callback
  onBack?: () => void;
  // Optional preloaded PDF URL if App preloads it
  preloadedFileUrl?: string | null;
  fallbackPath?: string;
}

const defaultFallback = "/abracadabra.pdf";

const BookerScreen: React.FC<BookerScreenProps> = ({ onBack, preloadedFileUrl = null, fallbackPath = defaultFallback }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(preloadedFileUrl);
  const [isLoading, setIsLoading] = useState<boolean>(!Boolean(preloadedFileUrl));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // if App passed a preloaded URL, use it
    if (preloadedFileUrl) {
      setPdfUrl(preloadedFileUrl);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const loadPdf = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(fallbackPath, { method: "GET" });
        if (!res.ok) throw new Error("Arquivo não encontrado");

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        if (!cancelled) {
          setPdfUrl(url);
        }
      } catch (e: any) {
        console.error("BookerScreen: erro ao carregar PDF:", e);
        if (!cancelled) {
          setError("Não foi possível carregar o PDF do booker.");
          setPdfUrl(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadPdf();

    return () => {
      cancelled = true;
      // revoke object URL to avoid memory leak
      if (pdfUrl && pdfUrl.startsWith("blob:")) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preloadedFileUrl, fallbackPath]);

  return (
    <div className="min-h-screen p-6 bg-black text-white">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Booker</h1>
          <div className="flex gap-2">
            <button
              onClick={() => onBack?.()}
              className="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
              aria-label="Voltar"
            >
              Voltar
            </button>
            {pdfUrl && (
              <a
                href={pdfUrl}
                download="booker.pdf"
                className="px-3 py-1 rounded bg-gold text-black font-medium hover:opacity-90"
              >
                Baixar PDF
              </a>
            )}
          </div>
        </header>

        <main>
          {isLoading && (
            <div className="p-6 bg-white/3 rounded text-center">
              <p className="font-medium">Carregando conteúdo do booker…</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-900/60 rounded">
              <p className="text-sm text-red-200">{error}</p>
              <p className="text-xs text-white/70 mt-2">Verifique se /abracadabra.pdf existe na pasta public/</p>
            </div>
          )}

          {!isLoading && pdfUrl && (
            <div className="mt-4">
              {/* Mostramos um iframe simples para visualização rápida.
                  Se no futuro você tiver um PdfViewer componente (react-pdf), substitua aqui. */}
              <div className="w-full h-[70vh] rounded overflow-hidden border border-white/10">
                <iframe
                  title="Booker PDF"
                  src={pdfUrl}
                  className="w-full h-full"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              </div>
            </div>
          )}

          {!isLoading && !pdfUrl && !error && (
            <div className="p-4 bg-white/3 rounded">
              <p className="text-sm text-white/70">Nenhum documento disponível no momento.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BookerScreen;

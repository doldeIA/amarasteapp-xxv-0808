// src/components/DownloadsScreen.tsx
import React, { useState } from "react";

interface DownloadsScreenProps {
  onBack?: () => void;
}

type DownloadItem = {
  id: string;
  label: string;
  url?: string;
  description?: string;
};

const downloadsList: DownloadItem[] = [
  { id: "home", label: "Manual / Home PDF", url: "/home.pdf", description: "Conteúdo principal do projeto" },
  { id: "booker", label: "Booker (Abracadabra)", url: "/abracadabra.pdf", description: "Material do booker" },
  // adicione outros itens caso precise
];

const DownloadsScreen: React.FC<DownloadsScreenProps> = ({ onBack }) => {
  const [flashingButton, setFlashingButton] = useState<string | null>(null);
  const [showBackChoice, setShowBackChoice] = useState(false);

  const handleDownloadClick = (item: DownloadItem) => {
    setFlashingButton(item.id);
    // efeito visual temporário: remove o flash após 700ms
    setTimeout(() => setFlashingButton(null), 700);

    if (item.url) {
      // abre em nova aba para evitar problemas CORS no viewer do app
      window.open(item.url, "_blank", "noopener");
    } else {
      alert("Arquivo não disponível.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-black text-white">
      <header className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Downloads</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBackChoice(prev => !prev)}
            className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 transition"
          >
            Voltar
          </button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {downloadsList.map(item => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border border-white/10 bg-white/2 backdrop-blur-sm transition transform ${
              flashingButton === item.id ? "scale-98" : "scale-100"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{item.label}</h3>
                {item.description && <p className="text-sm text-white/70 mt-1">{item.description}</p>}
              </div>

              <div className="ml-4 flex flex-col items-end gap-2">
                <button
                  onClick={() => handleDownloadClick(item)}
                  className={`px-3 py-2 rounded neon-white-button text-sm font-bold transition active:scale-95 ${
                    flashingButton === item.id ? "animate-pulse" : ""
                  }`}
                  aria-label={`Baixar ${item.label}`}
                >
                  Baixar
                </button>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noreferrer" className="text-xs underline text-white/80">
                    Abrir
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showBackChoice && (
        <div className="mt-6">
          <p className="text-sm text-white/70">Escolher para onde voltar:</p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => onBack?.()}
              className="px-4 py-2 rounded bg-gold text-black font-medium"
            >
              Página Principal
            </button>
            <button
              onClick={() => setShowBackChoice(false)}
              className="px-4 py-2 rounded border border-white/20"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadsScreen;

// src/components/EcossistemaPage.tsx
import React from "react";
import { Screen } from "../App";

interface EcossistemaPageProps {
  onNavigate?: (s: Screen) => void;
}

const EcossistemaPage: React.FC<EcossistemaPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen p-6 bg-black text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Ecossistema</h1>
        <p className="text-white/80 mb-6">
          Aqui ficam recursos e links do ecossistema Amarasté — navegue para ver
          conteúdos, produtos e áreas especiais.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <section className="p-4 bg-white/3 rounded-lg border border-white/10">
            <h2 className="font-semibold text-lg">Portal Mágico</h2>
            <p className="text-sm text-white/70 mt-2">
              Área com conteúdos especiais e experiências.
            </p>
            <button
              onClick={() => onNavigate?.("portalMagico")}
              className="mt-3 px-3 py-2 rounded bg-gold text-black font-medium"
            >
              Ir para Portal
            </button>
          </section>

          <section className="p-4 bg-white/3 rounded-lg border border-white/10">
            <h2 className="font-semibold text-lg">Revolução</h2>
            <p className="text-sm text-white/70 mt-2">
              Página de iniciativas e micro-revoluções.
            </p>
            <button
              onClick={() => onNavigate?.("revolucao")}
              className="mt-3 px-3 py-2 rounded bg-gold text-black font-medium"
            >
              Ir para Revolução
            </button>
          </section>
        </div>

        <div className="mt-8 text-sm text-white/60">
          <p>Se precisar voltar, use o menu superior.</p>
        </div>
      </div>
    </div>
  );
};

export default EcossistemaPage;

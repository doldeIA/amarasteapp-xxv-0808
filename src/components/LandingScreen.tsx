// src/components/LandingScreen.tsx
import React from "react";

interface Props {
  onAccess?: () => void;
}

const LandingScreen: React.FC<Props> = ({ onAccess }) => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-primary text-white">
      <div className="text-center px-6">
        <h1 className="text-4xl font-extrabold mb-6">AMARASTÉ LIVE</h1>
        <button
          onClick={() => onAccess?.()}
          className="w-full max-w-xs mx-auto px-6 py-3 rounded-lg font-bold neon-pulse border border-white bg-black/40"
        >
          ACESSAR
        </button>
        <p className="mt-6 text-sm text-white/70">Integrando — aguarde</p>
      </div>
    </div>
  );
};

export default LandingScreen;

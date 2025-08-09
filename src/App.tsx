// src/App.tsx
import React, { useState, useEffect, useRef } from "react";
import { GoogleGenAI, Chat } from "@google/genai";

import LandingScreen from "./components/LandingScreen";
import PdfViewerScreen from "./components/PdfViewerScreen";
import DownloadsScreen from "./components/DownloadsScreen";
import ChatWidget from "./components/ChatWidget";
import ChatModal, { Message } from "./components/ChatModal";
import Header from "./components/Header";
import IntegratingLoader from "./components/IntegratingLoader";
import BookerScreen from "./components/BookerScreen";
import EcossistemaPage from "./components/EcossistemaPage";
import SoundCloudPlayer from "./components/SoundCloudPlayer";
import SignUpModal from "./components/SignUpModal";
import RevolucaoPage from "./components/RevolucaoPage";
import ProdutosLoginPage from "./components/ProdutosLoginPage";
import AdminPanel from "./components/AdminPanel";
import AdminLoginModal from "./components/AdminLoginModal";
import AdminHomePage from "./components/AdminHomePage";

const PDF_PATH = "/home.pdf";
const BOOKER_PDF_PATH = "/abracadabra.pdf";

export type Screen =
  | "landing"
  | "pdf"
  | "downloads"
  | "booker"
  | "portalMagico"
  | "revolucao"
  | "produtosLogin"
  | "adminHome"
  | null;

/* ---------------- IndexedDB helper (light) ---------------- */
const DB_NAME = "AmarasteAppDB";
const DB_VERSION = 1;
const STORE_NAME = "pdfStore";

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = (e) => reject((e.target as IDBRequest).error);
    req.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    };
  });

export const savePdfToDb = async (file: File, pageKey: string): Promise<void> => {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.put({ id: pageKey, filename: file.name, data: file, created_at: new Date().toISOString() }, pageKey);
  return new Promise((res, rej) => {
    tx.oncomplete = () => {
      db.close();
      res();
    };
    tx.onerror = () => {
      db.close();
      rej(tx.error);
    };
  });
};

export const loadPdfFromDb = async (pageKey: string): Promise<Blob | null> => {
  const db = await openDb();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(pageKey);
    tx.oncomplete = () => {
      db.close();
      const result = req.result;
      if (result && result.data instanceof Blob) res(result.data);
      else res(null);
    };
    tx.onerror = () => {
      db.close();
      rej(tx.error);
    };
  });
};

export const removePdfFromDb = async (pageKey: string): Promise<void> => {
  const db = await openDb();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(pageKey);
    tx.oncomplete = () => {
      db.close();
      res();
    };
    tx.onerror = () => {
      db.close();
      rej(tx.error);
    };
  });
};
/* --------------------------------------------------------- */

const getInitialGreetingMessage = (): Message => ({
  sender: "assistant",
  text: "Boa Quinta-feira! Que bom ter você aqui. Sobre o que gostaria de falar hoje?",
});

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>("landing");
  const [isIntegrating, setIsIntegrating] = useState(false);
  const [mainPdfUrl, setMainPdfUrl] = useState<string | null>(null);
  const [bookerPdfUrl, setBookerPdfUrl] = useState<string | null>(null);
  const [uploadCount, setUploadCount] = useState(0);

  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([getInitialGreetingMessage()]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const stopGenerationRef = useRef(false);

  /* ---------- initialize chat using import.meta.env (Vite) ---------- */
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
        if (!apiKey) {
          console.warn("VITE_GEMINI_API_KEY not found — chat will stay disabled.");
          setChatError("Chat desativado: chave da API não configurada.");
          return;
        }
        const ai = new GoogleGenAI({ apiKey });
        const chatSession = ai.chats.create({
          model: "gemini-2.5-flash",
          config: { systemInstruction: "Você é Amarasté..." },
        });
        setChat(chatSession);
      } catch (e: any) {
        console.error("Failed to initialize AI Chat:", e);
        setChatError("Erro ao inicializar chat.");
      }
    };
    initializeChat();
  }, []);
  /* ----------------------------------------------------------------- */

  const handleAccess = () => {
    setIsIntegrating(true);

    const loadMainPdf = async (): Promise<string> => {
      try {
        // tenta direto do public/
        const res = await fetch(PDF_PATH);
        if (!res.ok) throw new Error(`PDF não encontrado (status ${res.status})`);
        const blob = await res.blob();
        const file = new File([blob], "home.pdf", { type: "application/pdf" });
        await savePdfToDb(file, "pdf");
        return URL.createObjectURL(blob);
      } catch (err) {
        console.error("Failed to load main PDF for preloading:", err);
        throw err;
      }
    };

    loadMainPdf()
      .then((url) => {
        setMainPdfUrl(url);
        setActiveScreen("pdf");
        setIsIntegrating(false);
      })
      .catch((err) => {
        setIsIntegrating(false);
        setChatError("Não foi possível carregar o conteúdo (PDF).");
      });
  };

  const handleNavigate = (screen: Screen) => setActiveScreen(screen);

  const handleUploadPdf = async (file: File, pageKey: string) => {
    await savePdfToDb(file, pageKey);
    setUploadCount((p) => p + 1);
  };

  const renderContent = () => {
    switch (activeScreen) {
      case "landing":
        return <LandingScreen onAccess={handleAccess} />;
      case "pdf":
        return (
          <PdfViewerScreen
            key={"pdf" + uploadCount}
            pageKey="pdf"
            fallbackPath={PDF_PATH}
            preloadedFileUrl={mainPdfUrl}
            onPage1Rendered={() => setIsIntegrating(false)}
          />
        );
      case "downloads":
        return <DownloadsScreen onBack={() => handleNavigate("pdf")} />;
      case "booker":
        return <BookerScreen />;
      case "portalMagico":
        return <EcossistemaPage onNavigate={handleNavigate} />;
      case "revolucao":
        return <RevolucaoPage onNavigateHome={() => handleNavigate("pdf")} />;
      case "produtosLogin":
        return <ProdutosLoginPage onNavigateHome={() => handleNavigate("pdf")} onNavigateToSignUp={() => {}} />;
      case "adminHome":
        return <AdminHomePage onBack={() => handleNavigate("pdf")} />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen w-full ${activeScreen === "landing" ? "bg-primary" : "bg-black"} text-white`}>
      {activeScreen !== "landing" && (
        <Header activeScreen={activeScreen as string} onNavigateHome={() => handleNavigate("pdf")} onNavigateDownloads={() => handleNavigate("downloads")} onOpenSignUpModal={() => {}} />
      )}

      {renderContent()}

      {isIntegrating && <IntegratingLoader />}

      {/* small always-present widgets */}
      <ChatWidget onOpen={() => {}} />
      <ChatModal messages={messages} isLoading={isChatLoading} error={chatError} onClose={() => {}} onSendMessage={async () => {}} onStopGeneration={() => {}} />

      <SignUpModal isOpen={false} onClose={() => {}} onSwitchToLogin={() => {}} />
      <AdminPanel onClose={() => {}} onUpload={handleUploadPdf} onRemove={async () => {}} />
      <AdminLoginModal onClose={() => {}} onLogin={() => true} />
    </div>
  );
};

export default App;

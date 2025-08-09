// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import LandingScreen from './components/LandingScreen';
import PdfViewerScreen from './components/PdfViewerScreen';
import DownloadsScreen from './components/DownloadsScreen';
import ChatWidget from './components/ChatWidget';
import ChatModal, { Message } from './components/ChatModal';
import Header from './components/Header';
import IntegratingLoader from './components/IntegratingLoader';
import BookerScreen from './components/BookerScreen';
import EcossistemaPage from './components/EcossistemaPage';
import SoundCloudPlayer from './components/SoundCloudPlayer';
import SignUpModal from './components/SignUpModal';
import RevolucaoPage from './components/RevolucaoPage';
import ProdutosLoginPage from './components/ProdutosLoginPage';
import AdminPanel from './components/AdminPanel';
import AdminLoginModal from './components/AdminLoginModal';
import AdminHomePage from './components/AdminHomePage';

const PDF_PATH = "/home.pdf";
const BOOKER_PDF_PATH = "/abracadabra.pdf";

type Screen = 'landing' | 'pdf' | 'downloads' | 'booker' | 'portalMagico' | 'revolucao' | 'produtosLogin' | 'adminHome' | null;

const getInitialGreetingMessage = (): Message => {
  return {
    sender: 'assistant',
    text: `Boa Quinta-feira!\nQue bom ter você aqui. Sobre o que você gostaria de falar hoje?`
  };
};

const DB_NAME = 'AmarasteAppDB';
const DB_VERSION = 1;
const STORE_NAME = 'pdfStore';

const openDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => reject((event.target as IDBRequest).error);
    request.onsuccess = (event) => resolve((event.target as IDBRequest).result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

export const savePdfToDb = async (file: File, pageKey: string): Promise<void> => {
  const db = await openDb();
  const pdfAsset = {
    id: pageKey,
    filename: file.name,
    page_key: pageKey,
    data: file,
    created_at: new Date().toISOString(),
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(pdfAsset, pageKey);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
};

export const loadPdfFromDb = async (pageKey: string): Promise<Blob | null> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(pageKey);

    transaction.oncomplete = () => {
      db.close();
      const result = request.result;
      if (result && result.data instanceof Blob) {
          resolve(result.data);
      } else {
          resolve(null);
      }
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
};

export const removePdfFromDb = async (pageKey: string): Promise<void> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(pageKey);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
};

const systemInstruction = `**Sua Identidade Central: O Espelho da Alma (com um toque de humor)** ... (mantive seu texto original aqui)`;

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('landing');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isIntegrating, setIsIntegrating] = useState(false);
  const [mainPdfUrl, setMainPdfUrl] = useState<string | null>(null);
  const [bookerPdfUrl, setBookerPdfUrl] = useState<string | null>(null);
  const [uploadCount, setUploadCount] = useState(0);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([getInitialGreetingMessage()]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const stopGenerationRef = useRef(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [lastScreenBeforeAdmin, setLastScreenBeforeAdmin] = useState<Screen>('landing');

  useEffect(() => {
    const initializeChat = async () => {
        try {
            if (!process.env.API_KEY) {
              throw new Error("API_KEY environment variable not set.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const chatSession = ai.chats.create({
              model: 'gemini-2.5-flash',
              config: {
                systemInstruction: systemInstruction,
              },
            });
            setChat(chatSession);
        } catch (e: any) {
            console.error("Failed to initialize AI Chat:", e);
            setChatError("Não foi possível iniciar o chat. Verifique a chave da API.");
        }
    };

    initializeChat();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (isAdminLoggedIn) {
            setIsAdminPanelOpen(prev => !prev);
        } else {
            setLastScreenBeforeAdmin(activeScreen);
            setIsAdminLoginModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminLoggedIn, activeScreen]);

  // ... (mantive o restante das funções handleX exatamente como você tinha)

  const handleAccess = () => {
    setIsIntegrating(true);

    const loadMainPdf = async (): Promise<string> => {
      try {
        let pdfBlob = await loadPdfFromDb('pdf');

        if (!pdfBlob && PDF_PATH) {
          const response = await fetch(PDF_PATH);
          if (!response.ok) throw new Error(`O arquivo PDF principal não foi encontrado.`);
          pdfBlob = await response.blob();
          const file = new File([pdfBlob], `pdf.pdf`, { type: "application/pdf" });
          await savePdfToDb(file, 'pdf');
        }

        if (pdfBlob) {
          return URL.createObjectURL(pdfBlob);
        } else {
          throw new Error('Nenhum conteúdo PDF foi encontrado para a página principal.');
        }
      } catch (e: any) {
        console.error("Failed to load main PDF for preloading:", e);
        throw e;
      }
    };

    loadMainPdf()
      .then((loadedPdfUrl) => {
        setMainPdfUrl(loadedPdfUrl);
        setActiveScreen('pdf');
      })
      .catch((error) => {
        console.error("Integration process failed:", error);
        setIsIntegrating(false);
        alert("Não foi possível carregar o conteúdo. Por favor, tente novamente.");
      });
  };

  // restante do App: renderContent, return JSX etc.
  // mantenha o restante do seu App exatamente como está, apenas garanta que o LandingScreen esteja importado como acima.

  return (
    <div className={`w-full min-h-screen ${activeScreen !== 'landing' ? 'bg-black' : 'bg-primary'} transition-colors duration-500 ease-out`}>
      {activeScreen !== 'landing' && (
        <Header
          activeScreen={activeScreen}
          onNavigateDownloads={() => setActiveScreen('downloads')}
          onNavigateHome={() => setActiveScreen('pdf')}
          onNavigateToPage={(page) => setActiveScreen(page as Screen)}
          onOpenSignUpModal={() => setIsSignUpModalOpen(true)}
        />
      )}

      {activeScreen === 'landing' && <LandingScreen onAccess={handleAccess} />}

      {/* Copie o restante do seu JSX aqui — o resto do seu arquivo pode permanecer idêntico */}
    </div>
  );
};

export default App;


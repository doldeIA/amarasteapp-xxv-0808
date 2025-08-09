// src/components/Header.tsx
import React, { useState, useEffect, useRef } from "react";
import MenuIcon from "./icons/MenuIcon";
import CloseIcon from "./icons/CloseIcon";
import InstagramIcon from "./icons/InstagramIcon";
import SoundCloudIcon from "./icons/SoundCloudIcon";
import SpotifyIcon from "./icons/SpotifyIcon";
import YouTubeIcon from "./icons/YouTubeIcon";
import PaperPlaneIcon from "./icons/PaperPlaneIcon";
import PhoneIcon from "./icons/PhoneIcon";
import LinkedInIcon from "./icons/LinkedInIcon";
import UserGroupIcon from "./icons/UserGroupIcon";
import { Screen } from "../App";

interface HeaderProps {
  activeScreen?: Screen;
  onNavigateDownloads?: () => void;
  onNavigateHome?: () => void;
  onNavigateToPage?: (page: Screen) => void;
  onOpenSignUpModal?: () => void;
}

type MenuItem = {
  id: string;
  label: string;
  action: () => void;
  icon?: React.ReactNode;
  specialClass?: string;
};

const Header: React.FC<HeaderProps> = ({
  activeScreen,
  onNavigateDownloads,
  onNavigateHome,
  onNavigateToPage,
  onOpenSignUpModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleNavigate = (page: Screen) => {
    onNavigateToPage?.(page);
    setIsOpen(false);
  };

  const menuItems: MenuItem[] = [
    { id: "home", label: "Início", action: () => onNavigateHome?.(), icon: <PaperPlaneIcon /> },
    { id: "pdf", label: "Conteúdo (PDF)", action: () => handleNavigate("pdf"), icon: <DownloadIconFallback /> },
    { id: "booker", label: "Booker", action: () => handleNavigate("booker"), icon: <UserGroupIcon /> },
    { id: "downloads", label: "Downloads", action: () => onNavigateDownloads?.(), icon: <DownloadIconFallback /> },
    { id: "portal", label: "Ecossistema", action: () => handleNavigate("portalMagico"), icon: <LinkedInIcon /> },
  ];

  return (
    <header className="w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo / Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigateHome?.()}
              className="text-white font-bold text-lg tracking-wide hover:opacity-90"
              aria-label="Ir para início"
            >
              Amarasté
            </button>
            <nav className="hidden md:flex items-center gap-2">
              {menuItems.slice(0, 3).map((mi) => (
                <button
                  key={mi.id}
                  onClick={mi.action}
                  className={`px-3 py-1 rounded text-sm text-white/90 hover:bg-white/5 transition ${
                    activeScreen === mi.id ? "outline outline-1 outline-white/20" : ""
                  }`}
                >
                  {mi.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <a href="https://soundcloud.com" target="_blank" rel="noreferrer" className="opacity-90 hover:opacity-100">
                <SoundCloudIcon />
              </a>
              <a href="https://open.spotify.com" target="_blank" rel="noreferrer" className="opacity-90 hover:opacity-100">
                <SpotifyIcon />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="opacity-90 hover:opacity-100">
                <YouTubeIcon />
              </a>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => onOpenSignUpModal?.()}
                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm"
              >
                Entrar / Cadastre-se
              </button>
            </div>

            {/* Mobile menu toggle */}
            <div className="md:hidden" ref={menuRef}>
              <button
                onClick={() => setIsOpen((s) => !s)}
                className="p-2 rounded hover:bg-white/5 transition"
                aria-label="Abrir menu"
              >
                {isOpen ? <CloseIcon /> : <MenuIcon />}
              </button>

              {isOpen && (
                <div className="absolute right-4 mt-2 w-56 bg-black/90 border border-white/10 rounded-lg shadow-lg py-2">
                  <div className="flex flex-col">
                    {menuItems.map((mi) => (
                      <button
                        key={mi.id}
                        onClick={() => {
                          mi.action();
                          setIsOpen(false);
                        }}
                        className="text-left px-4 py-2 hover:bg-white/5"
                      >
                        {mi.label}
                      </button>
                    ))}

                    <div className="border-t border-white/6 mt-2 pt-2 px-4">
                      <button
                        onClick={() => onOpenSignUpModal?.()}
                        className="w-full text-left px-2 py-2 rounded hover:bg-white/5"
                      >
                        Entrar / Cadastre-se
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

/**
 * Fallback simple icon component for Download (in case original icon file name differs).
 * If you have a DownloadIcon component in ./icons, it will be used automatically by that import.
 * This ensures the Header file is self-contained if the specific Download icon import wasn't present.
 */
function DownloadIconFallback() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline-block">
      <path d="M12 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default Header;

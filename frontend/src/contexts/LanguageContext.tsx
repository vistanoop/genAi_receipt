/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "hi" | "bn" | "ta" | "te" | "mr" | "gu" | "kn";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("googtrans")?.split("/").pop();
    return (saved as Language) || "en";
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const checkGoogleTranslate = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).google && (window as any).google.translate) {
        setLoading(false);
        clearInterval(checkGoogleTranslate);
      }
    }, 100);

    const timeout = setTimeout(() => {
      setLoading(false);
      clearInterval(checkGoogleTranslate);
    }, 3000);

    return () => {
      clearInterval(checkGoogleTranslate);
      clearTimeout(timeout);
    };
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);

    const cookieValue = `/en/${lang}`;
    document.cookie = `googtrans=${cookieValue}; path=/`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
    window.location.reload();
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  translations: Record<string, string>;
  englishTranslations: Record<string, string>;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [englishTranslations, setEnglishTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      setIsLoading(true);
      try {
        // Always fetch the English translations as a fallback
        const enResponse = await fetch(`/locales/en.json`);
        if (enResponse.ok) {
          const enData = await enResponse.json();
          setEnglishTranslations(enData);
        } else {
          console.error('Could not load English translations.');
        }

        // If the selected language is not English, fetch its translations
        if (language !== 'en') {
          const response = await fetch(`/locales/${language}.json`);
          if (response.ok) {
            const data = await response.json();
            setTranslations(data);
          } else {
            console.error(`Could not load translations for ${language}, falling back to English.`);
            setTranslations({}); // Fallback to empty, will use English map
          }
        } else {
          setTranslations({}); // For English, we'll use the englishTranslations map directly
        }
      } catch (error) {
        console.error('Failed to fetch translations:', error);
        setTranslations({}); // Fallback on any error
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, [language]);

  const handleSetLanguage = useCallback((lang: string) => {
    setLanguage(lang);
  }, []);
  
  const contextValue = {
    language,
    setLanguage: handleSetLanguage,
    translations,
    englishTranslations
  };

  // Prevent rendering children until the initial (English) translations are loaded
  if (isLoading && Object.keys(englishTranslations).length === 0) {
      return null;
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

'use client';

import { useContext } from 'react';
import { LanguageContext } from '@/context/LanguageContext';
import type { Translatable } from '@/lib/data';

export const useTranslation = () => {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }

  const { translations, englishTranslations, language, setLanguage } = context;

  /**
   * Translates a given key or a Translatable object.
   * - If the input is a string, it looks up the key in the current language's translations file.
   *   If not found, it falls back to the English translation for that key.
   * - If the input is a Translatable object, it selects the string for the current language.
   *   If not found, it falls back to the English string from the object.
   * - If the key is not found anywhere, it returns the key itself.
   */
  const t = (key: string | Translatable | null | undefined): string => {
    if (!key) {
      return '';
    }

    // Handle Translatable objects
    if (typeof key === 'object') {
        const translatable = key as Translatable;
        return translatable[language as keyof Translatable] || translatable.en;
    }
    
    // Handle string keys
    if (typeof key === 'string') {
        if (language === 'en') {
            return englishTranslations[key] || key;
        }
        return translations[key] || englishTranslations[key] || key;
    }

    return '';
  };

  return { t, language, setLanguage };
};

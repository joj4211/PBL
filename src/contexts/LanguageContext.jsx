import { createContext, useContext, useState } from 'react';
import uiZh from '../i18n/ui.zh.json';
import uiEn from '../i18n/ui.en.json';

const uiStrings = { zh: uiZh, en: uiEn };

export const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('zh');
  const ui = uiStrings[lang];
  return (
    <LanguageContext.Provider value={{ lang, setLang, ui }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

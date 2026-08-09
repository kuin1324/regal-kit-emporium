import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";

// The site is English-only. The language switcher has been removed.
export const languages = [{ code: "en", label: "English", flag: "🇬🇧" }];

// Clear any previously stored language preference so old visitors also get English.
try {
  localStorage.removeItem("i18nextLng");
} catch {
  /* ignore */
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en } },
  lng: "en",
  fallbackLng: "en",
  supportedLngs: ["en"],
  interpolation: { escapeValue: false },
});

export default i18n;

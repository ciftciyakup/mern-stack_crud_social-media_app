import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector) // Tarayıcı dilini otomatik algılar
  .use(initReactI18next) // React entegrasyonu
  .init({
    resources: {
      en: {
        translation: require("./locales/en/translation.json"), // Yeni yol
      },
      tr: {
        translation: require("./locales/tr/translation.json"), // Yeni yol
      },
    },
    fallbackLng: "tr", // Dil algılanamazsa varsayılan dil
    interpolation: {
      escapeValue: false, // React zaten XSS koruması sağlıyor
    },
  });

export default i18n;

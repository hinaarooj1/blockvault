import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import enTranslation from "./locales/en.json";
import frTranslation from "./locales/fr.json";

i18n
    .use(HttpBackend) // Load translation files from the public/locales folder
    .use(LanguageDetector) // Detect user language
    .use(initReactI18next) // Bind i18next to React
    .init({
        lng: 'en',
        fallbackLng: "en", // Default language
        debug: true, // Show debug logs in development
        interpolation: {
            escapeValue: false, // React already escapes values
        },
        resources: {
            en: { translation: enTranslation },
            fr: { translation: frTranslation }
        },
    });

export default i18n;

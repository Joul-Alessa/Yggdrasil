import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // opcional
import HttpBackend from 'i18next-http-backend'; // opcional para cargar desde archivos externos

i18n
  .use(HttpBackend) // cargar traducciones desde /public/locales
  .use(LanguageDetector) // detecta idioma automáticamente
  .use(initReactI18next) // conecta con React
  .init({
    fallbackLng: 'en', // idioma por defecto
    debug: false,
    interpolation: {
      escapeValue: false, // React ya protege contra XSS
    },
    supportedLngs: ['en', 'es-419'],
  });

export default i18n;
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en';
import fr from '../locales/fr';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            fr: { translation: fr }
        },
        fallbackLng: 'en',
        supportedLngs: ['en', 'fr'],
        debug: process.env.NODE_ENV !== 'production',
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: '/api/translations/{{lng}}',
        }
    });

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './en.json';
import pt from './pt.json';

const resources = {
  en: { translation: en },
  pt: { translation: pt }
};

const deviceLocales = Localization.getLocales();
const defaultLanguage = deviceLocales[0]?.languageCode?.startsWith('en') ? 'en' : 'pt';

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources,
    lng: defaultLanguage,
    fallbackLng: 'pt',
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false
    }
  });
}

export default i18n;

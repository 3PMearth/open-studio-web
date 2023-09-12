import 'server-only';
import type { Locale } from './i18n-config';

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const messages = {
  en: () => import('./messages/en.json').then((module) => module.default),
  ko: () => import('./messages/ko.json').then((module) => module.default),
};

export const getMessages = async (locale: Locale) => messages[locale]();

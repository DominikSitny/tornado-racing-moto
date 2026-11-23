import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['de', 'en', 'pl'],
  defaultLocale: 'de',
  // Kein Sprach-Cookie: die Sprache steht in der URL (/de, /en, /pl). So setzt die Seite keine Cookies.
  localeCookie: false,
});

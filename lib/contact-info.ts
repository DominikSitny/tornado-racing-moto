/**
 * Firmen- und Kontaktdaten – zentral gepflegt.
 * Werden im Impressum, in der Datenschutzerklärung, auf der Kontaktseite und im Footer verwendet.
 */
export const contactInfo = {
  /** Verantwortliche Person / Inhaber */
  owner: 'Piotr Sitny',
  businessName: 'Tornado Racing Moto',
  address: {
    street: 'Goła 66',
    postalCode: '46-310',
    city: 'Gorzów Śląski',
    country: { de: 'Polen', en: 'Poland', pl: 'Polska' },
  },
  phones: [
    { label: 'PL', number: '+48 605 530 992' },
    { label: 'DE', number: '+49 160 9873 4008' },
  ],
  email: 'tornado-racing-moto@wp.pl',
  /**
   * Gewerbe-Angaben fürs Impressum. Solange `null`, erscheinen sie nicht.
   * Beispiel: nip: '1234567890', vatId: 'PL1234567890'
   */
  nip: '5761460479' as string | null,
  /** Laut EU-VIES am 23.11.2026 als gültig bestätigt (Piotr Sitny, Goła 66, 46-310 Gorzów Śląski). */
  vatId: 'PL5761460479' as string | null,
  instagram: {
    handle: '@tornadoracingmoto',
    url: 'https://instagram.com/tornadoracingmoto',
  },
  facebook: {
    name: 'Tornado Racing Moto',
    url: 'https://www.facebook.com/p/Tornado-Racing-Moto-100054281929959/',
  },
};

/** Turns a display phone number into a tel: link target. */
export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

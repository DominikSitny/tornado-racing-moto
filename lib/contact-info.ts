/**
 * Kontaktdaten – zentral gepflegt, werden auf Kontaktseite, Über uns und im Footer verwendet.
 *
 * `phone` ist absichtlich `null`: Die bisherige Nummer war ein Platzhalter.
 * Trag hier die echte Nummer ein (z. B. '+49 151 12345678'), dann erscheint sie automatisch.
 */
export const contactInfo = {
  email: 'tornado-racing-moto@wp.pl',
  phone: null as string | null,
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

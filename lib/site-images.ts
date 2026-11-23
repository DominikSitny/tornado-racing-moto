/**
 * Fotos für die Website.
 *
 * Lege die Bilder in `public/images/site/` ab und trage hier den Pfad ein,
 * z. B. hero: '/images/site/hero.jpg'. Solange ein Eintrag `null` ist,
 * wird stattdessen eine technische Zeichnung als Platzhalter angezeigt.
 */
export const siteImages: Record<'hero' | 'workshop' | 'team', string | null> = {
  // Großes Bild rechts im Startbereich – z. B. eine Nockenwelle freigestellt
  // oder in der Maschine. Querformat, mindestens 1600 px breit.
  // Speedway-Foto von Michał Gołda (@Majkel1980), Lizenz CC0 – frei nutzbar, auch gewerblich.
  hero: '/images/site/hero-speedway.jpg',
  // Werkstatt / Maschine / Prüfstand – Abschnitt „So läuft eine Anfrage“.
  // Hochformat oder quadratisch, mindestens 1200 px breit.
  workshop: null,
  // Team- oder Personenfoto – Seite „Über uns“. Querformat, mindestens 1600 px breit.
  team: null,
};

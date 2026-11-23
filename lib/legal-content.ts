import { contactInfo } from '@/lib/contact-info';
import { Locale } from '@/lib/types';

/**
 * Impressum und Datenschutzerklärung (DE / EN / PL).
 * Beschreibt nur, was die Website tatsächlich tut (Stand: November 2026):
 * Hosting bei Vercel, Katalog/Bilder bei Supabase, Kontaktformular über Resend,
 * Vercel Web Analytics ohne Cookies, lokal eingebundene Schriften, keine Cookies.
 * Bei Änderungen an der Website (z. B. neue Dienste, Cookies) bitte anpassen.
 */

export interface LegalSection {
  title: string;
  /** Paragraphs; a paragraph may contain line breaks. */
  body: string[];
}

export interface LegalDocument {
  title: string;
  lead?: string;
  sections: LegalSection[];
  updated: string;
}

const c = contactInfo;

function addressBlock(locale: Locale) {
  return [c.businessName, c.owner, c.address.street, `${c.address.postalCode} ${c.address.city}`, c.address.country[locale]].join('\n');
}

function contactBlock(locale: Locale) {
  const phone = { de: 'Telefon', en: 'Phone', pl: 'Telefon' }[locale];
  const mail = { de: 'E-Mail', en: 'Email', pl: 'E-mail' }[locale];
  return [...c.phones.map((p) => `${phone} (${p.label}): ${p.number}`), `${mail}: ${c.email}`].join('\n');
}

function registrationBlock(locale: Locale): string[] {
  const lines: string[] = [];
  if (c.nip) lines.push(`NIP: ${c.nip}`);
  if (c.vatId) lines.push(`${{ de: 'USt-IdNr.', en: 'VAT ID', pl: 'NIP UE' }[locale]}: ${c.vatId}`);
  return lines.length ? [lines.join('\n')] : [];
}

const UPDATED = { de: 'Stand: November 2026', en: 'Last updated: November 2026', pl: 'Stan: listopad 2026' };

export function getImprint(locale: Locale): LegalDocument {
  if (locale === 'en') {
    return {
      title: 'Imprint',
      sections: [
        { title: 'Provider', body: [addressBlock('en'), ...registrationBlock('en')] },
        { title: 'Contact', body: [contactBlock('en')] },
        { title: 'Responsible for the content', body: [`${c.owner}, ${c.address.street}, ${c.address.postalCode} ${c.address.city}, ${c.address.country.en}`] },
        { title: 'Image credits', body: ['Speedway photo on the home page: Michał Gołda (@Majkel1980), licensed under CC0.'] },
        {
          title: 'Liability for links',
          body: ['Our website contains links to external websites (e.g. Instagram, Facebook). We have no influence on their content; the respective provider is responsible for it.'],
        },
      ],
      updated: UPDATED.en,
    };
  }
  if (locale === 'pl') {
    return {
      title: 'Nota prawna',
      sections: [
        { title: 'Usługodawca', body: [addressBlock('pl'), ...registrationBlock('pl')] },
        { title: 'Kontakt', body: [contactBlock('pl')] },
        { title: 'Odpowiedzialny za treść', body: [`${c.owner}, ${c.address.street}, ${c.address.postalCode} ${c.address.city}, ${c.address.country.pl}`] },
        { title: 'Źródła zdjęć', body: ['Zdjęcie żużlowe na stronie głównej: Michał Gołda (@Majkel1980), licencja CC0.'] },
        {
          title: 'Odpowiedzialność za linki',
          body: ['Nasza strona zawiera linki do zewnętrznych serwisów (np. Instagram, Facebook). Nie mamy wpływu na ich treść; odpowiada za nią dany operator.'],
        },
      ],
      updated: UPDATED.pl,
    };
  }
  return {
    title: 'Impressum',
    sections: [
      { title: 'Anbieter', body: [addressBlock('de'), ...registrationBlock('de')] },
      { title: 'Kontakt', body: [contactBlock('de')] },
      { title: 'Verantwortlich für den Inhalt', body: [`${c.owner}, ${c.address.street}, ${c.address.postalCode} ${c.address.city}, ${c.address.country.de}`] },
      { title: 'Bildnachweis', body: ['Speedway-Foto auf der Startseite: Michał Gołda (@Majkel1980), Lizenz CC0.'] },
      {
        title: 'Haftung für Links',
        body: ['Unsere Website enthält Links zu externen Websites (z. B. Instagram, Facebook). Auf deren Inhalte haben wir keinen Einfluss; dafür ist der jeweilige Anbieter verantwortlich.'],
      },
    ],
    updated: UPDATED.de,
  };
}

export function getPrivacy(locale: Locale): LegalDocument {
  if (locale === 'en') {
    return {
      title: 'Privacy policy',
      lead: 'This policy explains which personal data is processed when you use this website, and what rights you have.',
      sections: [
        { title: '1. Controller', body: [addressBlock('en'), contactBlock('en')] },
        {
          title: '2. Hosting and server log files',
          body: [
            'This website is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. When you visit the website, Vercel processes technically necessary data such as your IP address, date and time of the request, the page requested, the referring page, and browser and operating system.',
            'This is necessary to deliver the website and keep it secure (legal basis: Art. 6(1)(f) GDPR – legitimate interest in a secure, working website). Data may be transferred to the USA; this is based on appropriate safeguards (EU-US Data Privacy Framework or EU Standard Contractual Clauses).',
          ],
        },
        {
          title: '3. Product catalogue and images',
          body: [
            'Catalogue content and product images are stored with Supabase Inc. (database and file storage). No personal data of visitors is stored there; your browser does not connect to Supabase directly when you view the catalogue.',
          ],
        },
        {
          title: '4. Contact form, email and phone',
          body: [
            'If you contact us via the contact form, we process your name, email address and message in order to answer your enquiry. The form is sent via the email service Resend (Resend Inc., USA) to our mailbox at wp.pl (Wirtualna Polska Media S.A., Poland); you also receive a confirmation email. The data is not stored in a database on this website.',
            'The same applies when you contact us by email or phone. Legal basis: Art. 6(1)(b) GDPR (steps prior to a contract) and Art. 6(1)(f) GDPR (legitimate interest in answering enquiries). We delete the data once your enquiry has been dealt with, unless statutory retention obligations apply.',
          ],
        },
        {
          title: '5. Visitor statistics (Vercel Web Analytics)',
          body: [
            'To understand how the website is used, we use Vercel Web Analytics. It works without cookies and records, for example, the page visited, the referring page, country, device type and browser. Visitors are not identified and are not recognised across days.',
            'Legal basis: Art. 6(1)(f) GDPR (legitimate interest in improving the website).',
          ],
        },
        {
          title: '6. Cookies and local storage',
          body: [
            'This website does not use cookies. Fonts are hosted on our own server; no connection to Google is made.',
            'Only in the password-protected admin area is the login stored in your browser’s session storage for the duration of the session; it is deleted when the tab is closed.',
          ],
        },
        {
          title: '7. Links to social networks',
          body: ['We only link to our Instagram and Facebook profiles. No data is transmitted to these networks until you click a link.'],
        },
        {
          title: '8. Your rights',
          body: [
            'You have the right to access (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20) and to object to processing based on legitimate interest (Art. 21). To exercise these rights, simply contact us using the details above.',
            'You also have the right to lodge a complaint with a supervisory authority, e.g. the President of the Personal Data Protection Office (Prezes UODO), ul. Stawki 2, 00-193 Warsaw, Poland, or the authority in your country of residence.',
          ],
        },
      ],
      updated: UPDATED.en,
    };
  }
  if (locale === 'pl') {
    return {
      title: 'Polityka prywatności',
      lead: 'Niniejsza polityka wyjaśnia, jakie dane osobowe są przetwarzane podczas korzystania z tej strony oraz jakie przysługują Ci prawa.',
      sections: [
        { title: '1. Administrator danych', body: [addressBlock('pl'), contactBlock('pl')] },
        {
          title: '2. Hosting i logi serwera',
          body: [
            'Strona jest hostowana przez Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. Podczas wizyty Vercel przetwarza niezbędne dane techniczne, takie jak adres IP, data i godzina zapytania, odwiedzana strona, strona odsyłająca oraz przeglądarka i system operacyjny.',
            'Jest to konieczne do udostępnienia strony i zapewnienia jej bezpieczeństwa (podstawa prawna: art. 6 ust. 1 lit. f RODO – prawnie uzasadniony interes w bezpiecznym i sprawnym działaniu strony). Dane mogą być przekazywane do USA na podstawie odpowiednich zabezpieczeń (EU-US Data Privacy Framework lub standardowe klauzule umowne UE).',
          ],
        },
        {
          title: '3. Katalog produktów i zdjęcia',
          body: [
            'Treści katalogu i zdjęcia produktów są przechowywane w Supabase Inc. (baza danych i magazyn plików). Nie są tam zapisywane dane osobowe odwiedzających; podczas przeglądania katalogu Twoja przeglądarka nie łączy się bezpośrednio z Supabase.',
          ],
        },
        {
          title: '4. Formularz kontaktowy, e-mail i telefon',
          body: [
            'Jeśli skontaktujesz się z nami przez formularz, przetwarzamy Twoje imię, adres e-mail i treść wiadomości w celu odpowiedzi na zapytanie. Formularz jest wysyłany za pośrednictwem usługi Resend (Resend Inc., USA) na naszą skrzynkę w wp.pl (Wirtualna Polska Media S.A., Polska); otrzymasz również e-mail z potwierdzeniem. Dane nie są zapisywane w bazie danych tej strony.',
            'To samo dotyczy kontaktu e-mailowego lub telefonicznego. Podstawa prawna: art. 6 ust. 1 lit. b RODO (działania przed zawarciem umowy) oraz art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes w odpowiadaniu na zapytania). Dane usuwamy po załatwieniu sprawy, o ile nie obowiązują ustawowe okresy przechowywania.',
          ],
        },
        {
          title: '5. Statystyki odwiedzin (Vercel Web Analytics)',
          body: [
            'Aby zrozumieć, jak korzystasz ze strony, używamy Vercel Web Analytics. Narzędzie działa bez plików cookie i rejestruje m.in. odwiedzaną stronę, stronę odsyłającą, kraj, typ urządzenia i przeglądarkę. Odwiedzający nie są identyfikowani ani rozpoznawani w kolejnych dniach.',
            'Podstawa prawna: art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes w ulepszaniu strony).',
          ],
        },
        {
          title: '6. Pliki cookie i pamięć lokalna',
          body: [
            'Strona nie używa plików cookie. Czcionki są hostowane na naszym serwerze; nie następuje połączenie z Google.',
            'Jedynie w chronionym hasłem panelu administracyjnym logowanie jest zapisywane w pamięci sesji przeglądarki na czas sesji; zostaje usunięte po zamknięciu karty.',
          ],
        },
        {
          title: '7. Linki do sieci społecznościowych',
          body: ['Umieszczamy wyłącznie linki do naszych profili na Instagramie i Facebooku. Dopiero po kliknięciu linku dane są przekazywane do tych serwisów.'],
        },
        {
          title: '8. Twoje prawa',
          body: [
            'Przysługuje Ci prawo dostępu do danych (art. 15 RODO), ich sprostowania (art. 16), usunięcia (art. 17), ograniczenia przetwarzania (art. 18), przenoszenia danych (art. 20) oraz sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie (art. 21). W tym celu skontaktuj się z nami, korzystając z powyższych danych.',
            'Masz również prawo wnieść skargę do organu nadzorczego – Prezesa Urzędu Ochrony Danych Osobowych (PUODO), ul. Stawki 2, 00-193 Warszawa.',
          ],
        },
      ],
      updated: UPDATED.pl,
    };
  }
  return {
    title: 'Datenschutzerklärung',
    lead: 'Hier erfährst du, welche personenbezogenen Daten bei der Nutzung dieser Website verarbeitet werden und welche Rechte du hast.',
    sections: [
      { title: '1. Verantwortlicher', body: [addressBlock('de'), contactBlock('de')] },
      {
        title: '2. Hosting und Server-Logfiles',
        body: [
          'Diese Website wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA, gehostet. Beim Aufruf verarbeitet Vercel technisch notwendige Daten wie IP-Adresse, Datum und Uhrzeit der Anfrage, die aufgerufene Seite, die zuvor besuchte Seite sowie Browser und Betriebssystem.',
          'Das ist erforderlich, um die Website auszuliefern und sicher zu betreiben (Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO – berechtigtes Interesse an einer sicheren, funktionierenden Website). Dabei können Daten in die USA übermittelt werden; dies erfolgt auf Grundlage geeigneter Garantien (EU-US Data Privacy Framework bzw. EU-Standardvertragsklauseln).',
        ],
      },
      {
        title: '3. Produktkatalog und Bilder',
        body: [
          'Kataloginhalte und Produktbilder werden bei Supabase Inc. gespeichert (Datenbank und Dateispeicher). Dort werden keine personenbezogenen Daten von Besuchern gespeichert; dein Browser stellt beim Ansehen des Katalogs keine direkte Verbindung zu Supabase her.',
        ],
      },
      {
        title: '4. Kontaktformular, E-Mail und Telefon',
        body: [
          'Wenn du uns über das Kontaktformular schreibst, verarbeiten wir Name, E-Mail-Adresse und Nachricht, um deine Anfrage zu beantworten. Das Formular wird über den E-Mail-Dienst Resend (Resend Inc., USA) an unser Postfach bei wp.pl (Wirtualna Polska Media S.A., Polen) gesendet; du erhältst außerdem eine Bestätigungs-E-Mail. Eine Speicherung in einer Datenbank dieser Website erfolgt nicht.',
          'Dasselbe gilt, wenn du uns per E-Mail oder Telefon kontaktierst. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Anbahnung eines Vertrags) und Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen). Wir löschen die Daten, sobald deine Anfrage erledigt ist, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.',
        ],
      },
      {
        title: '5. Besucherstatistik (Vercel Web Analytics)',
        body: [
          'Um zu verstehen, wie die Website genutzt wird, verwenden wir Vercel Web Analytics. Es arbeitet ohne Cookies und erfasst z. B. die aufgerufene Seite, die zuvor besuchte Seite, Land, Gerätetyp und Browser. Besucher werden dabei nicht identifiziert und nicht über mehrere Tage wiedererkannt.',
          'Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Verbesserung der Website).',
        ],
      },
      {
        title: '6. Cookies und lokale Speicherung',
        body: [
          'Diese Website verwendet keine Cookies. Schriftarten werden von unserem eigenen Server geladen; eine Verbindung zu Google findet nicht statt.',
          'Nur im passwortgeschützten Admin-Bereich wird die Anmeldung für die Dauer der Sitzung im Sitzungsspeicher deines Browsers abgelegt; sie wird beim Schließen des Tabs gelöscht.',
        ],
      },
      {
        title: '7. Links zu sozialen Netzwerken',
        body: ['Wir verlinken lediglich auf unsere Profile bei Instagram und Facebook. Erst wenn du einen Link anklickst, werden Daten an diese Netzwerke übertragen.'],
      },
      {
        title: '8. Deine Rechte',
        body: [
          'Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie auf Widerspruch gegen Verarbeitungen, die auf berechtigtem Interesse beruhen (Art. 21). Wende dich dazu einfach an die oben genannten Kontaktdaten.',
          'Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren, z. B. beim Präsidenten des polnischen Amtes für Datenschutz (Prezes UODO), ul. Stawki 2, 00-193 Warschau, oder bei der Aufsichtsbehörde an deinem Wohnort.',
        ],
      },
    ],
    updated: UPDATED.de,
  };
}

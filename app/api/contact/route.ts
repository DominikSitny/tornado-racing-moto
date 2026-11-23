import { NextRequest, NextResponse } from 'next/server';
import { escapeHtml, mailConfig, MailNotConfiguredError, sendMail } from '@/lib/mailer';
import { contactInfo } from '@/lib/contact-info';

type Locale = 'de' | 'en' | 'pl';

const emailTemplates = {
  de: {
    subject: 'Vielen Dank für Ihre Nachricht - Tornado Racing Moto',
    title: 'Vielen Dank!',
    greeting: (name: string) => `Hallo ${name},`,
    body: 'vielen Dank für Ihre Nachricht! Wir haben Ihre Anfrage erhalten und werden uns so schnell wie möglich bei Ihnen melden.',
    responseTime: 'In der Regel antworten wir innerhalb von 24-48 Stunden.',
    yourMessage: 'Ihre Nachricht:',
    regards: 'Mit freundlichen Grüßen,',
    team: 'Ihr Tornado Racing Moto Team',
    footer: 'Tornado Racing Moto | Nockenwellen & Speedway-Motorteile',
  },
  en: {
    subject: 'Thank you for your message - Tornado Racing Moto',
    title: 'Thank you!',
    greeting: (name: string) => `Hello ${name},`,
    body: 'Thank you for your message! We have received your inquiry and will get back to you as soon as possible.',
    responseTime: 'We usually respond within 24-48 hours.',
    yourMessage: 'Your message:',
    regards: 'Best regards,',
    team: 'Your Tornado Racing Moto Team',
    footer: 'Tornado Racing Moto | Camshafts & speedway engine parts',
  },
  pl: {
    subject: 'Dziękujemy za wiadomość - Tornado Racing Moto',
    title: 'Dziękujemy!',
    greeting: (name: string) => `Witaj ${name},`,
    body: 'Dziękujemy za wiadomość! Otrzymaliśmy Twoje zapytanie i odpowiemy najszybciej jak to możliwe.',
    responseTime: 'Zazwyczaj odpowiadamy w ciągu 24-48 godzin.',
    yourMessage: 'Twoja wiadomość:',
    regards: 'Z poważaniem,',
    team: 'Zespół Tornado Racing Moto',
    footer: 'Tornado Racing Moto | Wałki rozrządu i części żużlowe',
  },
};

const LIMITS = { name: 100, email: 200, message: 5000 };

const ERRORS = {
  de: {
    required: 'Bitte fülle alle Felder aus.',
    email: 'Bitte gib eine gültige E-Mail-Adresse ein.',
    tooLong: 'Deine Nachricht ist zu lang.',
    unavailable: `Das Formular ist gerade nicht verfügbar. Bitte schreib uns direkt an ${contactInfo.email}.`,
    failed: `Die Nachricht konnte nicht gesendet werden. Bitte versuche es erneut oder schreib uns an ${contactInfo.email}.`,
  },
  en: {
    required: 'Please fill in all fields.',
    email: 'Please enter a valid email address.',
    tooLong: 'Your message is too long.',
    unavailable: `The form is currently unavailable. Please email us directly at ${contactInfo.email}.`,
    failed: `Your message could not be sent. Please try again or email us at ${contactInfo.email}.`,
  },
  pl: {
    required: 'Uzupełnij wszystkie pola.',
    email: 'Podaj poprawny adres e-mail.',
    tooLong: 'Twoja wiadomość jest za długa.',
    unavailable: `Formularz jest chwilowo niedostępny. Napisz do nas bezpośrednio na ${contactInfo.email}.`,
    failed: `Nie udało się wysłać wiadomości. Spróbuj ponownie lub napisz na ${contactInfo.email}.`,
  },
};

export async function POST(request: NextRequest) {
  let locale: Locale = 'de';
  try {
    const body = await request.json();
    locale = (['de', 'en', 'pl'] as const).includes(body.locale) ? body.locale : 'de';
    const err = ERRORS[locale];
    const template = emailTemplates[locale];

    // Spam protection: real visitors never see or fill the hidden "website" field
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ success: true });
    }

    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim();
    const message = String(body.message ?? '').trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: err.required }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > LIMITS.email) {
      return NextResponse.json({ error: err.email }, { status: 400 });
    }
    if (name.length > LIMITS.name || message.length > LIMITS.message) {
      return NextResponse.json({ error: err.tooLong }, { status: 400 });
    }

    const safe = { name: escapeHtml(name), email: escapeHtml(email), message: escapeHtml(message) };

    // 1) Enquiry to the business mailbox – reply goes straight to the customer
    await sendMail({
      to: mailConfig().inbox,
      replyTo: email,
      subject: `Neue Kontaktanfrage von ${name.replace(/[\r\n]+/g, ' ')}`,
      text: `Neue Kontaktanfrage über die Website\n\nName: ${name}\nE-Mail: ${email}\nSprache: ${locale.toUpperCase()}\n\nNachricht:\n${message}\n\n– Antworte einfach auf diese E-Mail, die Antwort geht direkt an ${email}.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #001f3f; padding: 24px 30px;">
            <h1 style="color: white; margin: 0; font-size: 22px;">Neue Kontaktanfrage</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <p style="margin: 6px 0;"><strong>Name:</strong> ${safe.name}</p>
            <p style="margin: 6px 0;"><strong>E-Mail:</strong> <a href="mailto:${safe.email}">${safe.email}</a></p>
            <p style="margin: 6px 0;"><strong>Sprache:</strong> ${locale.toUpperCase()}</p>
            <h2 style="color: #001f3f; margin-top: 24px; font-size: 18px;">Nachricht</h2>
            <div style="background: white; padding: 20px; border: 1px solid #e5e7eb;">
              <p style="margin: 0; white-space: pre-wrap;">${safe.message}</p>
            </div>
            <p style="color: #6b7280; font-size: 13px; margin-top: 20px;">Antworte einfach auf diese E-Mail – die Antwort geht direkt an ${safe.email}.</p>
          </div>
        </div>
      `,
    });

    // 2) Confirmation to the customer – a failure here must not fail the request
    try {
      await sendMail({
        to: email,
        replyTo: mailConfig().inbox,
        subject: template.subject,
        text: `${template.greeting(name)}\n\n${template.body}\n${template.responseTime}\n\n${template.yourMessage}\n${message}\n\n${template.regards}\n${template.team}\n\n${template.footer}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #001f3f; padding: 24px 30px; border-bottom: 3px solid #dc2626;">
              <h1 style="color: white; margin: 0; font-size: 22px;">${template.title}</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
              <p style="font-size: 16px; color: #374151;">${template.greeting(safe.name)}</p>
              <p style="font-size: 16px; color: #374151; line-height: 1.6;">${template.body}</p>
              <p style="font-size: 16px; color: #374151; line-height: 1.6;">${template.responseTime}</p>
              <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;"><strong>${template.yourMessage}</strong></p>
                <p style="margin: 0; white-space: pre-wrap; color: #374151;">${safe.message}</p>
              </div>
              <p style="font-size: 16px; color: #374151;">${template.regards}<br><strong>${template.team}</strong></p>
            </div>
            <div style="padding: 16px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0;">${template.footer}</p>
            </div>
          </div>
        `,
      });
    } catch (confirmationError) {
      console.error('Contact form: confirmation email failed', confirmationError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof MailNotConfiguredError) {
      console.error('Contact form: SMTP_PASSWORD is not configured');
      return NextResponse.json({ error: ERRORS[locale].unavailable }, { status: 503 });
    }
    console.error('Contact form error:', error);
    return NextResponse.json({ error: ERRORS[locale].failed }, { status: 500 });
  }
}

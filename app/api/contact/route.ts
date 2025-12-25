import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

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
    footer: 'Tornado Racing Moto | Premium Motorradteile',
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
    footer: 'Tornado Racing Moto | Premium Motorcycle Parts',
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
    footer: 'Tornado Racing Moto | Części Motocyklowe Premium',
  },
};

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'E-Mail-Service nicht konfiguriert' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { name, email, message, locale = 'de' } = await request.json();
    const template = emailTemplates[locale as Locale] || emailTemplates.de;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      );
    }

    // Send email to you (the business owner)
    const { error } = await resend.emails.send({
      from: 'Tornado Racing Moto <onboarding@resend.dev>', // Change to your verified domain later
      to: process.env.CONTACT_EMAIL || 'tornado-racing-moto@wp.pl',
      replyTo: email,
      subject: `Neue Kontaktanfrage von ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Neue Kontaktanfrage</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1e3a5f; margin-top: 0;">Kontaktdaten</h2>
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>E-Mail:</strong> <a href="mailto:${email}">${email}</a></p>

            <h2 style="color: #1e3a5f; margin-top: 30px;">Nachricht</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
            <p>Diese E-Mail wurde über das Kontaktformular von tornadoracingmoto.de gesendet.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Fehler beim Senden der E-Mail' },
        { status: 500 }
      );
    }

    // Send confirmation email to the customer
    await resend.emails.send({
      from: 'Tornado Racing Moto <onboarding@resend.dev>', // Change to your verified domain later
      to: email,
      subject: template.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">${template.title}</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <p style="font-size: 16px; color: #374151;">${template.greeting(name)}</p>

            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              ${template.body}
            </p>

            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              ${template.responseTime}
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;"><strong>${template.yourMessage}</strong></p>
              <p style="margin: 0; white-space: pre-wrap; color: #374151;">${message}</p>
            </div>

            <p style="font-size: 16px; color: #374151;">
              ${template.regards}<br>
              <strong>${template.team}</strong>
            </p>
          </div>
          <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0;">${template.footer}</p>
          </div>
        </div>
      `,
    }).catch((err) => {
      // Don't fail the request if confirmation email fails
      console.error('Confirmation email error:', err);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

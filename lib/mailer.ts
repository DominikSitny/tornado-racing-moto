import nodemailer from 'nodemailer';
import { contactInfo } from '@/lib/contact-info';

/**
 * Sends email through the SMTP server of the business mailbox (wp.pl by default).
 *
 * Required environment variable (set in Vercel → Settings → Environment Variables):
 *   SMTP_PASSWORD  – password of the mailbox tornado-racing-moto@wp.pl
 * Optional (defaults fit wp.pl):
 *   SMTP_USER      – mailbox / sender address   (default: contactInfo.email)
 *   SMTP_HOST      – default: smtp.wp.pl
 *   SMTP_PORT      – default: 465
 *   SMTP_SECURE    – "false" for STARTTLS/plain ports, default: true
 *   CONTACT_INBOX  – where enquiries are delivered (default: contactInfo.email).
 *                    The old CONTACT_EMAIL variable is deliberately ignored – it pointed to a test Gmail address.
 */

export class MailNotConfiguredError extends Error {}

export function mailConfig() {
  const user = process.env.SMTP_USER || contactInfo.email;
  return {
    host: process.env.SMTP_HOST || 'smtp.wp.pl',
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE !== 'false' : true,
    user,
    password: process.env.SMTP_PASSWORD,
    from: `${contactInfo.businessName} <${user}>`,
    inbox: process.env.CONTACT_INBOX || contactInfo.email,
  };
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  const config = mailConfig();
  if (!config.password) throw new MailNotConfiguredError('SMTP_PASSWORD is not set');
  transporter ??= nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  return transporter;
}

export async function sendMail(mail: { to: string; subject: string; html: string; text: string; replyTo?: string }) {
  const config = mailConfig();
  await getTransporter().sendMail({ from: config.from, ...mail });
}

/** Escapes user input before it is placed into an HTML email. */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

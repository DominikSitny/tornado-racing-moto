'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import { useLocale, useTranslations } from 'next-intl';
import { contactInfo } from '@/lib/contact-info';

export default function Footer() {
  const locale = useLocale();
  const tFooter = useTranslations('footer');
  const tNav = useTranslations('navigation');

  const links = [
    { href: `/${locale}`, label: tNav('home') },
    { href: `/${locale}/categories`, label: tNav('catalog') },
    { href: `/${locale}/about`, label: tNav('about') },
    { href: `/${locale}/contact`, label: tNav('contact') },
  ];

  const headingClass = 'font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 mb-4';

  return (
    <footer className="bg-secondary text-white">
      <div className="container py-14 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="inline-block bg-white p-1.5 rounded-sm">
            <Image src="/logo.jpeg" alt="Tornado Racing Cams" width={150} height={50} className="object-contain" />
          </div>
          <p className="text-white/70 mt-5 max-w-xs">{tFooter('tagline')}</p>
        </div>

        <nav className="md:col-span-3" aria-label={tFooter('pages')}>
          <p className={headingClass}>{tFooter('pages')}</p>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/80 hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className={headingClass}>{tFooter('contact')}</p>
          <a href={`mailto:${contactInfo.email}`} className="text-white/80 hover:text-white transition-colors break-all">
            {contactInfo.email}
          </a>
          <div className="flex items-center gap-4 mt-5">
            <a
              href={contactInfo.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram className="w-5 h-5" />
            </a>
            <a
              href={contactInfo.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <FaFacebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container py-5 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
          {tFooter('copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}

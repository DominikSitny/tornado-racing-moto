'use client';

import { Divider } from '@nextui-org/react';
import Image from 'next/image';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const tFooter = useTranslations('footer');

  return (
    <footer className="bg-white text-secondary py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpeg"
              alt="Tornado Racing Cams"
              width={150}
              height={50}
              className="object-contain"
            />
          </div>
          <Divider orientation="vertical" className="h-8 bg-secondary/20 hidden md:block" />
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/tornadoracingmoto"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-pink-500 transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram className="w-6 h-6" />
            </a>
            <a
              href="https://www.facebook.com/p/Tornado-Racing-Moto-100054281929959/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-blue-600 transition-colors"
              aria-label="Facebook"
            >
              <FaFacebook className="w-6 h-6" />
            </a>
          </div>
          <Divider orientation="vertical" className="h-8 bg-secondary/20 hidden md:block" />
          <p className="text-secondary/60">{tFooter('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}

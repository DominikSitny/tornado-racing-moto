'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import Breadcrumb from '@/components/Breadcrumb';
import { Card, CardBody, Spinner } from '@nextui-org/react';
import { Mail, Phone } from 'lucide-react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

function ContactContent() {
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get('message') || '';
  const t = useTranslations('contact');

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-secondary mb-4">{t('title')}</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <ContactForm initialMessage={initialMessage} />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg">
          <CardBody className="p-6 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-red-500 flex items-center justify-center text-white">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-secondary mb-1">{t('email')}</h3>
              <a href="mailto:tornado-racing-moto@wp.pl" className="text-primary hover:underline">
                tornado-racing-moto@wp.pl
              </a>
            </div>
          </CardBody>
        </Card>

        <Card className="border-none shadow-lg">
          <CardBody className="p-6 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-blue-700 flex items-center justify-center text-white">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-secondary mb-1">{t('phone')}</h3>
              <a href="tel:+491234567890" className="text-primary hover:underline">
                +49 (0) 123 456789
              </a>
            </div>
          </CardBody>
        </Card>

        <Card className="border-none shadow-lg">
          <CardBody className="p-6 flex flex-col items-center text-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(to bottom right, #ec4899, #9333ea)' }}
            >
              <FaInstagram size={24} />
            </div>
            <div>
              <h3 className="font-bold text-secondary mb-1">Instagram</h3>
              <a
                href="https://instagram.com/tornadoracingmoto"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                @tornadoracingmoto
              </a>
            </div>
          </CardBody>
        </Card>

        <Card className="border-none shadow-lg">
          <CardBody className="p-6 flex flex-col items-center text-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(to bottom right, #2563eb, #1e40af)' }}
            >
              <FaFacebook size={24} />
            </div>
            <div>
              <h3 className="font-bold text-secondary mb-1">Facebook</h3>
              <a
                href="https://www.facebook.com/p/Tornado-Racing-Moto-100054281929959/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Tornado Racing Moto
              </a>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default function ContactPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <Breadcrumb
          items={[
            { label: t('contact') },
          ]}
        />

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Suspense fallback={
              <div className="flex justify-center py-12">
                <Spinner size="lg" color="primary" />
              </div>
            }>
              <ContactContent />
            </Suspense>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

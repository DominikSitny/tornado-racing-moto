'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import ContactForm from '@/components/ContactForm';
import Breadcrumb from '@/components/Breadcrumb';
import { Card, CardBody, Spinner } from '@nextui-org/react';
import { Mail, Phone } from 'lucide-react';

function ContactContent() {
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get('message') || '';

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-secondary mb-4">Kontaktiere uns</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Hast du Fragen zu unseren Produkten oder möchtest du mehr über uns
          erfahren? Fülle einfach das Formular aus und wir werden dir bald antworten.
        </p>
      </div>

      <ContactForm initialMessage={initialMessage} />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg">
          <CardBody className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-red-500 flex items-center justify-center text-white">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-secondary mb-1">Email</h3>
              <a href="mailto:info@tornadoprod.de" className="text-primary hover:underline">
                info@tornadoprod.de
              </a>
            </div>
          </CardBody>
        </Card>

        <Card className="border-none shadow-lg">
          <CardBody className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-blue-700 flex items-center justify-center text-white">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-secondary mb-1">Telefon</h3>
              <a href="tel:+491234567890" className="text-primary hover:underline">
                +49 (0) 123 456789
              </a>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <Breadcrumb
          items={[
            { label: 'Kontakt' },
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

      <footer className="bg-white text-secondary py-8 text-center border-t">
        <p className="text-secondary/60">&copy; 2024 Tornado Racing Moto. Alle Rechte vorbehalten.</p>
      </footer>
    </>
  );
}

'use client';

import { useState, FormEvent } from 'react';
import { Input, Textarea, Button } from '@nextui-org/react';
import { Send, CheckCircle } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface ContactFormProps {
  initialMessage?: string;
}

export default function ContactForm({ initialMessage = '' }: ContactFormProps) {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    message: initialMessage,
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (errors[key]) {
      setErrors((prev) => ({
        ...prev,
        [key]: '',
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = t('required');
    }
    if (!formData.email.trim()) {
      newErrors.email = t('required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = t('invalidEmail');
      }
    }
    if (!formData.message.trim()) {
      newErrors.message = t('required');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, locale }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        const data = await response.json();
        setErrors({ form: data.error || t('error') });
      }
    } catch {
      setErrors({ form: t('error') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
        {submitted && (
          <div role="status" className="mb-8 p-5 border-l-2 border-success bg-success-50 flex items-center gap-3">
            <CheckCircle size={20} className="text-success shrink-0" />
            <p className="font-semibold text-success-700">{t('success')}</p>
          </div>
        )}

        {errors.form && (
          <div role="alert" className="mb-8 p-5 border-l-2 border-danger bg-danger-50">
            <p className="text-danger-700 font-medium">{errors.form}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t('name')}
            placeholder={t('namePlaceholder')}
            value={formData.name}
            onValueChange={(value) => handleChange('name', value)}
            isInvalid={!!errors.name}
            errorMessage={errors.name}
            variant="bordered"
            radius="sm"
            size="lg"
            classNames={{
              label: 'font-mono text-[11px] uppercase tracking-[0.15em] text-secondary/60',
              input: 'text-secondary placeholder:text-gray-400',
              inputWrapper: 'border-1 border-secondary/20 shadow-none hover:!border-secondary/40 group-data-[focus=true]:!border-secondary',
            }}
          />

          <Input
            type="email"
            label={t('email')}
            placeholder={t('emailPlaceholder')}
            value={formData.email}
            onValueChange={(value) => handleChange('email', value)}
            isInvalid={!!errors.email}
            errorMessage={errors.email}
            variant="bordered"
            radius="sm"
            size="lg"
            classNames={{
              label: 'font-mono text-[11px] uppercase tracking-[0.15em] text-secondary/60',
              input: 'text-secondary placeholder:text-gray-400',
              inputWrapper: 'border-1 border-secondary/20 shadow-none hover:!border-secondary/40 group-data-[focus=true]:!border-secondary',
            }}
          />

          <Textarea
            label={t('message')}
            placeholder={t('messagePlaceholder')}
            value={formData.message}
            onValueChange={(value) => handleChange('message', value)}
            isInvalid={!!errors.message}
            errorMessage={errors.message}
            variant="bordered"
            radius="sm"
            size="lg"
            minRows={5}
            classNames={{
              label: 'font-mono text-[11px] uppercase tracking-[0.15em] text-secondary/60',
              input: 'text-secondary placeholder:text-gray-400',
              inputWrapper: 'border-1 border-secondary/20 shadow-none hover:!border-secondary/40 group-data-[focus=true]:!border-secondary',
            }}
          />

          <Button
            type="submit"
            color="primary"
            size="lg"
            radius="sm"
            isLoading={isLoading}
            endContent={!isLoading && <Send size={18} />}
            className="font-semibold px-8"
          >
            {isLoading ? t('sending') : t('send')}
          </Button>
        </form>
    </div>
  );
}

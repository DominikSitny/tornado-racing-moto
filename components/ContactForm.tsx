'use client';

import { useState, FormEvent } from 'react';
import { Input, Textarea, Button, Card, CardBody } from '@nextui-org/react';
import { User, Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
      newErrors.name = 'Required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email';
      }
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Required';
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
        body: JSON.stringify(formData),
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
    <Card className="max-w-2xl mx-auto shadow-2xl border-none bg-white/90 backdrop-blur-lg">
      <CardBody className="p-8 md:p-10">
        {submitted && (
          <div className="mb-8 p-5 bg-success-50 border border-success-200 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center flex-shrink-0">
              <CheckCircle size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-success-700 mb-1">{t('success')}</h3>
            </div>
          </div>
        )}

        {errors.form && (
          <div className="mb-8 p-5 bg-danger-50 border border-danger-200 rounded-2xl">
            <p className="text-danger-700 font-medium">{errors.form}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t('name')}
            placeholder="..."
            value={formData.name}
            onValueChange={(value) => handleChange('name', value)}
            isInvalid={!!errors.name}
            errorMessage={errors.name}
            startContent={<User size={18} className="text-gray-400" />}
            variant="bordered"
            radius="lg"
            size="lg"
            classNames={{
              label: 'text-secondary font-semibold',
              input: 'text-secondary',
              inputWrapper: 'border-gray-200 hover:border-primary focus-within:!border-primary',
            }}
          />

          <Input
            type="email"
            label={t('email')}
            placeholder="email@example.com"
            value={formData.email}
            onValueChange={(value) => handleChange('email', value)}
            isInvalid={!!errors.email}
            errorMessage={errors.email}
            startContent={<Mail size={18} className="text-gray-400" />}
            variant="bordered"
            radius="lg"
            size="lg"
            classNames={{
              label: 'text-secondary font-semibold',
              input: 'text-secondary',
              inputWrapper: 'border-gray-200 hover:border-primary focus-within:!border-primary',
            }}
          />

          <Textarea
            label={t('message')}
            placeholder="..."
            value={formData.message}
            onValueChange={(value) => handleChange('message', value)}
            isInvalid={!!errors.message}
            errorMessage={errors.message}
            startContent={<MessageSquare size={18} className="text-gray-400 mt-2" />}
            variant="bordered"
            radius="lg"
            size="lg"
            minRows={5}
            classNames={{
              label: 'text-secondary font-semibold',
              input: 'text-secondary',
              inputWrapper: 'border-gray-200 hover:border-primary focus-within:!border-primary',
            }}
          />

          <Button
            type="submit"
            color="primary"
            variant="shadow"
            size="lg"
            radius="lg"
            fullWidth
            isLoading={isLoading}
            startContent={!isLoading && <Send size={20} />}
            className="font-bold text-lg h-14 bg-gradient-to-r from-primary to-red-500"
          >
            {isLoading ? t('sending') : t('send')}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

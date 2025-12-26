'use client';

import { useState, useEffect } from 'react';
import { Button, Card, CardBody, Input } from '@nextui-org/react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

const SITE_PASSWORD = 'tornado2024';
const STORAGE_KEY = 'tornado_site_access';

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (password === SITE_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsAuthenticated(true);
    } else {
      setError('Falsches Passwort');
    }
    setIsLoading(false);
  };

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary via-blue-900 to-secondary flex items-center justify-center">
        <div className="animate-pulse">
          <Image
            src="/logo.jpeg"
            alt="Tornado Racing Moto"
            width={120}
            height={120}
            className="rounded-2xl"
          />
        </div>
      </div>
    );
  }

  // Show password form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary via-blue-900 to-secondary flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-[100px]"></div>
        </div>

        <Card className="w-full max-w-md border-none shadow-2xl relative z-10">
          <CardBody className="p-8">
            <div className="flex flex-col items-center mb-8">
              <Image
                src="/logo.jpeg"
                alt="Tornado Racing Moto"
                width={100}
                height={100}
                className="rounded-2xl shadow-lg mb-4"
              />
              <h1 className="text-2xl font-bold text-secondary text-center">
                Tornado Racing Moto
              </h1>
              <p className="text-gray-500 text-center mt-2">
                Bitte gib das Passwort ein, um fortzufahren
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Passwort"
                placeholder="Passwort eingeben"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                startContent={<Lock size={18} className="text-gray-400" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-gray-400" />
                    ) : (
                      <Eye size={18} className="text-gray-400" />
                    )}
                  </button>
                }
                isInvalid={!!error}
                errorMessage={error}
                classNames={{
                  inputWrapper: 'bg-gray-100',
                }}
              />

              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full font-bold bg-gradient-to-r from-primary to-red-500"
                isLoading={isLoading}
              >
                Zugang erhalten
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Authenticated - show content
  return <>{children}</>;
}

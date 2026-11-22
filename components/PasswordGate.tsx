'use client';

import { useState, useEffect } from 'react';
import { Button, Input } from '@nextui-org/react';
import { Eye, EyeOff } from 'lucide-react';
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
    return <div className="min-h-screen bg-secondary" />;
  }

  // Show password form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary text-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="inline-block bg-white p-1.5 rounded-sm mb-10">
            <Image src="/logo.jpeg" alt="Tornado Racing Moto" width={150} height={50} className="object-contain" priority />
          </div>
          <h1 className="font-display font-bold uppercase text-5xl leading-[0.95] tracking-tight mb-3">
            Tornado Racing Moto
          </h1>
          <p className="text-white/70 mb-8">Bitte gib das Passwort ein, um fortzufahren.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              radius="sm"
              autoFocus
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                  aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-secondary/50" />
                  ) : (
                    <Eye size={18} className="text-secondary/50" />
                  )}
                </button>
              }
              isInvalid={!!error}
              errorMessage={error}
              classNames={{
                label: 'font-mono text-[11px] uppercase tracking-[0.15em]',
                inputWrapper: 'bg-white data-[hover=true]:bg-white group-data-[focus=true]:bg-white',
                errorMessage: 'text-red-300',
              }}
            />

            <Button type="submit" color="primary" size="lg" radius="sm" className="w-full font-semibold" isLoading={isLoading}>
              Zugang erhalten
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated - show content
  return <>{children}</>;
}

'use client';

import { NextUIProvider } from '@nextui-org/react';
import { useRouter, usePathname } from 'next/navigation';
import PasswordGate from '@/components/PasswordGate';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Skip password gate for admin area (has its own auth)
  const isAdminArea = pathname?.includes('/admin');

  return (
    <NextUIProvider navigate={router.push}>
      {isAdminArea ? children : <PasswordGate>{children}</PasswordGate>}
    </NextUIProvider>
  );
}

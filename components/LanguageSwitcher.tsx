'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    // Remove current locale from pathname and add new one
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const currentLanguage = languages.find((l) => l.code === locale) || languages[0];

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          size="sm"
          startContent={<Globe size={16} />}
          className="text-secondary min-w-0 px-2"
        >
          <span className="hidden sm:inline">{currentLanguage.flag}</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language selection"
        onAction={(key) => handleLanguageChange(key as string)}
        selectedKeys={[locale]}
        selectionMode="single"
      >
        {languages.map((lang) => (
          <DropdownItem key={lang.code} startContent={<span>{lang.flag}</span>}>
            {lang.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

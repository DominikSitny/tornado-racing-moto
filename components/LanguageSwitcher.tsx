'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { ChevronDown } from 'lucide-react';

const languages = [
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
  { code: 'pl', label: 'Polski' },
];

export default function LanguageSwitcher({ inverted = false }: { inverted?: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    // Remove current locale from pathname and add new one
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <Dropdown radius="sm">
      <DropdownTrigger>
        <Button
          variant="light"
          size="sm"
          radius="sm"
          endContent={<ChevronDown size={14} />}
          className={`font-mono text-xs uppercase tracking-widest min-w-0 px-2 ${inverted ? 'text-white' : 'text-secondary'}`}
          aria-label="Sprache / Language / Język"
        >
          {locale}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language selection"
        onAction={(key) => handleLanguageChange(key as string)}
        selectedKeys={[locale]}
        selectionMode="single"
      >
        {languages.map((lang) => (
          <DropdownItem
            key={lang.code}
            startContent={<span className="font-mono text-xs uppercase w-6 text-secondary/50">{lang.code}</span>}
          >
            {lang.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

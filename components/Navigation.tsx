'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('navigation');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/categories`, label: t('catalog') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        base: 'bg-white shadow-lg',
        wrapper: 'max-w-7xl',
      }}
      isBordered
    >
      {/* Mobile Menu Toggle */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="text-secondary"
        />
      </NavbarContent>

      {/* Logo */}
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <NextLink href={`/${locale}`} className="flex items-center">
            <Image
              src="/logo.jpeg"
              alt="Tornado Racing Cams"
              width={120}
              height={40}
              className="object-contain"
            />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      {/* Mobile Language Switcher */}
      <NavbarContent className="sm:hidden" justify="end">
        <LanguageSwitcher />
      </NavbarContent>

      {/* Desktop Navigation */}
      <NavbarContent className="hidden sm:flex gap-8" justify="start">
        <NavbarBrand>
          <NextLink href={`/${locale}`} className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/logo.jpeg"
              alt="Tornado Racing Cams"
              width={150}
              height={50}
              className="object-contain"
            />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-6" justify="end">
        {navItems.map((item) => (
          <NavbarItem key={item.href} isActive={isActive(item.href)}>
            <NextLink
              href={item.href}
              className={`font-medium transition-colors ${
                isActive(item.href)
                  ? 'text-primary'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {item.label}
            </NextLink>
          </NavbarItem>
        ))}
        <NavbarItem>
          <LanguageSwitcher />
        </NavbarItem>
        <NavbarItem>
          <Button
            as={NextLink}
            href={`/${locale}/contact`}
            color="primary"
            variant="shadow"
            radius="full"
          >
            {t('sendInquiry')}
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-white/95 backdrop-blur-lg pt-6">
        {navItems.map((item) => (
          <NavbarMenuItem key={item.href}>
            <NextLink
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`w-full text-lg py-2 block ${
                isActive(item.href)
                  ? 'text-primary font-bold'
                  : 'text-secondary'
              }`}
            >
              {item.label}
            </NextLink>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem className="mt-4">
          <Button
            as={NextLink}
            href={`/${locale}/contact`}
            color="primary"
            variant="shadow"
            radius="full"
            fullWidth
            onClick={() => setIsMenuOpen(false)}
          >
            {t('sendInquiry')}
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}

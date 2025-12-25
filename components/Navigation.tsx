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

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/categories', label: 'Katalog' },
    { href: '/contact', label: 'Kontakt' },
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
          aria-label={isMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
          className="text-secondary"
        />
      </NavbarContent>

      {/* Logo */}
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <NextLink href="/" className="flex items-center">
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

      {/* Desktop Navigation */}
      <NavbarContent className="hidden sm:flex gap-8" justify="start">
        <NavbarBrand>
          <NextLink href="/" className="flex items-center hover:opacity-80 transition-opacity">
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
          <Button
            as={NextLink}
            href="/contact"
            color="primary"
            variant="shadow"
            radius="full"
          >
            Anfrage senden
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
            href="/contact"
            color="primary"
            variant="shadow"
            radius="full"
            fullWidth
            onClick={() => setIsMenuOpen(false)}
          >
            Anfrage senden
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}

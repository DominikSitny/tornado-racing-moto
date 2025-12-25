'use client';

import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react';
import { Home } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItemType[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const locale = useLocale();
  const t = useTranslations('breadcrumb');

  return (
    <div className="container mx-auto px-4 py-5">
      <Breadcrumbs
        variant="solid"
        radius="full"
        classNames={{
          list: 'bg-white shadow-sm px-4 py-2',
        }}
      >
        <BreadcrumbItem key="home" href={`/${locale}`} startContent={<Home size={16} />}>
          {t('home')}
        </BreadcrumbItem>
        {items.map((item, index) => (
          <BreadcrumbItem
            key={`breadcrumb-${index}-${item.label}`}
            href={item.href}
            isCurrent={!item.href}
            classNames={{
              item: !item.href ? 'text-primary font-bold' : '',
            }}
          >
            {item.label}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  );
}

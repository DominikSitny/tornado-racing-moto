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
    <div className="container pt-6 pb-2">
      <Breadcrumbs
        classNames={{
          list: 'font-mono text-xs uppercase tracking-[0.12em]',
        }}
        itemClasses={{
          item: 'text-secondary/50 data-[current=true]:text-secondary',
          separator: 'text-secondary/30',
        }}
      >
        <BreadcrumbItem key="home" href={`/${locale}`} startContent={<Home size={14} />}>
          {t('home')}
        </BreadcrumbItem>
        {items.map((item, index) => (
          <BreadcrumbItem
            key={`breadcrumb-${index}-${item.label}`}
            href={item.href}
            isCurrent={!item.href}
            classNames={{
              item: !item.href ? 'text-secondary' : '',
            }}
          >
            {item.label}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  );
}

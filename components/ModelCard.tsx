'use client';

import { Card, CardBody, CardFooter, Chip } from '@nextui-org/react';
import Link from 'next/link';
import { Model } from '@/lib/types';
import { Wrench, ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

interface ModelCardProps {
  model: Model;
  categoryId: string;
}

export default function ModelCard({ model, categoryId }: ModelCardProps) {
  const locale = useLocale();
  const t = useTranslations('catalog');

  return (
    <Link href={`/${locale}/categories/${categoryId}/${model.id}`} className="block w-full">
      <Card
        isPressable
        isHoverable
        className="h-[280px] w-full border-none bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      >
        <CardBody className="p-6 gap-4 flex-grow">
          <div className="flex items-center gap-3 flex-shrink-0">
            <Chip
              color="primary"
              variant="shadow"
              size="sm"
              classNames={{
                base: 'bg-gradient-to-r from-primary to-red-500',
                content: 'text-white font-bold text-xs',
              }}
            >
              {model.brand}
            </Chip>
          </div>

          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-secondary mb-2">
              {model.designation}
            </h2>
            <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
              {model.description}
            </p>
          </div>
        </CardBody>

        <CardFooter className="pt-0 px-6 pb-6 flex justify-between items-center mt-auto">
          <div className="flex items-center gap-2">
            <Wrench size={16} className="text-primary" />
            <span className="text-primary font-semibold text-sm">
              {model.parts.length} {model.parts.length === 1 ? t('part') : t('parts')}
            </span>
          </div>

          <div className="flex items-center gap-1 text-secondary font-medium text-sm group-hover:text-primary transition-colors">
            <span>{t('details')}</span>
            <ChevronRight size={18} />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

'use client';

import { Card, CardBody, CardFooter, Chip } from '@nextui-org/react';
import Link from 'next/link';
import { Category } from '@/lib/types';
import { Bike, ChevronRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.id}`} className="block w-full">
      <Card
        isPressable
        isHoverable
        className="h-[280px] w-full border-none bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      >
        <CardBody className="p-6 gap-4 flex-grow">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg flex-shrink-0">
            <Bike size={28} />
          </div>

          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-secondary mb-2">
              {category.name}
            </h2>
            <p className="text-gray-600 text-sm line-clamp-3">
              {category.description}
            </p>
          </div>
        </CardBody>

        <CardFooter className="pt-0 px-6 pb-6 flex justify-between items-center mt-auto">
          <Chip
            color="primary"
            variant="flat"
            size="sm"
            classNames={{
              base: 'bg-primary/10',
              content: 'text-primary font-semibold',
            }}
          >
            {category.models.length} {category.models.length === 1 ? 'Modell' : 'Modelle'}
          </Chip>

          <div className="flex items-center gap-1 text-primary font-medium text-sm">
            <span>Ansehen</span>
            <ChevronRight size={18} />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

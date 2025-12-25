'use client';

import { Card, CardBody, CardFooter, Chip, Image } from '@nextui-org/react';
import Link from 'next/link';
import { Part } from '@/lib/types';
import { useState } from 'react';
import { Eye, MessageCircle } from 'lucide-react';

interface PartCardProps {
  part: Part;
  categoryId: string;
  modelId: string;
}

export default function PartCard({
  part,
  categoryId,
  modelId,
}: PartCardProps) {
  const [imgSrc, setImgSrc] = useState(part.image);

  const handleImageError = () => {
    setImgSrc(
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="18" font-family="Arial"%3EBild nicht verfügbar%3C/text%3E%3C/svg%3E'
    );
  };

  return (
    <Link href={`/categories/${categoryId}/${modelId}/${part.id}`} className="block w-full">
      <Card
        isPressable
        isHoverable
        className="h-[380px] w-full border-none bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      >
        <div className="relative flex-shrink-0">
          <Image
            src={imgSrc}
            alt={part.name}
            className="w-full h-52 object-cover"
            radius="none"
            onError={handleImageError}
          />

          {/* Anfrage Badge */}
          <Chip
            color="secondary"
            variant="shadow"
            size="md"
            className="absolute top-3 right-3 z-10"
            startContent={<MessageCircle size={14} />}
            classNames={{
              base: 'bg-secondary shadow-lg',
              content: 'text-white font-semibold',
            }}
          >
            Auf Anfrage
          </Chip>
        </div>

        <CardBody className="p-5 gap-2 flex-grow">
          <h3 className="font-bold text-lg text-secondary line-clamp-1">
            {part.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {part.description}
          </p>
        </CardBody>

        <CardFooter className="pt-0 px-5 pb-5 flex justify-between items-center border-t border-gray-100 mt-auto">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Details anzeigen
          </span>
          <Eye size={18} className="text-secondary" />
        </CardFooter>
      </Card>
    </Link>
  );
}

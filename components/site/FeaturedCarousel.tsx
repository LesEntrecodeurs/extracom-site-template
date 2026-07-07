'use client';

import type { ReactNode } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

/**
 * Carrousel d'items (embla via shadcn). Les `items` sont rendus côté serveur
 * (ex. <ArticleCard/>) et passés ici en props — le carrousel n'ajoute que
 * l'interactivité. Pattern réutilisable : sélection produits, promos, marques…
 */
export function FeaturedCarousel({ items }: { items: ReactNode[] }) {
  return (
    <Carousel opts={{ align: 'start', loop: false }} className="w-full">
      <CarouselContent className="-ml-4">
        {items.map((item, i) => (
          <CarouselItem
            // biome-ignore lint/suspicious/noArrayIndexKey: items sont des ReactNode opaques (pas d'id exploitable)
            key={i}
            className="basis-3/4 pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
          >
            {item}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}

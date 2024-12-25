"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { useCallback, useEffect, useState } from "react";
import ProductCard from "./product-card";
import { Prisma } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type InventoryWithRelations = Prisma.InventoryGetPayload<{
  include: {
    product: {
      include: {
        brand: true;
        primaryCategory: true;
        secondaryCategory: true;
        tertiaryCategory: true;
        quaternaryCategory: true;
      };
    };
  };
}>;

interface ProductCarouselProps {
  inventoryItems: InventoryWithRelations[];
  title: string;
}

const OPTIONS: EmblaOptionsType = {
  align: "start",
  containScroll: "trimSnaps",
  dragFree: false,
  loop: false,
  // This ensures it won't get stuck between slides
  breakpoints: {
    "(min-width: 1024px)": { slidesToScroll: 4 },
    "(min-width: 768px)": { slidesToScroll: 3 },
    "(max-width: 767px)": { slidesToScroll: 2 },
  },
};

export default function ProductCarousel({
  inventoryItems,
  title,
}: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    // Ensure proper snapping after initialization
    emblaApi.reInit({ ...OPTIONS });

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="container max-w-screen-xl mx-auto my-10 px-4 md:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-xl sm:text-2xl">{title}</h2>
        <div className="flex gap-2">
          <Button
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full transition-all hover:scale-105"
            aria-label="Previous slide"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full transition-all hover:scale-105"
            aria-label="Next slide"
          >
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {inventoryItems.map((inventoryItem) => (
              <div
                key={inventoryItem.id}
                className={cn(
                  "pl-4", // Consistent left padding for spacing
                  "min-w-0",
                  "flex-[0_0_50%]", // 2 columns on mobile
                  "md:flex-[0_0_33.333333%]", // 3 columns on tablet
                  "lg:flex-[0_0_25%]" // 4 columns on desktop
                )}
              >
                <div className="h-full">
                  <ProductCard inventoryItem={inventoryItem} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-1 mt-4 lg:hidden">
          {scrollSnaps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === selectedIndex ? "w-6 bg-primary" : "w-1.5 bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

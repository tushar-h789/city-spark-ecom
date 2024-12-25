"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import VaillantEcoFitPlus832Combi from "@/images/advertisements/vaillant-ecofit-plus-832-combi.jpg";
import IdealAtlantic30CombiFlue from "@/images/advertisements/ideal-atlantic-30-combi-flue.jpg";

const CarouselContent = ({
  content,
  className,
  showNavButtons = false,
  isDesktop = false,
}: {
  content: { image: any }[];
  className?: string;
  showNavButtons?: boolean;
  isDesktop?: boolean;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(false);

  // Initialize carousel without autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    autoplayEnabled ? [Autoplay({ delay: 5000, stopOnInteraction: false })] : []
  );

  useEffect(() => {
    // Enable autoplay after page load and 10 second delay
    if (typeof window !== "undefined") {
      // Request idle callback with fallback
      const requestIdleCallback =
        window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

      const enableAutoplayWithDelay = () => {
        // Set a 10 second timeout before enabling autoplay
        setTimeout(() => {
          setAutoplayEnabled(true);
        }, 5000);
      };

      // Wait for page load
      if (document.readyState === "complete") {
        requestIdleCallback(enableAutoplayWithDelay);
      } else {
        window.addEventListener("load", () => {
          requestIdleCallback(enableAutoplayWithDelay);
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const updateSelectedIndex = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    updateSelectedIndex();
    emblaApi.on("select", updateSelectedIndex);

    return () => {
      emblaApi.off("select", updateSelectedIndex);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <div className={cn("relative group", className)}>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {content.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex-[0_0_100%] min-w-0 relative",
                isDesktop && "flex justify-center items-center px-4"
              )}
            >
              <div
                className={cn(
                  "relative h-[200px] lg:h-[400px]",
                  isDesktop && "max-w-screen-xl w-full"
                )}
              >
                <Image
                  src={item.image}
                  alt={`Banner ${index + 1}`}
                  className={cn("w-full h-auto")}
                  fill
                  priority={index === 0}
                  quality={75}
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes={
                    isDesktop
                      ? "(min-width: 1280px) 1280px, 100vw"
                      : "(max-width: 640px) 92vw, (max-width: 768px) 95vw, (max-width: 1024px) 96vw, 1280px"
                  }
                  style={{
                    objectFit: "contain",
                  }}
                  placeholder="blur"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {showNavButtons && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-opacity duration-200 opacity-0 group-hover:opacity-100 shadow-lg hover:shadow-xl"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-opacity duration-200 opacity-0 group-hover:opacity-100 shadow-lg hover:shadow-xl"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
        </>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {content.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-colors duration-300",
              selectedIndex === index ? "bg-white scale-110" : "bg-white/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function HeroCarousel() {
  const content = [
    { image: VaillantEcoFitPlus832Combi },
    { image: IdealAtlantic30CombiFlue },
  ];

  return (
    <section className="bg-primary w-full">
      <CarouselContent
        content={content}
        className="hidden lg:block py-4"
        showNavButtons={true}
        isDesktop={true}
      />
      <CarouselContent content={content} className="lg:hidden mt-5" />
    </section>
  );
}

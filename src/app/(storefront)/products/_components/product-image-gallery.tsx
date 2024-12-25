"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

// Previous type definitions remain the same...
type InventoryItemWithRelation = Prisma.InventoryGetPayload<{
  include: {
    product: {
      include: {
        brand: true;
        primaryCategory: true;
        secondaryCategory: true;
        tertiaryCategory: true;
        quaternaryCategory: true;
        productTemplate: {
          include: {
            fields: {
              include: {
                templateField: true;
              };
            };
            template: true;
          };
        };
      };
    };
  };
}>;

interface Transform {
  scale: number;
  x: number;
  y: number;
}

export default function ProductImageGallery({
  inventoryItem,
}: {
  inventoryItem: InventoryItemWithRelation;
}) {
  const [mainImage, setMainImage] = useState(
    inventoryItem.product.images[0] || ""
  );
  const [transform, setTransform] = useState<Transform>({
    scale: 1,
    x: 0,
    y: 0,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // Main carousel for fullscreen view
  const [fullscreenRef, fullscreenApi] = useEmblaCarousel({
    align: "center",
    containScroll: false,
    dragFree: false,
  });

  // Thumbnail carousel for fullscreen
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "keepSnaps",
    dragFree: true,
  });

  // Thumbnail carousel for normal view
  const [thumbsRef, thumbsApi] = useEmblaCarousel({
    containScroll: "trimSnaps",
    dragFree: true,
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync all carousels when main image changes
  useEffect(() => {
    if (thumbsApi && emblaApi && fullscreenApi) {
      const index = inventoryItem.product.images.indexOf(mainImage);
      thumbsApi.scrollTo(index);
      emblaApi.scrollTo(index);
      fullscreenApi.scrollTo(index);
    }
  }, [
    mainImage,
    thumbsApi,
    emblaApi,
    fullscreenApi,
    inventoryItem.product.images,
  ]);

  // Handle fullscreen carousel scroll with proper TypeScript typing
  const onFullscreenSelect = useCallback(() => {
    if (!fullscreenApi) return;
    const index = fullscreenApi.selectedScrollSnap();
    setMainImage(inventoryItem.product.images[index]);
    setCurrentIndex(index);
  }, [fullscreenApi, inventoryItem.product.images]);

  useEffect(() => {
    if (!fullscreenApi) return;

    fullscreenApi.on("select", onFullscreenSelect);

    return () => {
      fullscreenApi.off("select", onFullscreenSelect);
    };
  }, [fullscreenApi, onFullscreenSelect]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>): void => {
    if (isMobile) return;

    if (imageRef.current) {
      const { left, top, width, height } =
        imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setTransform({ scale: 1.9, x, y });
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setTransform({ scale: 1, x: 50, y: 50 });
    }
  };

  const handleImageClick = () => {
    if (isMobile) {
      setIsFullscreen(true);
      setCurrentIndex(inventoryItem.product.images.indexOf(mainImage));
      // Ensure the fullscreen carousel is at the right position
      setTimeout(() => {
        fullscreenApi?.scrollTo(currentIndex);
      }, 0);
    }
  };

  const handlePrevImage = () => {
    if (fullscreenApi) {
      fullscreenApi.scrollPrev();
    }
  };

  const handleNextImage = () => {
    if (fullscreenApi) {
      fullscreenApi.scrollNext();
    }
  };

  return (
    <div>
      {/* Main Image Container */}
      <div className="px-4 lg:px-8">
        <div
          ref={imageRef}
          className={cn(
            "relative overflow-hidden rounded-lg aspect-square max-h-[450px] flex justify-center w-full bg-white",
            "lg:hover:cursor-zoom-in"
          )}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleImageClick}
        >
          <Image
            src={mainImage}
            alt={inventoryItem.product.name}
            fill
            className={cn("transition-transform duration-300 ease-in-out")}
            style={{
              objectFit: "contain",
              transform: !isMobile ? `scale(${transform.scale})` : "none",
              transformOrigin: `${transform.x}% ${transform.y}%`,
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            draggable="false"
          />
        </div>
      </div>

      {/* Desktop thumbnails */}
      <div className="mt-5 grid grid-cols-6 gap-3 lg:px-8">
        {inventoryItem.product.images.map((image, index) => (
          <div
            key={index}
            className="flex-[0_0_23%] min-w-0 md:flex-[0_0_16.666%] border h-16 md:h-24"
          >
            <button
              onClick={() => {
                setMainImage(image);
                setCurrentIndex(index);
              }}
              className={cn(
                "relative w-full h-full bg-white overflow-hidden transition-all duration-200",
                mainImage === image
                  ? "border-2 border-secondary" // Changed from primary to secondary
                  : "border border-gray-200"
              )}
            >
              <Image
                src={image}
                alt={`${inventoryItem.product.name} - ${index + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 25vw, (max-width: 1200px) 16vw, 12vw"
                draggable="false"
              />
            </button>
          </div>
        ))}
      </div>

      {/* Thumbnail Carousel */}
      <div className="mt-5 block lg:hidden">
        <div className="overflow-hidden" ref={thumbsRef}>
          <div className="flex">
            {inventoryItem.product.images.map((image, index) => (
              <div
                key={index}
                className="flex-[0_0_23%] min-w-0 md:flex-[0_0_16.666%] first:border-l border-r border-b border-t h-16 md:h-24"
              >
                <button
                  onClick={() => {
                    setMainImage(image);
                    setCurrentIndex(index);
                  }}
                  className={cn(
                    "relative w-full h-full bg-white overflow-hidden transition-all duration-200",
                    "hover:border-primary/50 hover:shadow-sm",
                    mainImage === image
                      ? "border-primary shadow-sm"
                      : "border-gray-200"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${inventoryItem.product.name} - ${index + 1}`}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 25vw, (max-width: 1200px) 16vw, 12vw"
                    draggable="false"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Gallery Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 touch-none">
          <div className="relative w-full h-full">
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={handlePrevImage}
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white z-20",
                currentIndex === 0 && "hidden"
              )}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNextImage}
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white z-20",
                currentIndex === inventoryItem.product.images.length - 1 &&
                  "hidden"
              )}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Fullscreen Carousel */}
            <div
              className="h-[calc(100vh-100px)] overflow-hidden"
              ref={fullscreenRef}
            >
              <div className="flex h-full touch-none">
                {inventoryItem.product.images.map((image, index) => (
                  <div
                    key={index}
                    className="flex-[0_0_100%] h-full relative min-w-0 flex items-center justify-center"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={image}
                        alt={`${inventoryItem.product.name} - ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        draggable="false"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Thumbnail Carousel for Fullscreen */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 h-24">
              <div className="overflow-hidden h-full px-4" ref={emblaRef}>
                <div className="flex gap-2 h-full ml-[-8px]">
                  {inventoryItem.product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setMainImage(image);
                        setCurrentIndex(index);
                        fullscreenApi?.scrollTo(index);
                      }}
                      className={cn(
                        "relative w-16 h-full flex-shrink-0 rounded-md overflow-hidden touch-none",
                        "transition-all duration-200",
                        currentIndex === index
                          ? "ring-2 ring-secondary opacity-100" // Changed from white to secondary
                          : "opacity-50 hover:opacity-75"
                      )}
                    >
                      <Image
                        src={image}
                        alt={`${inventoryItem.product.name} - ${index + 1}`}
                        fill
                        className="object-contain touch-none"
                        sizes="64px"
                        draggable="false"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

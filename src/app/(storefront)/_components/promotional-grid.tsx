import Image from "next/image";
import MainCombi25KWFlue from "@/images/advertisements/main-combi-25kw-flue.jpg";
import MainCombi30KWFlue from "@/images/advertisements/main-combi-30kw-flue.jpg";
import MainEcoCompact25KWNaturalGas from "@/images/advertisements/main-eco-compact-25kw-natural-gas.jpg";
import MainEcoCompact30KWGasCombination from "@/images/advertisements/main-eco-compact-30kw-gas-combination.jpg";
import VaillantEcoTechPro826Flue from "@/images/advertisements/vaillant-eco-tech-pro-826-26kw-flue.jpg";
import Link from "next/link";

// Centralize image data for better maintainability
const IMAGES = [
  {
    src: MainCombi25KWFlue,
    alt: "Main Combi 25KW Flue Boiler - Energy efficient combination boiler with advanced heating system",
    link: "/products/p/main-eco-compact-30kw-natural-gas-combination-boiler-erp/p/cm49j07ox001mjf032ej7j82s",
    priority: true,
    mobile: {
      width: 800,
      height: 400,
    },
    desktop: {
      width: 1000,
      height: 600,
    },
  },
  {
    src: MainCombi30KWFlue,
    alt: "Main Combi 30KW Flue Boiler - High-performance heating solution for larger homes",
    link: "/products/p/main-eco-compact-30kw-natural-gas-combination-boiler-erp/p/cm49j07ox001mjf032ej7j82s",
    priority: true,
    mobile: {
      width: 800,
      height: 400,
    },
    desktop: {
      width: 500,
      height: 300,
    },
  },
  {
    src: MainEcoCompact25KWNaturalGas,
    alt: "Main Eco Compact 25KW Natural Gas Boiler - Compact and efficient natural gas heating system",
    link: "/products/p/main-eco-compact-25kw-natural-gas-combination-boiler-erp/p/cm49i340f0012jf036q5tu8n2",
    mobile: {
      width: 800,
      height: 400,
    },
    desktop: {
      width: 500,
      height: 300,
    },
  },
  {
    src: MainEcoCompact30KWGasCombination,
    alt: "Main Eco Compact 30KW Gas Combination Boiler - Premium combination heating system",
    mobile: {
      width: 800,
      height: 400,
    },
    desktop: {
      width: 500,
      height: 300,
    },
  },
  {
    src: VaillantEcoTechPro826Flue,
    alt: "Vaillant Eco Tech Pro 826 Flue - Professional grade eco-friendly heating solution",
    mobile: {
      width: 800,
      height: 400,
    },
    desktop: {
      width: 1000,
      height: 300,
    },
  },
];

export default function PromotionalGrid() {
  return (
    <section
      className="mt-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
      aria-label="Featured Boiler Products"
    >
      {/* Mobile View */}
      <div
        className="lg:hidden space-y-4"
        role="region"
        aria-label="Mobile Product Gallery"
      >
        {IMAGES.map((image, index) => (
          <div key={index} role="img" aria-label={`Featured ${image.alt}`}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.mobile.width}
              height={image.mobile.height}
              className="w-full rounded-lg"
              placeholder="blur"
              sizes="92vw"
              priority={image.priority}
              quality={index === 0 ? 60 : 50}
              loading={index <= 2 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Desktop Grid */}
      <div
        className="hidden lg:grid grid-cols-3 gap-4"
        style={{ gridTemplateRows: "repeat(3, minmax(180px, 1fr))" }}
        role="region"
        aria-label="Desktop Product Gallery"
      >
        {/* Main large image */}
        <div
          className="col-span-2 row-span-2"
          role="img"
          aria-label={`Featured ${IMAGES[0].alt}`}
        >
          <Image
            src={IMAGES[0].src}
            alt={IMAGES[0].alt}
            width={IMAGES[0].desktop.width}
            height={IMAGES[0].desktop.height}
            className="rounded-lg h-full w-full object-cover"
            placeholder="blur"
            sizes="66vw"
            priority
            quality={60}
          />
        </div>

        {/* Secondary images */}
        {IMAGES.slice(1, 4).map((image, index) => (
          <div
            key={index}
            role="img"
            aria-label={`${image.alt} with Product Link`}
          >
            {image.link ? (
              <Link href={image.link} aria-label={`View ${image.alt} details`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.desktop.width}
                  height={image.desktop.height}
                  className="rounded-lg h-full w-full object-cover"
                  placeholder="blur"
                  sizes="33vw"
                  priority={index === 0}
                  quality={50}
                  loading={index <= 1 ? "eager" : "lazy"}
                />
              </Link>
            ) : (
              <Image
                src={image.src}
                alt={image.alt}
                width={image.desktop.width}
                height={image.desktop.height}
                className="rounded-lg h-full w-full object-cover"
                placeholder="blur"
                sizes="33vw"
                quality={50}
                loading="lazy"
              />
            )}
          </div>
        ))}

        {/* Bottom wide image */}
        <div
          className="col-span-2"
          role="img"
          aria-label={`${IMAGES[4].alt} Display`}
        >
          <Image
            src={IMAGES[4].src}
            alt={IMAGES[4].alt}
            width={IMAGES[4].desktop.width}
            height={IMAGES[4].desktop.height}
            className="rounded-lg h-full w-full object-cover"
            placeholder="blur"
            sizes="66vw"
            quality={50}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

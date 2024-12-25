import Image from "next/image";
import { cn } from "@/lib/utils";
import WideAdvertisementTwo from "@/images/advertisements/home-wide-advertisement-two.jpg";

export default function AdvertisementWideTwo() {
  return (
    <section
      className={cn(
        "container max-w-screen-xl mx-auto my-12",
        "px-4 md:px-6 lg:px-8"
      )}
      aria-label="Advertisement Section"
    >
      <div
        className="relative"
        role="region"
        aria-label="Brand Store Advertisement"
      >
        <Image
          src={WideAdvertisementTwo}
          alt="Brand Store promotional advertisement featuring store products and special offers"
          width={2000}
          height={400}
          className="rounded-lg"
          style={{
            objectFit: "contain",
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          loading="lazy"
        />
      </div>
    </section>
  );
}

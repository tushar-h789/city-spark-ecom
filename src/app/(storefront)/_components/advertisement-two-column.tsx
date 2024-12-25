import IdealAdlantic30CombiFlue from "@/images/advertisements/ideal-atlantic-30-combi-flue.jpg";
import VaillantEcoFitPlus832Combi from "@/images/advertisements/vaillant-ecofit-plus-832-combi.jpg";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function AdvertisementTwoColumn() {
  return (
    <section
      className={cn(
        "container max-w-screen-xl mx-auto my-6 sm:my-8 lg:my-12",
        "px-4 sm:px-6 lg:px-8",
        "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-8"
      )}
      aria-label="Featured Boilers Advertisement Section"
    >
      <div
        className="relative w-full"
        role="region"
        aria-label="Vaillant Boiler Advertisement"
      >
        <Image
          src={VaillantEcoFitPlus832Combi}
          alt="Vaillant EcoFit Plus 832 Combi Boiler - High efficiency combination boiler with advanced heating controls"
          width={800}
          height={450}
          className="rounded-lg object-cover object-center"
          placeholder="blur"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
          loading="lazy"
        />
      </div>
      <div
        className="relative w-full"
        role="region"
        aria-label="Ideal Boiler Advertisement"
      >
        <Image
          src={IdealAdlantic30CombiFlue}
          alt="Ideal Atlantic 30 Combi Flue Boiler - Compact and efficient heating system with integrated flue system"
          width={800}
          height={450}
          className="rounded-lg object-cover object-center"
          placeholder="blur"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
          loading="lazy"
        />
      </div>
    </section>
  );
}

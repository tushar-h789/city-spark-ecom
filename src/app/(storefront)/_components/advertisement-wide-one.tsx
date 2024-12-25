import Image from "next/image";
import { cn } from "@/lib/utils";
import WideAdvertisementOne from "@/images/advertisements/home-wide-advertisement-one.jpg";

export default function AdvertisementWideOne() {
  return (
    <div
      className={cn(
        "container max-w-screen-xl mx-auto my-12",
        "px-4 md:px-6 lg:px-8"
      )}
    >
      <div className="relative ">
        <Image
          src={WideAdvertisementOne}
          alt="Brand Store Background"
          width={1400}
          height={300}
          className="rounded-lg"
          style={{
            objectFit: "contain",
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          loading="lazy"
        />
      </div>
    </div>
  );
}

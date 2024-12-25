import AdvertisementWideOne from "./_components/advertisement-wide-one";
import HeroCarousel from "./_components/hero-carousel";
import AdvertisementWideTwo from "./_components/advertisement-wide-two";
import AdvertisementTwoColumn from "./_components/advertisement-two-column";
import ProductCarouselContainer from "./_components/product-carousel-container";
import MobileCategoryNavContainer from "./_components/mobile-category-nav-container";
import { Suspense } from "react";
import MobileCategoryNavSkeleton from "./_components/homepage/mobile-category-nav-skeleton";
import PromotionalGrid from "./_components/promotional-grid";
import ProductCarouselSkeleton from "./_components/homepage/product-carousel-skeleton";

export default function HomePage() {
  return (
    <main>
      <HeroCarousel />
      <Suspense fallback={<MobileCategoryNavSkeleton />}>
        <MobileCategoryNavContainer />
      </Suspense>
      <PromotionalGrid />

      <Suspense fallback={<ProductCarouselSkeleton />}>
        <ProductCarouselContainer title="Best Selling Products" />
      </Suspense>

      <AdvertisementWideOne />

      <Suspense fallback={<ProductCarouselSkeleton />}>
        <ProductCarouselContainer title="New Products" />
      </Suspense>
      <AdvertisementTwoColumn />
      <AdvertisementWideTwo />
    </main>
  );
}

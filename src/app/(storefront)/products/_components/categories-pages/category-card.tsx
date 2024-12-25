import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PlaceholderImage from "@/images/placeholder-image.png";
import { BLUR_DATA_URL } from "@/lib/constants";
import { CategoryWithRelations } from "@/types/storefront-products";
import Image from "next/image";

export default function CategoryCard({
  category,
}: {
  category: CategoryWithRelations;
}) {
  const getProductCount = (category: CategoryWithRelations) => {
    switch (category.type) {
      case "PRIMARY":
        return category.primaryProducts.length;
      case "SECONDARY":
        return category.secondaryProducts.length;
      case "TERTIARY":
        return category.tertiaryProducts.length;
      case "QUATERNARY":
        return category.quaternaryProducts.length;
      default:
        return 0;
    }
  };

  const productCount = getProductCount(category);

  return (
    <Card className="group h-full bg-white border-gray-300 rounded-xl overflow-hidden lg:hover:shadow-lg transition-all duration-300 shadow-none">
      <CardHeader className="text-center p-3 pb-1 lg:p-6 lg:pb-2">
        <CardTitle className="font-semibold text-lg lg:text-2xl 2xl:text-3xl text-gray-900">
          {category.name}
        </CardTitle>
        <CardDescription className="text-sm lg:text-base font-medium text-secondary">
          {productCount} Product{productCount !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 lg:p-6">
        <div className="relative h-20 lg:h-28 bg-white">
          <Image
            src={category.image || PlaceholderImage}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain transition-all duration-300 group-hover:scale-105"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        </div>
      </CardContent>
    </Card>
  );
}

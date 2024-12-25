"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Prisma } from "@prisma/client";

type BrandWithCount = Prisma.BrandGetPayload<{
  select: {
    name: true;
    image: true;
    countryOfOrigin: true;
    _count: {
      select: {
        products: true;
      };
    };
  };
}>;

type CategoryWithCount = Prisma.CategoryGetPayload<{
  select: {
    name: true;
    image: true;
    _count: {
      select: {
        primaryProducts: true;
        secondaryProducts: true;
        tertiaryProducts: true;
        quaternaryProducts: true;
      };
    };
  };
}>;

type InventoryWithProduct = Prisma.InventoryGetPayload<{
  select: {
    id: true;
    product: {
      select: {
        name: true;
        images: true;
        tradePrice: true;
        features: true;
        model: true;
        type: true;
        brand: {
          select: {
            name: true;
            image: true;
            countryOfOrigin: true;
          };
        };
        primaryCategory: { select: { name: true } };
        secondaryCategory: { select: { name: true } };
        tertiaryCategory: { select: { name: true } };
        quaternaryCategory: { select: { name: true } };
      };
    };
  };
}>;

type SearchSuggestionsProps = {
  brands: BrandWithCount[];
  categories: CategoryWithCount[];
  products: InventoryWithProduct[];
  onSelectBrand: (brand: BrandWithCount) => void;
  onSelectCategory: (category: CategoryWithCount) => void;
  onSelectProduct: (product: InventoryWithProduct) => void;
};

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  show: boolean;
}> = ({ title, children, show }) => {
  if (!show) return null;

  return (
    <div className="py-2">
      <h2 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {title}
      </h2>
      {children}
    </div>
  );
};

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  brands,
  categories,
  products,
  onSelectBrand,
  onSelectCategory,
  onSelectProduct,
}) => {
  if (brands.length === 0 && categories.length === 0 && products.length === 0) {
    return null;
  }

  return (
    <Card className="absolute z-20 w-full mt-1 shadow-lg overflow-hidden">
      <CardContent className="p-0 max-h-[600px] overflow-y-auto divide-y divide-gray-100">
        <Section title="Brands" show={brands.length > 0}>
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer"
              onClick={() => onSelectBrand(brand)}
            >
              <div className="flex items-center space-x-4">
                {brand.image && (
                  <div className="flex-shrink-0 w-12 h-12 relative">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      layout="fill"
                      objectFit="contain"
                      className="rounded-md"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <h3 className="text-sm font-medium text-gray-900">
                    {brand.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {brand._count.products} products
                    {brand.countryOfOrigin && ` • ${brand.countryOfOrigin}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Section>

        <Section title="Categories" show={categories.length > 0}>
          {categories.map((category) => (
            <div
              key={category.name}
              className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer"
              onClick={() => onSelectCategory(category)}
            >
              <div className="flex items-center space-x-4">
                {category.image && (
                  <div className="flex-shrink-0 w-12 h-12 relative">
                    <Image
                      src={category.image}
                      alt={category.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <h3 className="text-sm font-medium text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {category._count.primaryProducts +
                      category._count.secondaryProducts +
                      category._count.tertiaryProducts +
                      category._count.quaternaryProducts}{" "}
                    products
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Section>

        <Section title="Products" show={products.length > 0}>
          {products.map((suggestion) => (
            <div
              key={suggestion.id}
              className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer"
              onClick={() => onSelectProduct(suggestion)}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-16 h-16 relative">
                  <Image
                    src={
                      suggestion.product.images[0] || "/placeholder-image.png"
                    }
                    alt={suggestion.product.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                    {suggestion.product.name}
                  </h3>
                  {suggestion.product.brand && (
                    <p className="text-xs font-medium text-gray-700 mt-0.5">
                      {suggestion.product.brand.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-0.5">
                    {[
                      suggestion.product.primaryCategory?.name,
                      suggestion.product.secondaryCategory?.name,
                      suggestion.product.tertiaryCategory?.name,
                      suggestion.product.quaternaryCategory?.name,
                    ]
                      .filter(Boolean)
                      .join(" > ")}
                  </p>
                  {suggestion.product.features.length > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                      {suggestion.product.features.join(", ")}
                    </p>
                  )}
                </div>
                {suggestion.product.tradePrice && (
                  <div className="flex-shrink-0 text-right">
                    <span className="text-sm font-semibold text-primary">
                      £{suggestion.product.tradePrice.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </Section>
      </CardContent>
    </Card>
  );
};

export default SearchSuggestions;

import React from "react";
import { StarIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Prisma } from "@prisma/client";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import { customSlugify } from "@/lib/functions";
import ProductDetailsSidebar from "./product-details-sidebar";
import TechnicalSpecs from "./product-technical-specs";
import ProductImageGallery from "./product-image-gallery";
import FixedProductBar from "./fixed-product-bar";

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

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  isCurrentPage?: boolean;
}

export default async function StorefrontProductDetailsPage({
  inventoryItem,
}: {
  inventoryItem: InventoryItemWithRelation; // Replace 'any' with the actual type of your inventory item
}) {
  const generateBreadcrumbItems = (
    product: InventoryItemWithRelation["product"]
  ) => {
    const items = [
      { label: "Products", href: "/products" },
    ] as BreadcrumbItem[];

    if (product.primaryCategory) {
      items.push({
        label: product.primaryCategory.name,
        href: `/products/c/${customSlugify(
          product.primaryCategory.name
        )}/c/?p_id=${product.primaryCategory.id}`,
      });
    }

    if (product.secondaryCategory) {
      items.push({
        label: product.secondaryCategory.name,
        href: `/products/c/${customSlugify(
          product?.primaryCategory?.name
        )}/${customSlugify(product.secondaryCategory.name)}/c/?p_id=${
          product?.primaryCategory?.id
        }&s_id=${product.secondaryCategory.id}`,
      });
    }

    if (product.tertiaryCategory) {
      items.push({
        label: product.tertiaryCategory.name,
        href: `/products/c/${customSlugify(
          product.primaryCategory?.name
        )}/${customSlugify(product.secondaryCategory?.name)}/${customSlugify(
          product.tertiaryCategory.name
        )}/c/?p_id=${product.primaryCategory?.id}&s_id=${
          product.secondaryCategory?.id
        }&t_id=${product.tertiaryCategory.id}`,
      });
    }

    if (product.quaternaryCategory) {
      items.push({
        label: product.quaternaryCategory.name,
        href: `/products/c/${customSlugify(
          product.primaryCategory?.name
        )}/${customSlugify(product.secondaryCategory?.name)}/${customSlugify(
          product.tertiaryCategory?.name
        )}/${customSlugify(product.quaternaryCategory.name)}/c/?p_id=${
          product.primaryCategory?.id
        }&s_id=${product.secondaryCategory?.id}&t_id=${
          product.tertiaryCategory?.id
        }&q_id=${product.quaternaryCategory.id}`,
      });
    }

    items.push({
      label: product.name,
      isCurrentPage: true,
    });

    return items;
  };

  // Inside your StorefrontProductDetails component:
  const breadcrumbItems = generateBreadcrumbItems(inventoryItem.product);

  return (
    <main className="min-h-screen">
      {/* Breadcrumb Section */}
      <header className="bg-primary py-4 lg:py-8 hidden lg:block">
        <div className="container mx-auto px-4 lg:px-8 max-w-screen-xl">
          <DynamicBreadcrumb items={breadcrumbItems} />
        </div>
      </header>

      <div className="container mx-auto px-0 max-w-screen-xl">
        {/* Main Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 my-5 lg:my-10">
          {/* Left Column - Product Images and Details */}
          <section className="lg:col-span-7">
            <ProductImageGallery inventoryItem={inventoryItem} />

            <div className="px-4 lg:px-8 my-7">
              <div className="items-center mt-2 flex lg:hidden">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="w-4 h-4 text-green-450 fill-none"
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">4.99</span>
              </div>

              <h1 className="text-xl font-semibold text-gray-800 block lg:hidden mt-2">
                {inventoryItem.product.name}
              </h1>
            </div>

            <Separator className="block lg:hidden" />

            <article className="prose max-w-none px-4 lg:px-8 mt-5">
              <h2 className="text-lg lg:text-xl font-semibold mb-4">
                Product Description
              </h2>
              <p className="text-gray-700">
                {inventoryItem.product.description}
              </p>
              <ul className="mt-4 space-y-2">
                {inventoryItem.product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>

            <div className="px-4 lg:px-8 mt-5">
              <TechnicalSpecs product={inventoryItem.product} />
            </div>
          </section>

          {/* Right Column - Product Actions */}
          <aside className="lg:col-span-5 relative">
            <ProductDetailsSidebar inventoryItem={inventoryItem} />
          </aside>
        </div>
      </div>

      <FixedProductBar inventoryItem={inventoryItem} />
    </main>
  );
}

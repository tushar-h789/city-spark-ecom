"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HomeIcon, StarIcon, TruckIcon } from "lucide-react";
import BranchIcon from "@/components/icons/branch";
import DeliveryIcon from "@/components/icons/delivary";
import AcceptedPayments from "../../_components/accepted-payments";
import { Prisma } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { useTransition } from "react";
import { addToCart } from "@/app/(storefront)/products/actions";
import Image from "next/image";

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

export default function ProductDetailsSidebar({
  inventoryItem,
}: {
  inventoryItem: InventoryItemWithRelation;
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState("1");
  const { product } = inventoryItem;

  const handleQuantityChange = (newValue: number) => {
    setInputValue(Math.max(1, newValue).toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const parsedValue = parseInt(inputValue) || 1;
    setInputValue(parsedValue.toString());
  };

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>,
    type: "FOR_DELIVERY" | "FOR_COLLECTION"
  ) => {
    e.preventDefault();
    const quantity = parseInt(inputValue);
    startTransition(async () => {
      const result = await addToCart(inventoryItem.id, quantity, type);
      if (result?.success) {
        toast({
          title: "Added to Cart",
          description: result.message,
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: result?.message,
          variant: "destructive",
        });
      }
    });
    setInputValue("1");
  };

  return (
    <Card className="border-gray-300 shadow-none sticky top-10 hidden lg:block">
      <CardContent className="p-6">
        {product.brand?.image ? (
          <div className="flex items-center mb-4">
            <div className="relative w-16 h-8">
              <Image
                src={product.brand.image}
                alt="Brand logo"
                fill
                className="object-contain"
                sizes="64px"
              />
            </div>
          </div>
        ) : null}

        <h1 className="text-2xl font-semibold text-gray-900 mb-3 leading-tight">
          {product.name}
        </h1>

        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className="w-4 h-4 text-secondary fill-current"
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">4.99</span>
          </div>
          <span className="text-sm text-gray-500">CP123456</span>
        </div>

        <div className="flex flex-col gap-1 mb-7">
          <div className="flex items-baseline gap-2">
            {product.promotionalPrice ? (
              <>
                <span className="text-4xl font-semibold tracking-tight">
                  £{product.promotionalPrice.toFixed(2)}
                </span>
                <div className="text-sm text-gray-500 font-medium">
                  inc. VAT
                </div>
                {product.retailPrice &&
                  product.retailPrice > product.promotionalPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      £{product.retailPrice.toFixed(2)}
                    </span>
                  )}
              </>
            ) : (
              <>
                <span className="text-4xl font-semibold tracking-tight">
                  £{(product.retailPrice || 0).toFixed(2)}
                </span>
                <div className="text-sm text-gray-500 font-medium">
                  inc. VAT
                </div>
              </>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-medium text-gray-700">
              £
              {(
                (product.promotionalPrice || product.retailPrice || 0) * 0.8
              ).toFixed(2)}
            </span>
            <div className="text-sm text-gray-500 font-medium">exc. VAT</div>
          </div>
        </div>

        <div className="flex gap-2 items-center mb-6">
          <div className="flex items-center bg-gray-100 rounded-md">
            <button
              onClick={() =>
                handleQuantityChange(Math.max(1, parseInt(inputValue) - 1))
              }
              disabled={isPending || parseInt(inputValue) <= 1}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-l-md transition-colors"
              aria-label="Decrease quantity"
            >
              <span className="text-gray-600 font-medium">-</span>
            </button>
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="w-16 text-center bg-transparent focus:outline-none py-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              disabled={isPending}
              aria-label="Quantity"
            />
            <button
              onClick={() => handleQuantityChange(parseInt(inputValue) + 1)}
              disabled={isPending}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-r-md transition-colors"
              aria-label="Increase quantity"
            >
              <span className="text-gray-600 font-medium">+</span>
            </button>
          </div>

          <Button
            variant="outline"
            onClick={(e) => handleAddToCart(e, "FOR_COLLECTION")}
            disabled={isPending || !inventoryItem.collectionEligibility}
            className="flex-1"
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            Collection
          </Button>
          <Button
            onClick={(e) => handleAddToCart(e, "FOR_DELIVERY")}
            disabled={isPending || !inventoryItem.deliveryEligibility}
            className="flex-1"
          >
            <TruckIcon className="w-4 h-4 mr-2" />
            Delivery
          </Button>
        </div>

        <Separator className="mb-6" />

        <div>
          <h3 className="font-semibold text-sm mb-3">Ways to get it</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-gray-100 rounded-full p-2">
                <BranchIcon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-sm">Select Branch</h4>
                <p className="text-xs text-gray-600">
                  Check local availability
                </p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-gray-100 rounded-full p-2">
                <DeliveryIcon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-sm">Delivery Location</h4>
                <p className="text-xs text-gray-600">
                  Enter postcode for delivery options
                </p>
              </div>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

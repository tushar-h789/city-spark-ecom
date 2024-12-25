"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { HomeIcon, TruckIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { addToCart } from "../actions";

type InventoryItemWithRelation = Prisma.InventoryGetPayload<{
  include: {
    product: {
      include: {
        brand: true;
        primaryCategory: true;
        secondaryCategory: true;
        tertiaryCategory: true;
        quaternaryCategory: true;
      };
    };
  };
}>;

interface FixedProductBarProps {
  inventoryItem: InventoryItemWithRelation;
}

export default function FixedProductBar({
  inventoryItem,
}: FixedProductBarProps) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(1, newQuantity));
  };

  const handleAddToCart = async (type: "FOR_DELIVERY" | "FOR_COLLECTION") => {
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
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20 lg:hidden">
      <div className="container mx-auto px-4 py-4">
        {/* Price Row */}
        <div className="flex items-baseline justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              £{inventoryItem.product.promotionalPrice?.toFixed(2)}
            </span>
            {inventoryItem.product.tradePrice &&
              inventoryItem.product.tradePrice >
                (inventoryItem.product.promotionalPrice || 0) && (
                <span className="text-sm text-gray-500 line-through">
                  £{inventoryItem.product.tradePrice.toFixed(2)}
                </span>
              )}
            <span className="text-sm text-gray-500 ml-1">inc. VAT</span>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="mb-4">
          <div
            className={cn(
              "flex h-[42px] items-center rounded-md",
              "bg-gray-50 border border-gray-200"
            )}
          >
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={isPending || quantity <= 1}
              className={cn(
                "w-14 h-full flex items-center justify-center",
                "hover:bg-gray-100 transition-colors",
                "border-r border-gray-200",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <span className="text-gray-600 text-lg font-medium">−</span>
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                handleQuantityChange(parseInt(e.target.value) || 1)
              }
              className={cn(
                "flex-1 text-center bg-transparent",
                "border-none spinner-none focus:outline-none",
                "text-base font-medium h-full"
              )}
              min="1"
              disabled={isPending}
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={isPending}
              className={cn(
                "w-14 h-full flex items-center justify-center",
                "hover:bg-gray-100 transition-colors",
                "border-l border-gray-200",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <span className="text-gray-600 text-lg font-medium">+</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleAddToCart("FOR_COLLECTION")}
            disabled={isPending || !inventoryItem.collectionEligibility}
            className={cn("text-base font-medium", "shadow-sm hover:shadow")}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <HomeIcon className="mr-2 h-5 w-5" />
                Collect
              </>
            )}
          </Button>
          <Button
            variant="default"
            size="lg"
            onClick={() => handleAddToCart("FOR_DELIVERY")}
            disabled={isPending || !inventoryItem.deliveryEligibility}
            className={cn("text-base font-medium", "shadow-sm hover:shadow")}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <TruckIcon className="mr-2 h-5 w-5" />
                Deliver
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

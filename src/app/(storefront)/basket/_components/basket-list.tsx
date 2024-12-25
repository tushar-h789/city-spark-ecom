"use client";

import React, { useState } from "react";
import { useOptimistic, useTransition } from "react";
import BasketItem from "./basket-item";
import { Separator } from "@/components/ui/separator";
import { removeFromCart } from "../../products/actions";
import { FulFillmentType, Prisma } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { ChevronRight, MapPin, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CartItemWithRelations = Prisma.CartItemGetPayload<{
  include: {
    inventory: {
      include: {
        product: {
          select: {
            id: true;
            name: true;
            images: true;
            tradePrice: true;
            promotionalPrice: true;
            retailPrice: true;
          };
        };
      };
    };
  };
}>;

interface BasketListProps {
  items: CartItemWithRelations[];
  type: FulFillmentType;
}

const BasketList: React.FC<BasketListProps> = ({ items, type }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (state: CartItemWithRelations[], removedItemId: string) =>
      state.filter((item) => item.id !== removedItemId)
  );

  const handleRemoveItem = async (itemId: string) => {
    startTransition(async () => {
      try {
        addOptimisticItem(itemId);

        const result = await removeFromCart(itemId);
        await queryClient.invalidateQueries({ queryKey: ["cart"] });

        if (!result.success) {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error("Failed to remove item:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to remove item",
          variant: "destructive",
        });
      }
    });
  };

  if (!optimisticItems?.length) {
    return null;
  }

  const title =
    type === FulFillmentType.FOR_DELIVERY
      ? "Items for Delivery"
      : "Items for Collection";

  return (
    <>
      <section className="mb-16">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-semibold">
            {type === FulFillmentType.FOR_DELIVERY ? (
              <>
                Items for delivery to{" "}
                <span className="text-primary">IG11 7YA</span>
              </>
            ) : (
              "Items for Collection"
            )}
          </h2>
          {type === FulFillmentType.FOR_DELIVERY && (
            <button
              onClick={() => setIsDialogOpen(true)}
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100/50 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors"
            >
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Change
            </button>
          )}
        </div>
        <Card
          className={cn(
            "p-5 shadow-none border-gray-300",
            isPending && "opacity-50"
          )}
        >
          {optimisticItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <BasketItem cartItem={item} onRemove={handleRemoveItem} />
              {index < optimisticItems.length - 1 && (
                <Separator className="my-4 bg-gray-300" />
              )}
            </React.Fragment>
          ))}
        </Card>
      </section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Delivery Address</DialogTitle>
            <DialogDescription>
              Update your delivery address for this order.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {/* Add your address change form or content here */}
            {/* This is a placeholder for the actual address change functionality */}
            <p className="text-sm text-gray-500">
              Address change functionality will be implemented here.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BasketList;

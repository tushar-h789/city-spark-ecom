"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateCartItemQuantity } from "../../products/actions";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import PlaceholderImage from "@/images/placeholder-image.png";
import { BLUR_DATA_URL } from "@/lib/constants";

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

interface BasketItemProps {
  cartItem: CartItemWithRelations;
  onRemove: (id: string) => Promise<void>;
}

const BasketItem: React.FC<BasketItemProps> = ({ cartItem, onRemove }) => {
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState(
    (cartItem.quantity ?? 1).toString()
  );
  const [debouncedQuantity, setDebouncedQuantity] = useState(
    cartItem.quantity ?? 1
  );
  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInputValue((cartItem.quantity ?? 1).toString());
  }, [cartItem.quantity]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const parsedQuantity = parseInt(inputValue) || 1;
      setDebouncedQuantity(parsedQuantity);
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue]);

  useEffect(() => {
    if (debouncedQuantity !== cartItem.quantity) {
      startTransition(async () => {
        try {
          const result = await updateCartItemQuantity(
            cartItem.id,
            debouncedQuantity
          );
          if (!result.success) {
            throw new Error(result.message);
          }
        } catch (error) {
          toast({
            title: "Error",
            description:
              error instanceof Error ? error.message : "An error occurred",
            variant: "destructive",
          });
          setInputValue((cartItem.quantity ?? 1).toString());
        }
      });
    }
  }, [debouncedQuantity, cartItem.id, cartItem.quantity, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const parsedValue = parseInt(inputValue) || 1;
    setInputValue(parsedValue.toString());
  };

  const handleButtonClick = (increment: boolean) => {
    const currentValue = parseInt(inputValue) || 1;
    const newValue = increment
      ? currentValue + 1
      : Math.max(1, currentValue - 1);
    setInputValue(newValue.toString());
  };

  const unitPrice =
    cartItem.inventory.product.promotionalPrice ||
    cartItem.inventory.product.retailPrice ||
    0;

  const quantity = parseInt(inputValue) || 1;
  const totalPrice = unitPrice * quantity;

  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr_auto_auto] items-center gap-6 py-4 last:border-b-0 transition-opacity duration-200",
        isPending && "opacity-30 pointer-events-none"
      )}
    >
      {/* Product Image */}
      <div className="relative w-24 h-24 rounded-md bg-gray-50">
        <Image
          src={cartItem.inventory.product.images[0] || PlaceholderImage}
          alt={cartItem.inventory.product.name}
          fill
          style={{ objectFit: "contain" }}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
      </div>

      {/* Product Details and Quantity */}
      <div className="space-y-3">
        <h3
          className="font-semibold text-lg text-gray-800 line-clamp-2"
          title={cartItem.inventory.product.name}
        >
          {cartItem.inventory.product.name}
        </h3>

        <div className="flex justify-between bg-gray-100 rounded-md text-lg relative overflow-hidden w-32 h-9">
          <button
            onClick={() => handleButtonClick(false)}
            className="absolute top-0 left-0 h-full w-10 flex items-center justify-center transition-colors duration-200 ease-in-out hover:bg-gray-200 active:bg-gray-400"
          >
            <span className="text-gray-600 font-medium select-none">-</span>
          </button>
          <input
            className="w-full h-full appearance-none border-none text-center bg-transparent focus:outline-none font-medium [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm"
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          <button
            onClick={() => handleButtonClick(true)}
            className="absolute top-0 right-0 h-full w-10 flex items-center justify-center transition-colors duration-200 ease-in-out hover:bg-gray-200 active:bg-gray-400"
          >
            <span className="text-gray-600 font-medium select-none">+</span>
          </button>
        </div>
      </div>

      {/* Price Information */}
      <div className="text-right">
        <div className="text-xl font-semibold text-gray-800">
          £{totalPrice.toFixed(2)}{" "}
          <span className="text-xs text-gray-500">inc. VAT</span>
        </div>
        <div className="text-sm text-gray-500">
          {quantity} × £{unitPrice.toFixed(2)}{" "}
          <span className="text-xs">inc. VAT</span>
        </div>
      </div>

      {/* Delete Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(cartItem.id)}
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default BasketItem;

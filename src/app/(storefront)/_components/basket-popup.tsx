import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Loader2, AlertCircle, Store, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NumericFormat } from "react-number-format";
import Link from "next/link";
import { fetchCart, type CartWithRelations } from "@/services/cart";
import PlaceholderImage from "@/images/placeholder-image.png";
import { BLUR_DATA_URL } from "@/lib/constants";

type GroupedCartItems = {
  delivery: CartWithRelations["cartItems"];
  collection: CartWithRelations["cartItems"];
};

const GroupHeader = ({
  type,
  itemCount,
}: {
  type: "FOR_DELIVERY" | "FOR_COLLECTION";
  itemCount: number;
}) => (
  <div className="flex items-center gap-2 py-2 px-1 border-b">
    {type === "FOR_DELIVERY" ? (
      <Truck className="w-4 h-4 text-primary" />
    ) : (
      <Store className="w-4 h-4 text-primary" />
    )}
    <h4 className="text-sm font-medium text-gray-900">
      {type === "FOR_DELIVERY" ? "Delivery" : "Collection"}{" "}
      <span className="text-muted-foreground">({itemCount} items)</span>
    </h4>
  </div>
);

const CartItemCard = ({
  item,
}: {
  item: CartWithRelations["cartItems"][0];
}) => {
  const { inventory, quantity } = item;
  const { product } = inventory;

  const price = product.promotionalPrice || product.retailPrice || 0;

  return (
    <div className="flex gap-4 py-3">
      <div className="relative h-16 w-16 rounded-md bg-gray-50">
        <Image
          src={product.images[0] || PlaceholderImage}
          alt={product.name}
          fill
          className="object-contain p-2"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
      </div>
      <div className="flex flex-1 flex-col">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1.5">
          {product.name}
        </h4>
        <p className="text-sm text-gray-500 mb-2">Quantity: {quantity}</p>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-semibold text-gray-900">
              <NumericFormat
                value={quantity * price}
                displayType="text"
                prefix="£"
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator=","
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BasketPopup() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: cart,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cart"],
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 3,
    retryDelay: 1000,
    queryFn: fetchCart,
  });

  const groupedItems = useMemo<GroupedCartItems>(() => {
    if (!cart?.cartItems) {
      return {
        delivery: [],
        collection: [],
      };
    }

    return cart.cartItems.reduce(
      (acc, item) => {
        if (item.type === "FOR_DELIVERY") {
          acc.delivery.push(item);
        } else {
          acc.collection.push(item);
        }
        return acc;
      },
      // Specify the type here for the initial value:
      {
        delivery: [] as CartWithRelations["cartItems"],
        collection: [] as CartWithRelations["cartItems"],
      }
    );
  }, [cart]);

  const cartItemCount = cart?.cartItems?.length || 0;
  const subTotalWithVat = cart?.subTotalWithVat || 0;
  const subTotalWithoutVat = cart?.subTotalWithoutVat || 0;

  return (
    <div
      className="relative z-50"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link href="/basket">
        <button
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-white rounded-md transition-colors duration-200",
            "hover:bg-white/10",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          )}
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span
                className={cn(
                  "absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full flex items-center justify-center",
                  cartItemCount > 9 ? "w-5 h-5 text-[10px]" : "w-4 h-4"
                )}
              >
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-base font-medium">Basket</span>
        </button>
      </Link>

      {isOpen && (
        <>
          <div className="absolute h-2 w-full top-full" />
          <div className="absolute top-[calc(100%+0.5rem)] right-0 w-96 bg-white rounded-lg shadow-lg border animate-fadeIn origin-top">
            <ScrollArea className="h-[400px]">
              <div className="p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Failed to load cart items. Please try again.
                    </AlertDescription>
                  </Alert>
                ) : cartItemCount === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    Your basket is empty
                  </div>
                ) : (
                  <div className="space-y-4">
                    {groupedItems.collection.length > 0 && (
                      <div>
                        <GroupHeader
                          type="FOR_COLLECTION"
                          itemCount={groupedItems.collection.length}
                        />
                        <div className="space-y-2 divide-y">
                          {groupedItems.collection.map((item) => (
                            <CartItemCard key={item.id} item={item} />
                          ))}
                        </div>
                      </div>
                    )}
                    {groupedItems.delivery.length > 0 && (
                      <div>
                        <GroupHeader
                          type="FOR_DELIVERY"
                          itemCount={groupedItems.delivery.length}
                        />
                        <div className="space-y-2 divide-y">
                          {groupedItems.delivery.map((item) => (
                            <CartItemCard key={item.id} item={item} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t p-4 shadow-[0_-2px_4px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-lg text-gray-900">
                  Subtotal (inc. VAT)
                </span>
                <span className="font-bold text-lg text-gray-900">
                  <NumericFormat
                    value={subTotalWithVat}
                    displayType="text"
                    prefix="£"
                    decimalScale={2}
                    fixedDecimalScale
                    thousandSeparator=","
                  />
                </span>
              </div>

              <div className="flex justify-between mb-4 text-sm">
                <span className="text-gray-500">Subtotal (exc. VAT)</span>
                <span className="text-gray-500">
                  <NumericFormat
                    value={subTotalWithoutVat}
                    displayType="text"
                    prefix="£"
                    decimalScale={2}
                    fixedDecimalScale
                    thousandSeparator=","
                  />
                </span>
              </div>

              <Link href="/basket" passHref>
                <Button
                  className="w-full"
                  disabled={!cart?.cartItems || cart.cartItems.length === 0}
                >
                  View Basket
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

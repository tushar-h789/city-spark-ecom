"use client";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Store, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeliveryAddress from "./delivery-address";
import { CartWithItems } from "@/services/storefront-cart";

interface FulfillmentFormProps {
  onNext: () => void;
  onBack: () => void;
  cart: CartWithItems;
}

const ItemList = ({ items }: { items: CartWithItems["cartItems"] }) => (
  <div className="divide-y divide-gray-100">
    {items.map((item) => (
      <div className="py-4 flex items-center gap-4" key={item.id}>
        {/* Product Image - if available */}
        <div className="w-16 h-16 rounded bg-gray-100 shrink-0" />

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900">
            {item.inventory.product.name}
          </h4>
          <div className="mt-1 flex items-center gap-4 text-sm">
            <span className="text-gray-500">Qty: {item.quantity}</span>
            <span className="text-gray-900">
              £
              {(
                item.inventory.product.promotionalPrice ||
                item.inventory.product.retailPrice ||
                0
              ).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export function FulfillmentForm({
  onNext,
  onBack,
  cart,
}: FulfillmentFormProps) {
  const deliveryItems = cart.cartItems.filter(
    (item) => item.type === "FOR_DELIVERY"
  );
  const collectionItems = cart.cartItems.filter(
    (item) => item.type === "FOR_COLLECTION"
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      {deliveryItems.length > 0 && (
        <div className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-1">
              <CardTitle className="text-2xl">Delivery Items</CardTitle>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Estimated delivery:{" "}
              <span className="font-medium text-primary">
                Wednesday, 27th December 2024
              </span>
            </p>
          </CardHeader>

          <Separator className="mb-6" />

          <CardContent className="space-y-6">
            <div className="bg-gray-50/50 rounded-lg p-4">
              <ItemList items={deliveryItems} />
            </div>
            <DeliveryAddress />
          </CardContent>
        </div>
      )}

      {collectionItems.length > 0 && (
        <div>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-1">
              <CardTitle className="text-2xl">Collection Items</CardTitle>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Items you&apos;ll collect from our store
            </p>
          </CardHeader>

          <Separator className="mb-6" />

          <CardContent className="space-y-6">
            <div className="bg-gray-50/50 rounded-lg p-4">
              <ItemList items={collectionItems} />
            </div>

            <div className="bg-gray-50 rounded-lg border-gray-200 border p-4">
              <div className="flex items-center gap-3 mb-1">
                <Store className="h-4 w-4 text-gray-500" />
                <h3 className="font-medium text-gray-900">Collection Point</h3>
              </div>
              <p className="text-sm text-gray-600 pl-7">
                123 High Street, London, SW1A 1AA
              </p>
            </div>
          </CardContent>
        </div>
      )}

      <div className="mt-6 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-gray-200"
        >
          Back
        </Button>
        <Button type="submit" className="min-w-[100px]">
          Continue
        </Button>
      </div>
    </form>
  );
}

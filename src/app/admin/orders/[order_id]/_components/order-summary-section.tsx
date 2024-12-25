"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderWithRelations } from "@/services/admin-orders";

interface OrderSummaryCardProps {
  order: OrderWithRelations;
}

export default function OrderSummarySection({ order }: OrderSummaryCardProps) {
  const cart = order.cart;

  const subTotalWithoutVat = cart.subTotalWithoutVat || 0;
  const vat = cart.vat || 0;
  const deliveryCharge = cart.deliveryCharge || 0;
  const totalWithVat = cart.totalPriceWithVat || 0;
  const totalWithoutVat = cart.totalPriceWithoutVat || 0;
  const discountAmount = cart.promoDiscount || 0;

  return (
    <Card className="bg-white">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="text-gray-600 flex items-baseline gap-2">
              <span>Subtotal</span>
              <span className="text-xs">(exc. VAT)</span>
            </div>
            <span>£{subTotalWithoutVat.toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-red-600">Discount</span>
              <span className="text-red-600">
                -£{discountAmount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">VAT (20%)</span>
            <span>£{vat.toFixed(2)}</span>
          </div>

          {deliveryCharge > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery</span>
              <span>£{deliveryCharge.toFixed(2)}</span>
            </div>
          )}

          <Separator className="my-2" />

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>£{totalWithVat.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Total (exc. VAT)</span>
            <span>£{totalWithoutVat.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

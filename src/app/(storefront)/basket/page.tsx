import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import AcceptedPayments from "../_components/accepted-payments";
import { FulFillmentType } from "@prisma/client";
import { ArrowLeft, ShoppingCart, User } from "lucide-react";
import BasketList from "./_components/basket-list";

import CheckoutButton from "./_components/checkout-button";
import { getCart } from "@/services/storefront-cart";

export const dynamic = "force-dynamic";

export default async function StorefrontBasketPage() {
  const cart = await getCart();

  const collectionItems = cart?.cartItems.filter(
    (item) => item.type === FulFillmentType.FOR_COLLECTION
  );
  const deliveryItems = cart?.cartItems.filter(
    (item) => item.type === FulFillmentType.FOR_DELIVERY
  );

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-screen-xl">
        <Link
          href="/products"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-10 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to shopping
        </Link>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-10">My Basket</h1>
        <Card className="p-8 sm:p-12 shadow-none border-gray-300 text-center">
          <ShoppingCart className="mx-auto mb-6 h-16 w-16 text-gray-400" />
          <h2 className="text-2xl font-semibold mb-4">Your basket is empty</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven&apos;t added any items to your basket yet.
          </p>
          <Link href="/products">
            <Button variant="default" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-screen-xl">
      <Link
        href="/products"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-10 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to shopping
      </Link>

      <h1 className="text-4xl sm:text-5xl font-extrabold mb-10">My Basket</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <div className="bg-blue-50 p-5 rounded-lg mb-10">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-lg mb-1">
                  Sign in to your account
                </h2>
                <p className="text-sm text-gray-700">
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Sign in
                  </Link>{" "}
                  or{" "}
                  <Link
                    href="/register"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    create an account
                  </Link>{" "}
                  to access exclusive benefits and faster checkout.
                </p>
              </div>
            </div>
          </div>

          {collectionItems && collectionItems.length > 0 && (
            <BasketList
              items={collectionItems}
              type={FulFillmentType.FOR_COLLECTION}
            />
          )}

          {deliveryItems && deliveryItems.length > 0 && (
            <BasketList
              items={deliveryItems}
              type={FulFillmentType.FOR_DELIVERY}
            />
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-6">
            <Card className="shadow-none bg-offWhite border-gray-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-base">Add Promo Code</h3>
                  <p className="text-sm text-gray-600">
                    Promotions and coupon codes can not be used in conjunction
                    or with any other offer.
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Gift card or promo code"
                      className="border-gray-300"
                    />
                    <Button className="bg-secondary hover:bg-secondary/90 transition-colors">
                      Apply
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[15px]">
                    <span className="font-normal text-gray-700">
                      Subtotal (exc. VAT)
                    </span>
                    <span className="tabular-nums font-semibold">
                      £{cart.subTotalWithoutVat?.toFixed(2)}
                    </span>
                  </div>
                  {deliveryItems && deliveryItems.length > 0 && (
                    <div className="flex items-center justify-between text-[15px]">
                      <span className="font-normal text-gray-700">
                        Delivery
                      </span>
                      <span className="tabular-nums font-semibold">£5.00</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[15px]">
                    <span className="font-normal text-gray-700">VAT</span>
                    <span className="tabular-nums font-semibold">
                      £{cart.vat?.toFixed(2)}
                    </span>
                  </div>
                  <Separator className="my-2 bg-gray-300" />
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-medium text-gray-900">
                      Total
                    </span>
                    <span className="text-xl tabular-nums font-bold">
                      £{cart.totalPriceWithVat?.toFixed(2)}
                    </span>
                  </div>
                </div>

                <CheckoutButton />
                <div className="pt-2">
                  <h3 className="font-semibold text-sm mb-4">
                    Accepted Payment Methods
                  </h3>
                  <AcceptedPayments />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import { getCart } from "@/services/storefront-cart";
import CheckoutComponent from "./_components/checkout-component";
import { FulFillmentType } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CheckoutPage() {
  const cart = await getCart();

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-screen-xl">
        <h1 className="text-5xl font-extrabold mb-8">Checkout</h1>
        <Card className="p-8 shadow-none border-gray-350 text-center">
          <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven&apos;t added any items to your cart yet.
          </p>
          <Link href="/products">
            <Button variant="default">Continue Shopping</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return <CheckoutComponent cart={cart} />;
}

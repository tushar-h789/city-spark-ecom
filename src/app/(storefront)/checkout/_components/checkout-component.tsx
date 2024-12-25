"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Banknote,
  Check,
  CreditCard,
  Package2,
  Shield,
  Store,
  Truck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PaypalIcon from "@/components/icons/paypal";
import { useSession } from "next-auth/react";
import DeliveryAddress from "./delivery-address";
import { CartWithItems } from "@/services/storefront-cart";
import AcceptedPayments from "../../_components/accepted-payments";
import { ContactDetailsForm } from "./contact-details-form";
import { FulfillmentForm } from "./fulfillment-form";

type CheckoutStep = "contact" | "fulfillment" | "payment" | "review";

interface Address {
  line1: string;
  line2?: string;
  city: string;
  county?: string;
  postcode: string;
}

export default function CheckoutComponent({ cart }: { cart: CartWithItems }) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("contact");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const { data: session } = useSession();

  const deliveryItems =
    cart?.cartItems.filter((item) => item.type === "FOR_DELIVERY") || [];
  const collectionItems =
    cart?.cartItems.filter((item) => item.type === "FOR_COLLECTION") || [];

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  // User info from session
  const user = session?.user;

  // Price calculations from cart
  const subtotal = cart?.subTotalWithoutVat || 0;
  const vat = cart?.vat || 0;
  const shipping = cart?.deliveryCharge || 0;
  const total = cart?.totalPriceWithVat || 0;

  const steps = [
    {
      id: "contact",
      label: "Contact Details",
      icon: User,
      description: "Your personal information",
    },
    {
      id: "fulfillment",
      label: "Delivery & Collection",
      icon: Package2,
      description: "Address and collection details",
    },
    {
      id: "payment",
      label: "Payment",
      icon: CreditCard,
      description: "Review and pay",
    },
    {
      id: "review",
      label: "Confirmation",
      icon: Check,
      description: "Confirm your order",
    },
  ];

  const branchAddress: Address = {
    line1: "123 High Street",
    city: "London",
    county: "Greater London",
    postcode: "SW1A 1AA",
  };

  const formatAddress = (address: Address) => {
    return [
      address.line1,
      address.line2,
      address.city,
      address.county,
      address.postcode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/basket"
            className="flex items-center text-sm font-medium hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to basket
          </Link>
          <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
            <Shield className="w-4 h-4" />
            <span className="font-medium">Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="container max-w-screen-xl mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const isCompleted =
                index < steps.findIndex((s) => s.id === currentStep);
              const isCurrent = currentStep === step.id;

              return (
                <div
                  key={step.id}
                  className={`relative ${
                    isCompleted
                      ? "text-emerald-600"
                      : isCurrent
                      ? "text-primary"
                      : "text-gray-400"
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div
                      className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                      ${
                        isCompleted
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : isCurrent
                          ? "border-primary bg-primary text-white"
                          : "border-gray-200 bg-white"
                      }
                    `}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 transition-colors ${
                          isCompleted ? "bg-emerald-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                  <h3
                    className={`text-sm font-semibold ${
                      isCurrent ? "text-gray-900" : ""
                    }`}
                  >
                    {step.label}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-8 space-y-6">
            <Card className="shadow-none bg-offWhite border-gray-300">
              {currentStep === "contact" && (
                <ContactDetailsForm
                  onNext={() => setCurrentStep("fulfillment")}
                  onBack={() => setCurrentStep("contact")}
                />
              )}

              {currentStep === "fulfillment" && (
                <FulfillmentForm
                  onNext={() => setCurrentStep("payment")}
                  onBack={() => setCurrentStep("contact")}
                  cart={cart}
                />
              )}
              {currentStep === "payment" && (
                <div className="p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Payment Method
                    </h2>
                  </div>

                  <RadioGroup
                    defaultValue="card"
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="grid gap-4"
                  >
                    <Label
                      className={`flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5"
                          : "border-gray-200"
                      }`}
                    >
                      <RadioGroupItem value="card" className="mr-4" />
                      <CreditCard className="w-5 h-5 mr-3" />
                      <div>
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-sm text-gray-500">
                          Pay securely with your card
                        </p>
                      </div>
                    </Label>

                    <Label
                      className={`flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors ${
                        paymentMethod === "paypal"
                          ? "border-primary bg-primary/5"
                          : "border-gray-200"
                      }`}
                    >
                      <RadioGroupItem value="paypal" className="mr-4" />
                      <div className="w-5 h-5 mr-3 text-[#00457C]">
                        <PaypalIcon width={30} height={30} />
                      </div>
                      <div>
                        <p className="font-medium">PayPal</p>
                        <p className="text-sm text-gray-500">
                          Pay with your PayPal account
                        </p>
                      </div>
                    </Label>

                    <Label
                      className={`flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors ${
                        paymentMethod === "cash"
                          ? "border-primary bg-primary/5"
                          : "border-gray-200"
                      }`}
                    >
                      <RadioGroupItem value="cash" className="mr-4" />
                      <Banknote className="w-5 h-5 mr-3" />
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">
                          Pay when you receive your order
                        </p>
                      </div>
                    </Label>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <Card className="p-4 mt-4 border-gray-200">
                      <div className="grid gap-4">
                        {/* Card payment form would go here */}
                        <p className="text-sm text-gray-500">
                          Card payment form implementation needed
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {currentStep === "review" && (
                <div className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Order Confirmed
                    </h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Thank you for your order! We&apos;ve sent a confirmation
                      email to your inbox with all the details.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 max-w-sm mx-auto">
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Number:</span>
                        <span className="font-medium">SPR-12345</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount Paid:</span>
                        <span className="font-medium">£{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Link href="/account/orders">
                      <Button variant="outline" className="border-gray-200">
                        View Order
                      </Button>
                    </Link>
                    <Link href="/">
                      <Button>Continue Shopping</Button>
                    </Link>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-6">
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
                    {appliedPromo ? (
                      <div className="flex items-center justify-between bg-primary/5 p-3 rounded-lg border border-primary/10">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">
                            {appliedPromo.code}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAppliedPromo(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Gift card or promo code"
                          className="border-gray-300"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <Button
                          className="bg-secondary hover:bg-secondary/90 transition-colors"
                          onClick={() => {
                            // Demo applied promo
                            setAppliedPromo({
                              code: promoCode,
                              discount: 10.0,
                            });
                            setPromoCode("");
                          }}
                        >
                          Apply
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[15px]">
                      <span className="font-normal text-gray-700">
                        Subtotal (exc. VAT)
                      </span>
                      <span className="tabular-nums font-semibold">
                        £{cart?.subTotalWithoutVat?.toFixed(2)}
                      </span>
                    </div>
                    {deliveryItems && deliveryItems.length > 0 && (
                      <div className="flex items-center justify-between text-[15px]">
                        <span className="font-normal text-gray-700">
                          Delivery
                        </span>
                        <span className="tabular-nums font-semibold">
                          £5.00
                        </span>
                      </div>
                    )}

                    {appliedPromo && (
                      <div className="flex items-center justify-between text-[15px] text-emerald-600">
                        <span>Promo Discount</span>
                        <span className="tabular-nums font-semibold">
                          -£{appliedPromo.discount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[15px]">
                      <span className="font-normal text-gray-700">VAT</span>
                      <span className="tabular-nums font-semibold">
                        £{cart?.vat?.toFixed(2)}
                      </span>
                    </div>
                    <Separator className="my-2 bg-gray-300" />
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-medium text-gray-900">
                        Total
                      </span>
                      <span className="text-xl tabular-nums font-bold">
                        £{cart?.totalPriceWithVat?.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h3 className="font-semibold text-sm mb-4">
                      Accepted Payment Methods
                    </h3>
                    <AcceptedPayments />
                  </div>
                </CardContent>
              </Card>

              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="flex gap-3 text-sm text-emerald-700">
                  <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Secure Checkout</p>
                    <p className="text-emerald-600 mt-1">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

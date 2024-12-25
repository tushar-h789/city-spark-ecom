"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { CheckoutAuthDialog } from "./checkout-auth-dialog";

interface CheckoutButtonProps {
  className?: string;
}

export default function CheckoutButton({ className }: CheckoutButtonProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);

    if (!session) {
      setShowAuthDialog(true);
      setIsLoading(false);
      return;
    }

    router.push("/checkout");
    setIsLoading(false);
  };

  return (
    <>
      <Button
        variant="default"
        className={`w-full h-10 text-base ${className}`}
        onClick={handleCheckout}
        disabled={isLoading || status === "loading"}
      >
        {isLoading ? "Loading..." : "Checkout"}
      </Button>

      <CheckoutAuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
      />
    </>
  );
}

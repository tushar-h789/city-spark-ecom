"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, X } from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { OrderWithRelations } from "@/services/admin-orders";

interface OrderHeaderProps {
  orderDetails: OrderWithRelations;
  isPending?: boolean;
}

export default function OrderDetailsHeader({
  orderDetails,
  isPending = false,
}: OrderHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  const formattedDate = format(
    new Date(orderDetails.createdAt),
    "dd MMM yyyy, hh:mm a"
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "sticky top-0 z-[10] w-full",
        isScrolled ? "bg-white shadow-md" : "bg-zinc-50"
      )}
    >
      <div
        className={cn(
          "px-8 py-3 transition-all duration-200",
          "container pb-4 px-4 sm:px-8"
        )}
      >
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back to orders</span>
            </Button>
          </Link>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold tracking-tight truncate">
              {orderDetails.id}
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm text-muted-foreground">
                {formattedDate}
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Link href="/admin/orders">
              <Button type="button" variant="outline" className="h-9">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </Link>
            <LoadingButton
              type="submit"
              className="h-9"
              disabled={isPending}
              loading={isPending}
            >
              {!isPending && <Check className="mr-2 h-4 w-4" />}
              Save Changes
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useRef, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Trash2, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { NumericFormat } from "react-number-format";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { statusMap } from "@/app/data";
import { useDrag } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/web";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PlaceholderImage from "@/images/placeholder-image.png";
import { deleteProducts } from "../actions";
import { BLUR_DATA_URL } from "@/lib/constants";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  select: {
    id: true;
    name: true;
    status: true;
    images: true;
    tradePrice: true;
    promotionalPrice: true;
    createdAt: true;
    updatedAt: true;
    brand: {
      select: {
        id: true;
        name: true;
      };
    };
    primaryCategory: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

interface SwipeableProductCardProps {
  product: ProductWithRelations;
}

export default function SwipeableProductCard({
  product,
}: SwipeableProductCardProps) {
  const isOpen = useRef(false);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
  const SWIPE_DISTANCE = -100;
  const [isPending, startTransition] = useTransition();

  const [{ x }, api] = useSpring(() => ({
    x: 0,
    config: {
      tension: 200,
      friction: 20,
      mass: 0.5,
    },
  }));

  const bind = useDrag(
    ({ down, movement: [mx], direction: [dx], velocity: [vx] }) => {
      const swipeDirection = dx > 0 ? "right" : "left";
      const willOpen =
        (!isOpen.current && swipeDirection === "left") ||
        (isOpen.current && swipeDirection === "left");
      const willClose =
        (isOpen.current && swipeDirection === "right") ||
        (!isOpen.current && swipeDirection === "right");

      if (down) {
        api.start({
          x: isOpen.current ? SWIPE_DISTANCE + mx : mx,
          immediate: true,
        });
      } else {
        const shouldOpen =
          willOpen && (Math.abs(vx) > 0.5 || Math.abs(mx) > 40);
        const shouldClose =
          willClose && (Math.abs(vx) > 0.5 || Math.abs(mx) > 40);

        if (shouldOpen) {
          api.start({ x: SWIPE_DISTANCE });
          isOpen.current = true;
        } else if (shouldClose || !shouldOpen) {
          api.start({ x: 0 });
          isOpen.current = false;
        }
      }
    },
    {
      axis: "x",
      bounds: { left: SWIPE_DISTANCE, right: 0 },
      rubberband: true,
      from: () => [x.get(), 0],
    }
  );

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteAlert(true);
  };

  const handleConfirmDelete = () => {
    startTransition(async () => {
      await deleteProducts([product.id]);
      api.start({ x: 0 });
      isOpen.current = false;
      setShowDeleteAlert(false);
    });
  };

  const handleCancelDelete = () => {
    setShowDeleteAlert(false);
  };

  return (
    <>
      <div className="mb-2 relative">
        {/* Delete Button - Behind the card */}
        <div className="absolute inset-y-0 right-0 rounded-xl flex items-stretch">
          {/* <animated.div
            style={{
              opacity: x.to([SWIPE_DISTANCE, -40, 0], [1, 0.5, 0]),
            }}
            className="h-full"
          >
            <button
              onClick={handleDeleteClick}
              className="h-full w-[85px] flex flex-col items-center justify-center bg-destructive text-white transition-colors hover:bg-destructive/90 active:bg-destructive/80 rounded-xl"
            >
              <Trash2 className="w-6 h-6 mb-1" />
              <span className="text-sm font-medium">Delete</span>
            </button>
          </animated.div> */}
        </div>

        {/* Swipeable Card */}
        {/* <animated.div
          {...bind()}
          style={{
            x,
            touchAction: "pan-y",
          }}
          className="relative z-10"
        >
          <Link href={`/admin/products/${product.id}`}>
            <Card className="shadow-none bg-white">
              <div className="p-4 flex items-center gap-3">
                <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <Image
                    src={product.images[0] || PlaceholderImage}
                    alt={product.name}
                    fill
                    style={{
                      objectFit: "contain",
                    }}
                    sizes="64px"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  </div>

                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    <div
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs",
                        statusMap[product.status || "DRAFT"].className
                      )}
                    >
                      <div
                        className={cn(
                          "h-1.5 w-1.5 rounded-full mr-1",
                          statusMap[product.status || "DRAFT"].indicator
                        )}
                      />
                      {statusMap[product.status || "DRAFT"].label}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDistance(new Date(product.updatedAt), new Date(), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {[product.brand?.name, product.primaryCategory?.name]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                    <div className="text-right flex flex-col">
                      {product.promotionalPrice &&
                      product.promotionalPrice < (product.tradePrice || 0) ? (
                        <>
                          <span className="text-xs text-gray-500 line-through">
                            <NumericFormat
                              value={product.tradePrice}
                              displayType="text"
                              prefix="£"
                              decimalScale={2}
                              fixedDecimalScale
                              thousandSeparator
                            />
                          </span>
                          <span className="text-sm font-medium text-destructive">
                            <NumericFormat
                              value={product.promotionalPrice}
                              displayType="text"
                              prefix="£"
                              decimalScale={2}
                              fixedDecimalScale
                              thousandSeparator
                            />
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-medium">
                          <NumericFormat
                            value={product.tradePrice}
                            displayType="text"
                            prefix="£"
                            decimalScale={2}
                            fixedDecimalScale
                            thousandSeparator
                          />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </animated.div> */}
      </div>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="max-w-[calc(100%-2rem)] sm:max-w-[425px] rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">
              Delete Product
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to delete &quot;{product.name}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-md mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="rounded-md bg-destructive hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

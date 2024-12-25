"use server";

import { getServerAuthSession } from "@/lib/auth";
import { getCartWhereInput } from "@/lib/cart-utils";
import prisma from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session-id";
import { FulFillmentType, Prisma } from "@prisma/client";

export type CartWithItems = Prisma.CartGetPayload<{
  include: {
    cartItems: {
      include: {
        inventory: {
          include: {
            product: {
              select: {
                id: true;
                name: true;
                images: true;
                retailPrice: true;
                promotionalPrice: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export async function getCart() {
  try {
    const session = await getServerAuthSession();
    const userId = session?.user?.id;
    const sessionId = userId ? undefined : await getOrCreateSessionId();

    const cartWhereInput = getCartWhereInput(userId, sessionId);
    const cart = await prisma.cart.findFirst({
      where: cartWhereInput,
      include: {
        cartItems: {
          include: {
            inventory: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    images: true,
                    retailPrice: true,
                    promotionalPrice: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!cart) return null;

    // Calculate totals with VAT included prices
    let deliveryTotalWithVat = 0;
    let collectionTotalWithVat = 0;
    let hasDeliveryItems = false;

    cart.cartItems.forEach((item) => {
      // Use promotional price if available, otherwise use retail price
      const priceWithVat =
        item.inventory.product.promotionalPrice &&
        item.inventory.product.promotionalPrice > 0
          ? item.inventory.product.promotionalPrice
          : item.inventory.product.retailPrice || 0;

      const itemTotalWithVat = priceWithVat * (item.quantity || 0);

      if (item.type === FulFillmentType.FOR_DELIVERY) {
        deliveryTotalWithVat += itemTotalWithVat;
        hasDeliveryItems = true;
      } else {
        collectionTotalWithVat += itemTotalWithVat;
      }
    });

    // Apply delivery charge if there are delivery items
    const deliveryCharge = hasDeliveryItems ? 5 : 0;
    const deliveryVat = deliveryCharge * 0.2; // 20% VAT on delivery

    // Calculate VAT-exclusive amounts
    const deliveryTotalWithoutVat = deliveryTotalWithVat / 1.2;
    const collectionTotalWithoutVat = collectionTotalWithVat / 1.2;
    const subTotalWithVat = deliveryTotalWithVat + collectionTotalWithVat;
    const subTotalWithoutVat =
      deliveryTotalWithoutVat + collectionTotalWithoutVat;
    const vat = subTotalWithVat - subTotalWithoutVat + deliveryVat; // VAT from products only

    // Final totals including delivery and its VAT
    const totalPriceWithVat = subTotalWithVat + deliveryCharge + deliveryVat;
    const totalPriceWithoutVat = subTotalWithoutVat + deliveryCharge;

    // Update cart with all calculated values
    const updatedCart = await prisma.cart.update({
      where: { id: cart.id },
      data: {
        deliveryTotalWithVat,
        deliveryTotalWithoutVat,
        collectionTotalWithVat,
        collectionTotalWithoutVat,
        subTotalWithVat,
        subTotalWithoutVat,
        deliveryCharge,
        vat,
        totalPriceWithVat,
        totalPriceWithoutVat,
      },
      include: {
        cartItems: {
          include: {
            inventory: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    images: true,
                    retailPrice: true,
                    promotionalPrice: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return updatedCart;
  } catch (error) {
    console.error("Error getting cart:", error);
    return null;
  }
}

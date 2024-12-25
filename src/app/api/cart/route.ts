import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session-id";
import { Prisma } from "@prisma/client";

type CartItemWithRelations = Prisma.CartItemGetPayload<{
  include: {
    inventory: {
      include: {
        product: {
          include: {
            brand: {
              select: {
                name: true;
              };
            };
            retailPrice: true;
            promotionalPrice: true;
            images: true;
          };
        };
      };
    };
  };
}>;

type CartWithRelations = Prisma.CartGetPayload<{
  include: {
    cartItems: {
      include: {
        inventory: {
          include: {
            product: {
              include: {
                brand: {
                  select: {
                    name: true;
                  };
                };
                retailPrice: true;
                promotionalPrice: true;
                images: true;
              };
            };
          };
        };
      };
    };
  };
}>;

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
};

export async function GET(
  req: NextRequest
): Promise<NextResponse<ApiResponse<CartWithRelations | null>>> {
  try {
    const [session, sessionId] = await Promise.all([
      getServerAuthSession(),
      getOrCreateSessionId(),
    ]);

    const cart = await prisma.cart.findFirst({
      where: session?.user?.id ? { userId: session.user.id } : { sessionId },
      include: {
        cartItems: {
          include: {
            inventory: {
              include: {
                product: {
                  select: {
                    name: true,
                    retailPrice: true,
                    promotionalPrice: true,
                    images: true,
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

    if (cart) {
      // Calculate cart totals
      let deliveryTotalWithVat = 0;
      let collectionTotalWithVat = 0;
      let hasDeliveryItems = false;

      cart.cartItems.forEach((item) => {
        const priceWithVat =
          item.inventory.product.promotionalPrice &&
          item.inventory.product.promotionalPrice > 0
            ? item.inventory.product.promotionalPrice
            : item.inventory.product.retailPrice || 0;

        const itemTotalWithVat = priceWithVat * (item.quantity || 0);

        if (item.type === "FOR_DELIVERY") {
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
      const vat = subTotalWithVat - subTotalWithoutVat + deliveryVat;

      // Final totals including delivery and its VAT
      const totalPriceWithVat = subTotalWithVat + deliveryCharge + deliveryVat;
      const totalPriceWithoutVat = subTotalWithoutVat + deliveryCharge;

      // Update cart with new totals
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
                      name: true,
                      retailPrice: true,
                      promotionalPrice: true,
                      images: true,
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

      return NextResponse.json({
        success: true,
        data: updatedCart,
      });
    }

    return NextResponse.json({
      success: true,
      data: null,
    });
  } catch (error) {
    console.error("Cart fetch error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Database error occurred",
            code: error.code,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          message: "An unexpected error occurred",
        },
      },
      { status: 500 }
    );
  }
}

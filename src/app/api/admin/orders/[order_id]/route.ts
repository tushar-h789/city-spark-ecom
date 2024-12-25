import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = Promise<{
  order_id: string;
}>;

export async function GET(
  req: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const resolvedParams = await params;
    const orderId = resolvedParams.order_id;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required",
          data: null,
        },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            addresses: true,
          },
        },
        cart: {
          include: {
            cartItems: {
              include: {
                inventory: {
                  include: {
                    product: {
                      include: {
                        brand: true,
                        primaryCategory: true,
                        secondaryCategory: true,
                        tertiaryCategory: true,
                        quaternaryCategory: true,
                      },
                    },
                  },
                },
              },
            },
            promoCode: true,
          },
        },
        orderItems: {
          include: {
            product: {
              include: {
                brand: true,
                primaryCategory: true,
                secondaryCategory: true,
                tertiaryCategory: true,
                quaternaryCategory: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
          data: null,
        },
        { status: 404 }
      );
    }

    // Format response
    const formattedOrder = {
      ...order,
      customerName: order.user
        ? `${order.user.firstName} ${order.user.lastName}`.trim()
        : "N/A",
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      paymentDate: order.paymentDate?.toISOString(),
      shippingDate: order.shippingDate?.toISOString(),
      deliveryDate: order.deliveryDate?.toISOString(),
      refundDate: order.refundDate?.toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Order details fetched successfully",
      data: formattedOrder,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching order details",
        data: null,
      },
      { status: 500 }
    );
  }
}

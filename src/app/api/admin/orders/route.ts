import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    console.log("Received search params:", Object.fromEntries(searchParams));

    // Parse query parameters
    const search = searchParams.get("search");
    const pageNumber = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("page_size") || "10", 10);
    const sortBy = searchParams.get("sort_by") || "createdAt";
    const sortOrder = (searchParams.get("sort_order") || "desc") as
      | "asc"
      | "desc";
    const filterStatus = searchParams.get("filter_status");
    const filterPaymentStatus = searchParams.get("filter_payment_status");
    const filterShippingStatus = searchParams.get("filter_shipping_status");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    // Calculate pagination
    const skip = (pageNumber - 1) * pageSize;

    // Construct where clause
    let whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { id: { contains: search, mode: "insensitive" } },
        { user: { firstName: { contains: search, mode: "insensitive" } } },
        { user: { lastName: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (filterStatus) {
      whereClause.status = filterStatus;
    }

    if (filterPaymentStatus) {
      whereClause.paymentStatus = filterPaymentStatus;
    }

    if (filterShippingStatus) {
      whereClause.shippingStatus = filterShippingStatus;
    }

    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Fetch orders and total count in parallel
    const [orders, totalCount] = await prisma.$transaction([
      prisma.order.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
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
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          orderItems: {
            include: {
              product: {
                include: {
                  brand: true,
                },
              },
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: pageSize,
      }),
      prisma.order.count({
        where: whereClause,
      }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasMore = pageNumber * pageSize < totalCount;

    // Format response
    const response = {
      success: true,
      message: "Orders fetched successfully",
      data: {
        orders: orders.map((order) => ({
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
        })),
        pagination: {
          currentPage: pageNumber,
          pageSize,
          totalCount: totalCount,
          totalPages,
          hasMore,
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching orders:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching orders",
        data: {
          orders: [],
          pagination: {
            currentPage: 1,
            pageSize: 10,
            totalCount: 0,
            totalPages: 0,
            hasMore: false,
          },
        },
      },
      { status: 500 }
    );
  }
}

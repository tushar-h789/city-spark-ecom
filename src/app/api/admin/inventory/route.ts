import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("page_size") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const sortBy = searchParams.get("sort_by") || "createdAt";
    const sortOrder = searchParams.get("sort_order") || "desc";

    const skip = (page - 1) * limit;

    // Base where clause
    let whereClause: any = {
      OR: search
        ? [
            {
              product: { name: { contains: search, mode: "insensitive" } },
            },
          ]
        : undefined,
    };

    // Get total count and items in parallel
    const [items, total] = await prisma.$transaction([
      prisma.inventory.findMany({
        where: whereClause,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          product: true,
        },
        skip,
        take: limit,
      }),
      prisma.inventory.count({
        where: whereClause,
      }),
    ]);

    // Calculate pagination
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      message: "Inventory items fetched successfully",
      inventories: items,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalCount: total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching inventory items",
      },
      { status: 500 }
    );
  }
}

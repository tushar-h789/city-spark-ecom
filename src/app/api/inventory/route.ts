import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    // Parse query parameters
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const primaryCategoryId =
      searchParams.get("primaryCategoryId") || undefined;
    const secondaryCategoryId =
      searchParams.get("secondaryCategoryId") || undefined;
    const tertiaryCategoryId =
      searchParams.get("tertiaryCategoryId") || undefined;
    const quaternaryCategoryId =
      searchParams.get("quaternaryCategoryId") || undefined;
    const isPrimaryRequired = searchParams.get("isPrimaryRequired") === "true";
    const isSecondaryRequired =
      searchParams.get("isSecondaryRequired") === "true";
    const isTertiaryRequired =
      searchParams.get("isTertiaryRequired") === "true";
    const isQuaternaryRequired =
      searchParams.get("isQuaternaryRequired") === "true";

    const skip = (page - 1) * limit;

    // Check if any required category is missing (only if not searching)
    if (
      !search &&
      ((isPrimaryRequired && !primaryCategoryId) ||
        (isSecondaryRequired && !secondaryCategoryId) ||
        (isTertiaryRequired && !tertiaryCategoryId) ||
        (isQuaternaryRequired && !quaternaryCategoryId))
    ) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          page,
          limit,
          totalCount: 0,
          totalPages: 0,
          hasMore: false,
        },
      });
    }

    const whereClause: {
      product?: {
        AND?: any[];
        primaryCategoryId?: string;
        secondaryCategoryId?: string;
        tertiaryCategoryId?: string;
        quaternaryCategoryId?: string;
      };
    } = {};

    // Build the where clause for categories
    if (
      !search &&
      (primaryCategoryId ||
        secondaryCategoryId ||
        tertiaryCategoryId ||
        quaternaryCategoryId)
    ) {
      whereClause.product = {};
      if (primaryCategoryId)
        whereClause.product.primaryCategoryId = primaryCategoryId;
      if (secondaryCategoryId)
        whereClause.product.secondaryCategoryId = secondaryCategoryId;
      if (tertiaryCategoryId)
        whereClause.product.tertiaryCategoryId = tertiaryCategoryId;
      if (quaternaryCategoryId)
        whereClause.product.quaternaryCategoryId = quaternaryCategoryId;
    }

    // Add search condition
    if (search) {
      whereClause.product = {
        ...whereClause.product,
        AND: [
          {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { model: { contains: search, mode: "insensitive" } },
              { brand: { name: { contains: search, mode: "insensitive" } } },
            ],
          },
        ],
      };
    }

    // Check if any of the provided category IDs exist (only if not searching)
    if (
      !search &&
      (primaryCategoryId ||
        secondaryCategoryId ||
        tertiaryCategoryId ||
        quaternaryCategoryId)
    ) {
      const categoryExists = await prisma.category.findFirst({
        where: {
          OR: [
            { id: primaryCategoryId },
            { id: secondaryCategoryId },
            { id: tertiaryCategoryId },
            { id: quaternaryCategoryId },
          ].filter(Boolean),
        },
      });

      if (!categoryExists) {
        return NextResponse.json({
          success: true,
          data: [],
          pagination: {
            page,
            limit,
            totalCount: 0,
            totalPages: 0,
            hasMore: false,
          },
        });
      }
    }

    // Get items and total count
    const [items, total] = await Promise.all([
      prisma.inventory.findMany({
        where: whereClause,
        include: {
          product: {
            include: {
              primaryCategory: true,
              secondaryCategory: true,
              tertiaryCategory: true,
              quaternaryCategory: true,
              brand: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.inventory.count({ where: whereClause }),
    ]);

    // Calculate pagination
    const totalPages = Math.ceil(total / limit);
    const hasMore = page * limit < total;

    return NextResponse.json({
      success: true,
      message: "Inventory items fetched successfully",
      data: items,
      pagination: {
        page,
        limit,
        totalCount: total,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching inventory items",
        data: [],
        pagination: {
          page: 1,
          limit: 12,
          totalCount: 0,
          totalPages: 0,
          hasMore: false,
        },
      },
      { status: 500 }
    );
  }
}

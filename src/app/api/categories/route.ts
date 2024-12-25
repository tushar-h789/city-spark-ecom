import { NextRequest, NextResponse } from "next/server";
import { CategoryType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Enhanced query schema to include parent category filters
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).default(10),
  sortBy: z.enum(["name", "createdAt"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  filterType: z.nativeEnum(CategoryType).optional().nullable(),
  search: z.string().optional().nullable(),
  primaryCategoryId: z.string().optional().nullable(),
  secondaryCategoryId: z.string().optional().nullable(),
  tertiaryCategoryId: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse and validate query parameters
    const validatedParams = querySchema.parse({
      page: searchParams.get("page"),
      pageSize: searchParams.get("page_size"),
      sortBy: searchParams.get("sort_by") || undefined,
      sortOrder: searchParams.get("sort_order") || undefined,
      filterType: searchParams.get("filter_type"),
      search: searchParams.get("search"),
      primaryCategoryId: searchParams.get("primary_category_id"),
      secondaryCategoryId: searchParams.get("secondary_category_id"),
      tertiaryCategoryId: searchParams.get("tertiary_category_id"),
    });

    const {
      page,
      pageSize,
      sortBy,
      sortOrder,
      filterType,
      search,
      primaryCategoryId,
      secondaryCategoryId,
      tertiaryCategoryId,
    } = validatedParams;

    const skip = (page - 1) * pageSize;

    // Build the base where clause
    const where: {
      type?: CategoryType;
      AND?: any[];
      OR?: {
        [key: string]: any;
      }[];
    } = {};

    // Initialize AND array for combining conditions
    const andConditions = [];

    // Add type filter if provided
    if (filterType) {
      andConditions.push({ type: filterType });
    }

    // Add parent category filters if provided
    if (primaryCategoryId) {
      andConditions.push({ parentPrimaryCategoryId: primaryCategoryId });
    }

    if (secondaryCategoryId) {
      andConditions.push({ parentSecondaryCategoryId: secondaryCategoryId });
    }

    if (tertiaryCategoryId) {
      andConditions.push({ parentTertiaryCategoryId: tertiaryCategoryId });
    }

    // Add search condition if provided
    if (search) {
      andConditions.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          {
            parentPrimaryCategory: {
              name: { contains: search, mode: "insensitive" },
            },
          },
          {
            parentSecondaryCategory: {
              name: { contains: search, mode: "insensitive" },
            },
          },
          {
            parentTertiaryCategory: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        ],
      });
    }

    // Add AND conditions to where clause if there are any
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    // Execute queries in parallel
    const [categories, totalCount] = await Promise.all([
      prisma.category.findMany({
        include: {
          parentPrimaryCategory: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
          parentSecondaryCategory: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
          parentTertiaryCategory: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
          _count: {
            select: {
              primaryProducts: true,
              secondaryProducts: true,
              tertiaryProducts: true,
              quaternaryProducts: true,
              primaryChildCategories: true,
              secondaryChildCategories: true,
              tertiaryChildCategories: true,
            },
          },
        },
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: pageSize,
      }),
      prisma.category.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return NextResponse.json({
      status: "success",
      data: {
        categories,
        pagination: {
          currentPage: page,
          totalPages,
          pageSize,
          totalCount,
        },
      },
    });
  } catch (error) {
    console.error("Error in categories API:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid request parameters",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";

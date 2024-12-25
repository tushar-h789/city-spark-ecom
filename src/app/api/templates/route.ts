import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("page_size") || "10", 10);
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sort_by") || "updatedAt";
    const sortOrder = (searchParams.get("sort_order") || "desc") as
      | "asc"
      | "desc";
    const filterStatus = searchParams.get("filter_status") || undefined;

    const skip = (page - 1) * pageSize;

    // Base where clause
    const whereClause: any = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        filterStatus ? { status: filterStatus } : {},
      ],
    };

    // Get total count and items in parallel
    const [templates, total] = await prisma.$transaction([
      prisma.template.findMany({
        where: whereClause,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          fields: true,
          productTemplates: {
            include: {
              _count: {
                select: {
                  products: true,
                },
              },
            },
          },
          _count: {
            select: {
              fields: true,
              productTemplates: true,
            },
          },
        },
        skip,
        take: pageSize,
      }),
      prisma.template.count({
        where: whereClause,
      }),
    ]);

    // Transform the data to include product counts
    const transformedTemplates = templates.map((template) => {
      const totalProducts = template.productTemplates.reduce(
        (sum, pt) => sum + pt._count.products,
        0
      );

      // Remove productTemplates from the response to keep it clean
      const { productTemplates, ...rest } = template;

      return {
        ...rest,
        productCount: totalProducts,
      };
    });

    // Calculate pagination
    const totalPages = Math.ceil(total / pageSize);
    const hasMore = page * pageSize < total;

    return NextResponse.json({
      success: true,
      message: "Templates fetched successfully",
      data: transformedTemplates,
      pagination: {
        currentPage: page,
        pageSize,
        totalCount: total,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching templates",
        data: [],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalCount: 0,
          totalPages: 0,
          hasMore: false,
        },
      },
      { status: 500 }
    );
  }
}

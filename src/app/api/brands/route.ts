import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Status } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("page_size") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sort_by") || "updatedAt";
    const sortOrder = (searchParams.get("sort_order") || "desc") as
      | "asc"
      | "desc";
    const filterStatus = searchParams.get("filter_status") as Status | null;

    const skip = (page - 1) * pageSize;

    const [totalCount, brands] = await Promise.all([
      prisma.brand.count({
        where: {
          ...(search
            ? {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              }
            : {}),
          ...(filterStatus ? { status: filterStatus } : {}),
        },
      }),
      prisma.brand.findMany({
        where: {
          ...(search
            ? {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              }
            : {}),
          ...(filterStatus ? { status: filterStatus } : {}),
        },
        select: {
          id: true,
          name: true,
          image: true,
          updatedAt: true,
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: pageSize,
      }),
    ]);

    return NextResponse.json({
      data: brands,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
        totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

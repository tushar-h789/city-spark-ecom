import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const revalidate = 60;

type RouteParams = Promise<{
  category_id: string;
}>;

export async function GET(req: Request, { params }: { params: RouteParams }) {
  try {
    const resolvedParams = await params;

    if (!resolvedParams.category_id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: {
        id: resolvedParams.category_id,
      },
      include: {
        parentPrimaryCategory: true,
        parentSecondaryCategory: true,
        parentTertiaryCategory: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, must-revalidate",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching category:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "Database error occurred" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const revalidate = 60;

type RouteParams = Promise<{
  product_id: string;
}>;

export async function GET(req: Request, { params }: { params: RouteParams }) {
  try {
    const resolvedParams = await params;

    if (!resolvedParams.product_id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: resolvedParams.product_id,
      },
      include: {
        brand: true,
        primaryCategory: true,
        secondaryCategory: true,
        tertiaryCategory: true,
        quaternaryCategory: true,
        productTemplate: {
          include: {
            fields: {
              include: {
                templateField: true,
              },
              orderBy: {
                templateField: {
                  orderIndex: "asc",
                },
              },
            },
            template: true,
          },
        },
        inventory: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        data: product,
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
    console.error("Error fetching product:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "Database error occurred" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

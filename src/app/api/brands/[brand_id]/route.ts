import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteParams = Promise<{
  brand_id: string;
}>;

export async function GET(
  req: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const resolvedParams = await params;

    const brand = await prisma.brand.findUnique({
      where: {
        id: resolvedParams.brand_id,
      },
      include: {
        products: true,
      },
    });

    if (!brand) {
      return NextResponse.json(
        {
          success: false,
          message: "Brand not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Brand details fetched successfully",
      data: brand,
    });
  } catch (error) {
    console.error("Error fetching brand details:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch brand details",
      },
      { status: 500 }
    );
  }
}

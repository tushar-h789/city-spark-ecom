import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteParams = Promise<{
  template_id: string;
}>;

export async function GET(
  req: NextRequest,
  { params }: { params: RouteParams }
) {
  const routeParams = await params;
  const { template_id } = routeParams;

  if (!template_id) {
    return NextResponse.json(
      {
        success: false,
        message: "Template ID is required",
        data: null,
      },
      { status: 400 }
    );
  }

  try {
    const template = await prisma.template.findUnique({
      where: { id: template_id },
      include: {
        fields: {
          orderBy: [
            {
              orderIndex: "asc",
            },
          ],
        },
      },
    });

    console.log(template);

    if (!template) {
      return NextResponse.json(
        {
          success: false,
          message: "Template not found",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Template fetched successfully",
      data: template,
    });
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching the template",
        data: null,
      },
      { status: 500 }
    );
  }
}

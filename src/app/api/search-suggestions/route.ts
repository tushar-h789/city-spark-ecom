import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const searchSchema = z.object({
  term: z.string().trim().min(1).max(100).nullable(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const term = searchParams.get("term");

    const validatedParams = searchSchema.safeParse({ term });

    if (!validatedParams.success) {
      return NextResponse.json(
        { error: "Invalid search term" },
        { status: 400 }
      );
    }

    const { term: validTerm } = validatedParams.data;

    // If no search term, return empty results
    if (!validTerm) {
      return NextResponse.json({
        brands: [],
        categories: [],
        products: [],
      });
    }

    // Search brands
    const brands = await prisma.brand.findMany({
      where: {
        OR: [
          { name: { contains: validTerm, mode: "insensitive" } },
          { description: { contains: validTerm, mode: "insensitive" } },
          { countryOfOrigin: { contains: validTerm, mode: "insensitive" } },
        ],
      },
      select: {
        name: true,
        image: true,
        countryOfOrigin: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      take: 3,
    });

    // Search categories
    const categories = await prisma.category.findMany({
      where: {
        name: { contains: validTerm, mode: "insensitive" },
      },
      select: {
        name: true,
        image: true,
        _count: {
          select: {
            primaryProducts: true,
            secondaryProducts: true,
            tertiaryProducts: true,
            quaternaryProducts: true,
          },
        },
      },
      take: 3,
    });

    // Search products
    let where: Prisma.InventoryWhereInput = {
      product: {
        OR: [
          { name: { contains: validTerm, mode: "insensitive" } },
          { description: { contains: validTerm, mode: "insensitive" } },
          { features: { has: validTerm } },
          { model: { contains: validTerm, mode: "insensitive" } },
          { type: { contains: validTerm, mode: "insensitive" } },
          {
            brand: {
              OR: [
                { name: { contains: validTerm, mode: "insensitive" } },
                { description: { contains: validTerm, mode: "insensitive" } },
                {
                  countryOfOrigin: { contains: validTerm, mode: "insensitive" },
                },
              ],
            },
          },
          {
            primaryCategory: {
              name: { contains: validTerm, mode: "insensitive" },
            },
          },
          {
            secondaryCategory: {
              name: { contains: validTerm, mode: "insensitive" },
            },
          },
          {
            tertiaryCategory: {
              name: { contains: validTerm, mode: "insensitive" },
            },
          },
          {
            quaternaryCategory: {
              name: { contains: validTerm, mode: "insensitive" },
            },
          },
        ],
      },
    };

    const products = await prisma.inventory.findMany({
      where,
      select: {
        id: true,
        product: {
          select: {
            name: true,
            images: true,
            tradePrice: true,
            features: true,
            model: true,
            type: true,
            brand: {
              select: {
                name: true,
                image: true,
                countryOfOrigin: true,
              },
            },
            primaryCategory: { select: { name: true } },
            secondaryCategory: { select: { name: true } },
            tertiaryCategory: { select: { name: true } },
            quaternaryCategory: { select: { name: true } },
          },
        },
      },
      take: 5,
    });

    return NextResponse.json({
      brands,
      categories,
      products,
    });
  } catch (error) {
    console.error("Error in search suggestions API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

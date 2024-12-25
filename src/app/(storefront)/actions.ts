"use server";

import prisma from "@/lib/prisma";
import { getImageBlurData } from "@/lib/image-blur";
import { unstable_cache as cache } from "next/cache";

export const getInventoryItemsForStorefront = cache(
  async ({
    primaryCategoryId,
    secondaryCategoryId,
    tertiaryCategoryId,
    quaternaryCategoryId,
    isPrimaryRequired = false,
    isSecondaryRequired = false,
    isTertiaryRequired = false,
    isQuaternaryRequired = false,
    limit = 12,
    search,
  }: {
    primaryCategoryId?: string;
    secondaryCategoryId?: string;
    tertiaryCategoryId?: string;
    quaternaryCategoryId?: string;
    isPrimaryRequired?: boolean;
    isSecondaryRequired?: boolean;
    isTertiaryRequired?: boolean;
    isQuaternaryRequired?: boolean;
    limit?: number;
    search?: string;
  }) => {
    try {
      // Check if any required category is missing (only if not searching)
      if (
        !search &&
        ((isPrimaryRequired && !primaryCategoryId) ||
          (isSecondaryRequired && !secondaryCategoryId) ||
          (isTertiaryRequired && !tertiaryCategoryId) ||
          (isQuaternaryRequired && !quaternaryCategoryId))
      ) {
        return { inventoryItems: [], totalCount: 0 };
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
          return { inventoryItems: [], totalCount: 0 };
        }
      }

      const [inventoryItems, totalCount] = await Promise.all([
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
          take: limit,
        }),
        prisma.inventory.count({ where: whereClause }),
      ]);

      return {
        inventoryItems,
        totalCount,
      };
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      throw new Error("Failed to fetch inventory items");
    }
  },
  ["inventory-items"],
  {
    revalidate: 3600, // Cache for 60 seconds
    tags: ["inventory-items"],
  }
);

export const getInventoryItem = cache(
  async (inventoryItemId: string) => {
    try {
      const inventoryItem = await prisma.inventory.findUnique({
        where: { id: inventoryItemId },
        include: {
          product: {
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
                  },
                  template: true,
                },
              },
            },
          },
        },
      });

      if (!inventoryItem) {
        throw new Error("Inventory item not found");
      }

      return inventoryItem;
    } catch (error) {
      console.error("Error fetching inventory item:", error);
      throw error;
    }
  },
  ["inventory-item"],
  {
    revalidate: 3600,
    tags: ["inventory-items"],
  }
);

export const getLatestInventoryItems = cache(
  async (limit: number = 10) => {
    try {
      const inventoryItems = await prisma.inventory.findMany({
        include: {
          product: {
            include: {
              brand: true,
              primaryCategory: true,
              secondaryCategory: true,
              tertiaryCategory: true,
              quaternaryCategory: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });

      console.log(inventoryItems);

      return inventoryItems;
    } catch (error) {
      console.error("Error fetching latest inventory items:", error);
      throw new Error("Failed to fetch latest inventory items");
    }
  },
  ["latest-inventory-items"],
  {
    revalidate: 3600,
    tags: ["inventory-items"],
  }
);

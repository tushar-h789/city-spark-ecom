"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { InventoryFormInputType } from "./schema";
import { Prisma } from "@prisma/client";

export const getInventoryItems = async ({
  page = 1,
  pageSize = 10,
  sortBy = "createdAt",
  sortOrder = "desc",
  filterStatus,
  searchTerm,
}: {
  page?: number;
  pageSize?: number;
  sortBy?: "name" | "stockCount" | "soldCount" | "heldCount" | "createdAt";
  sortOrder?: "asc" | "desc";
  filterStatus?: string;
  searchTerm?: string;
}) => {
  try {
    const skip = (page - 1) * pageSize;

    let whereClause: Prisma.InventoryWhereInput = {};

    if (searchTerm) {
      whereClause = {
        OR: [
          { product: { name: { contains: searchTerm, mode: "insensitive" } } },
          {
            product: {
              description: { contains: searchTerm, mode: "insensitive" },
            },
          },
        ],
      };
    }

    if (filterStatus) {
      switch (filterStatus) {
        case "IN_STOCK":
          whereClause.stockCount = { gt: 0 };
          break;
        case "OUT_OF_STOCK":
          whereClause.stockCount = { equals: 0 };
          break;
        case "LOW_STOCK":
          whereClause.stockCount = { gt: 0, lte: 10 }; // Assuming low stock is 10 or fewer items
          break;
      }
    }

    let orderBy: any = {};

    if (sortBy === "name") {
      orderBy = {
        product: {
          name: sortOrder,
        },
      };
    } else {
      orderBy = {
        [sortBy]: sortOrder,
      };
    }

    const [inventories, totalCount] = await Promise.all([
      prisma.inventory.findMany({
        where: whereClause,
        include: {
          product: true,
        },
        orderBy: orderBy,
        skip,
        take: pageSize,
      }),
      prisma.inventory.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      inventories,
      pagination: {
        currentPage: page,
        totalCount,
        totalPages,
        pageSize,
      },
    };
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw new Error("Failed to fetch inventory");
  }
};

export const updateInventoryStock = async (
  id: string,
  newStockCount: number
) => {
  try {
    const updatedInventory = await prisma.inventory.update({
      where: { id },
      data: { stockCount: newStockCount },
    });

    revalidatePath("/", "layout");

    return updatedInventory;
  } catch (error) {
    console.error("Error updating inventory stock:", error);
    throw new Error("Failed to update inventory stock");
  }
};

export const getInventoryItemById = async (inventoryId: string) => {
  try {
    const inventory = await prisma.inventory.findUnique({
      where: {
        id: inventoryId,
      },
      include: {
        product: true,
      },
    });

    if (!inventory) {
      throw new Error("Inventory not found");
    }

    return inventory;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw new Error("Failed to fetch inventory");
  }
};

export async function updateInventoryItem(
  inventoryId: string,
  data: InventoryFormInputType
) {
  try {
    const updatedInventory = await prisma.inventory.update({
      where: { id: inventoryId },
      data: {
        productId: data.productId,
        deliveryEligibility: data.deliveryEligibility,
        collectionEligibility: data.collectionEligibility,
        maxDeliveryTime: data.maxDeliveryTime,
        maxDeliveryTimeExceedingStock: data.maxDeliveryTimeExceedingStock,

        collectionAvailabilityTime: data.collectionAvailabilityTime,
        maxCollectionTimeExceedingStock: data.maxCollectionTimeExceedingStock,
        deliveryAreas: data.deliveryAreas?.map((area) =>
          area.deliveryArea.toUpperCase()
        ),
        collectionPoints: data.collectionPoints?.map((point) =>
          point.collectionPoint.toUpperCase()
        ),

        minDeliveryCount: Number(data.minDeliveryCount),
        minCollectionCount: Number(data.minCollectionCount),
        maxDeliveryCount: Number(data.maxDeliveryCount),
        maxCollectionCount: Number(data.maxCollectionCount),
        stockCount: Number(data.stock),
        updatedAt: new Date(),
      },
    });

    revalidatePath("/", "layout");

    return {
      message: "Inventory updated successfully!",
      data: updatedInventory,
      success: true,
    };
  } catch (error) {
    console.error("Error updating inventory:", error);
    return {
      message: "An error occurred while updating the inventory.",
      success: false,
    };
  }
}

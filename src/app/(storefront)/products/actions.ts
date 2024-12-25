"use server";

import { getServerAuthSession } from "@/lib/auth";
import { getCartWhereInput } from "@/lib/cart-utils";
import prisma from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session-id";
import { CategoryType, FulFillmentType, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getCategoriesByType(
  type: CategoryType,
  primaryId?: string,
  secondaryId?: string,
  tertiaryId?: string
) {
  try {
    let categories;
    switch (type) {
      case CategoryType.PRIMARY:
        categories = await prisma.category.findMany({
          where: { type: CategoryType.PRIMARY },
          orderBy: { name: "asc" },
          include: {
            primaryChildCategories: {
              where: { type: CategoryType.SECONDARY },
              orderBy: { name: "asc" },
              include: {
                parentPrimaryCategory: true,
                secondaryChildCategories: {
                  where: { type: CategoryType.TERTIARY },
                  orderBy: { name: "asc" },
                  include: {
                    parentPrimaryCategory: true,
                    parentSecondaryCategory: true,
                    tertiaryChildCategories: {
                      where: { type: CategoryType.QUATERNARY },
                      orderBy: { name: "asc" },
                    },
                  },
                },
              },
            },
            primaryProducts: {
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        });
        break;

      case CategoryType.SECONDARY:
        categories = await prisma.category.findMany({
          where: {
            type: CategoryType.SECONDARY,
            parentPrimaryCategoryId: primaryId,
          },
          orderBy: { name: "asc" },
          include: {
            secondaryChildCategories: {
              where: { type: CategoryType.TERTIARY },
              orderBy: { name: "asc" },
            },
            parentPrimaryCategory: true,
            secondaryProducts: {
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        });
        break;

      case CategoryType.TERTIARY:
        categories = await prisma.category.findMany({
          where: {
            type: CategoryType.TERTIARY,
            parentSecondaryCategoryId: secondaryId,
            parentPrimaryCategoryId: primaryId,
          },
          orderBy: { name: "asc" },
          include: {
            tertiaryChildCategories: {
              where: { type: CategoryType.QUATERNARY },
              orderBy: { name: "asc" },
            },
            parentSecondaryCategory: true,
            parentPrimaryCategory: true,
            tertiaryProducts: {
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        });
        break;

      case CategoryType.QUATERNARY:
        categories = await prisma.category.findMany({
          where: {
            type: CategoryType.QUATERNARY,
            parentPrimaryCategoryId: primaryId,
            parentSecondaryCategoryId: secondaryId,
            parentTertiaryCategoryId: tertiaryId,
          },
          orderBy: { name: "asc" },
          include: {
            parentPrimaryCategory: true,
            parentSecondaryCategory: true,
            parentTertiaryCategory: true,
            quaternaryProducts: {
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        });
        break;

      default:
        throw new Error(`Unsupported category type: ${type}`);
    }

    return {
      categories,
      success: true,
    };
  } catch (error) {
    console.error(`Error fetching ${type} categories:`, error);
    return {
      categories: [],
      success: false,
      error: `Failed to fetch ${type} categories`,
    };
  }
}

export async function getCategoryById(categoryId: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        parentPrimaryCategory: true,
        parentSecondaryCategory: true,
        parentTertiaryCategory: true,
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
}

type FilterOption = {
  id: string;
  name: string;
  options: string[];
};

export async function getProductFilterOptions(
  primaryCategoryId?: string,
  secondaryCategoryId?: string,
  tertiaryCategoryId?: string,
  quaternaryCategoryId?: string
): Promise<FilterOption[]> {
  // Build where conditions array
  const conditions: Prisma.ProductWhereInput[] = [];

  if (primaryCategoryId) {
    conditions.push({ primaryCategoryId });
  }
  if (secondaryCategoryId) {
    conditions.push({ secondaryCategoryId });
  }
  if (tertiaryCategoryId) {
    conditions.push({ tertiaryCategoryId });
  }
  if (quaternaryCategoryId) {
    conditions.push({ quaternaryCategoryId });
  }

  // Create the where clause with properly typed AND condition
  const whereClause: Prisma.ProductWhereInput =
    conditions.length > 0 ? { AND: conditions } : {};

  // Fetch only products that match the category hierarchy
  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      productTemplate: {
        include: {
          fields: {
            include: {
              templateField: true,
            },
          },
        },
      },
    },
  });

  const filterOptions: Record<string, Set<string>> = {};

  // Only process if we have matching products
  if (products.length > 0) {
    // Process standard fields
    const standardFields = [
      "material",
      "color",
      "shape",
      "unit",
      "warranty",
      "guarantee",
    ];

    products.forEach((product) => {
      // Standard string fields
      standardFields.forEach((field) => {
        const value = product[field as keyof typeof product];
        if (typeof value === "string" && value.trim() !== "") {
          if (!filterOptions[field]) {
            filterOptions[field] = new Set();
          }
          filterOptions[field].add(value);
        }
      });

      // Numeric fields with range handling
      ["width", "height", "length", "weight", "volume"].forEach((field) => {
        const value = product[field as keyof typeof product];
        if (typeof value === "number") {
          const roundedValue = Math.round(value * 100) / 100;
          if (!filterOptions[field]) {
            filterOptions[field] = new Set();
          }
          filterOptions[field].add(roundedValue.toString());
        }
      });

      // Product template fields
      product.productTemplate?.fields.forEach((field) => {
        const fieldName = field.templateField.fieldName;
        const fieldValue = field.fieldValue;
        if (fieldValue && fieldValue.trim() !== "") {
          if (!filterOptions[fieldName]) {
            filterOptions[fieldName] = new Set();
          }
          filterOptions[fieldName].add(fieldValue);
        }
      });
    });
  }

  // Convert to array format and sort options
  const result: FilterOption[] = Object.entries(filterOptions)
    .filter(([_, options]) => options.size > 0) // Only include filters with options
    .map(([name, options]) => ({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
      options: Array.from(options).sort((a, b) => {
        // Try to sort numerically if possible
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        // Fall back to string comparison
        return a.localeCompare(b);
      }),
    }));

  return result;
}

export async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({
      take: 5,
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: { products: true },
        },
      },
    });

    return brands.map((brand) => ({
      id: brand.id,
      name: brand.name,
      count: brand._count.products,
    }));
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
}

export async function addToCart(
  inventoryId: string,
  quantity: number,
  type: FulFillmentType
) {
  try {
    const session = await getServerAuthSession();
    const userId = session?.user?.id;
    const sessionId = userId ? undefined : await getOrCreateSessionId();

    const result = await prisma.$transaction(async (prisma) => {
      // Check if the inventory item exists
      const inventoryItem = await prisma.inventory.findUnique({
        where: { id: inventoryId },
        include: { product: true },
      });

      if (!inventoryItem) {
        throw new Error("Product not found");
      }

      // Find or create a cart for the user or session
      const cartWhereInput = getCartWhereInput(userId, sessionId);
      let cart = await prisma.cart.findFirst({ where: cartWhereInput });

      if (!cart) {
        cart = await prisma.cart.create({
          data: userId ? { userId } : { sessionId: sessionId! },
        });
      }

      // Find existing cart item
      const existingCartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          inventoryId,
          type,
        },
      });

      let cartItem;
      if (existingCartItem) {
        cartItem = await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: { increment: quantity } },
        });
      } else {
        cartItem = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            inventoryId,
            quantity,
            type,
          },
        });
      }

      // Get updated cart with all items
      const updatedCart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: {
          cartItems: {
            include: {
              inventory: {
                include: { product: true },
              },
            },
          },
        },
      });

      if (!updatedCart) {
        throw new Error("Failed to retrieve updated cart");
      }

      // Calculate totals
      let deliveryTotalWithVat = 0;
      let collectionTotalWithVat = 0;
      let hasDeliveryItems = false;

      updatedCart.cartItems.forEach((item) => {
        const priceWithVat =
          item.inventory.product.promotionalPrice &&
          item.inventory.product.promotionalPrice > 0
            ? item.inventory.product.promotionalPrice
            : item.inventory.product.retailPrice || 0;

        const itemTotalWithVat = priceWithVat * (item.quantity || 0);

        if (item.type === FulFillmentType.FOR_DELIVERY) {
          deliveryTotalWithVat += itemTotalWithVat;
          hasDeliveryItems = true;
        } else {
          collectionTotalWithVat += itemTotalWithVat;
        }
      });

      // Apply delivery charge if there are delivery items
      const deliveryCharge = hasDeliveryItems ? 5 : 0;
      const deliveryVat = deliveryCharge * 0.2; // 20% VAT on delivery

      // Calculate VAT-exclusive amounts
      const deliveryTotalWithoutVat = deliveryTotalWithVat / 1.2;
      const collectionTotalWithoutVat = collectionTotalWithVat / 1.2;
      const subTotalWithVat = deliveryTotalWithVat + collectionTotalWithVat;
      const subTotalWithoutVat =
        deliveryTotalWithoutVat + collectionTotalWithoutVat;
      const vat = subTotalWithVat - subTotalWithoutVat + deliveryVat;

      // Final totals including delivery and its VAT
      const totalPriceWithVat = subTotalWithVat + deliveryCharge + deliveryVat;
      const totalPriceWithoutVat = subTotalWithoutVat + deliveryCharge;

      // Update cart with all calculated values
      const finalCart = await prisma.cart.update({
        where: { id: cart.id },
        data: {
          deliveryTotalWithVat,
          deliveryTotalWithoutVat,
          collectionTotalWithVat,
          collectionTotalWithoutVat,
          subTotalWithVat,
          subTotalWithoutVat,
          deliveryCharge,
          vat,
          totalPriceWithVat,
          totalPriceWithoutVat,
        },
        include: { cartItems: true },
      });

      return finalCart;
    });

    // Revalidate relevant paths
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/basket");
    revalidatePath("/checkout");

    return {
      message: "Item added to cart successfully!",
      data: result,
      success: true,
    };
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return {
      message:
        error instanceof Error ? error.message : "Failed to add item to cart",
      error: error instanceof Error ? error.message : String(error),
      success: false,
    };
  }
}

export async function removeFromCart(id: string) {
  try {
    const session = await getServerAuthSession();
    const userId = session?.user?.id;
    const sessionId = userId ? undefined : await getOrCreateSessionId();

    if (!id) {
      throw new Error("Invalid input");
    }

    const result = await prisma.$transaction(async (prisma) => {
      // Delete the cart item
      await prisma.cartItem.delete({
        where: { id },
      });

      // Recalculate total price
      const cartWhereInput = getCartWhereInput(userId, sessionId);
      const updatedCart = await prisma.cart.findFirst({
        where: cartWhereInput,
        include: {
          cartItems: {
            include: {
              inventory: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });

      if (!updatedCart) {
        throw new Error("Cart not found");
      }

      // Calculate totals
      let deliveryTotalWithVat = 0;
      let collectionTotalWithVat = 0;
      let hasDeliveryItems = false;

      updatedCart.cartItems.forEach((item) => {
        const priceWithVat =
          item.inventory.product.promotionalPrice &&
          item.inventory.product.promotionalPrice > 0
            ? item.inventory.product.promotionalPrice
            : item.inventory.product.retailPrice || 0;

        const itemTotalWithVat = priceWithVat * (item.quantity || 0);

        if (item.type === FulFillmentType.FOR_DELIVERY) {
          deliveryTotalWithVat += itemTotalWithVat;
          hasDeliveryItems = true;
        } else {
          collectionTotalWithVat += itemTotalWithVat;
        }
      });

      // Apply delivery charge if there are delivery items
      const deliveryCharge = hasDeliveryItems ? 5 : 0;
      const deliveryVat = deliveryCharge * 0.2; // 20% VAT on delivery

      // Calculate VAT-exclusive amounts
      const deliveryTotalWithoutVat = deliveryTotalWithVat / 1.2;
      const collectionTotalWithoutVat = collectionTotalWithVat / 1.2;
      const subTotalWithVat = deliveryTotalWithVat + collectionTotalWithVat;
      const subTotalWithoutVat =
        deliveryTotalWithoutVat + collectionTotalWithoutVat;
      const vat = subTotalWithVat - subTotalWithoutVat + deliveryVat;

      // Final totals including delivery and its VAT
      const totalPriceWithVat = subTotalWithVat + deliveryCharge + deliveryVat;
      const totalPriceWithoutVat = subTotalWithoutVat + deliveryCharge;

      // Update cart with all calculated values
      const finalCart = await prisma.cart.update({
        where: { id: updatedCart.id },
        data: {
          deliveryTotalWithVat,
          deliveryTotalWithoutVat,
          collectionTotalWithVat,
          collectionTotalWithoutVat,
          subTotalWithVat,
          subTotalWithoutVat,
          deliveryCharge,
          vat,
          totalPriceWithVat,
          totalPriceWithoutVat,
        },
        include: { cartItems: true },
      });

      return finalCart;
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/basket");
    revalidatePath("/checkout");

    return {
      message: "Item removed from cart successfully!",
      data: result,
      success: true,
    };
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return {
      message:
        error instanceof Error
          ? error.message
          : "Failed to remove item from cart",
      error: error instanceof Error ? error.message : String(error),
      success: false,
    };
  }
}

export async function updateCartItemQuantity(id: string, quantity: number) {
  try {
    const session = await getServerAuthSession();
    const userId = session?.user?.id;
    const sessionId = userId ? undefined : await getOrCreateSessionId();

    if (!id || isNaN(quantity)) {
      throw new Error("Invalid input");
    }

    const result = await prisma.$transaction(async (prisma) => {
      // Update the cart item quantity
      await prisma.cartItem.update({
        where: { id: id },
        data: { quantity: quantity },
      });

      // Get updated cart to recalculate
      const cartWhereInput = getCartWhereInput(userId, sessionId);
      const updatedCart = await prisma.cart.findFirst({
        where: cartWhereInput,
        include: {
          cartItems: {
            include: {
              inventory: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });

      if (!updatedCart) {
        throw new Error("Cart not found");
      }

      // Calculate totals
      let deliveryTotalWithVat = 0;
      let collectionTotalWithVat = 0;
      let hasDeliveryItems = false;

      updatedCart.cartItems.forEach((item) => {
        const priceWithVat =
          item.inventory.product.promotionalPrice &&
          item.inventory.product.promotionalPrice > 0
            ? item.inventory.product.promotionalPrice
            : item.inventory.product.retailPrice || 0;

        const itemTotalWithVat = priceWithVat * (item.quantity || 0);

        if (item.type === FulFillmentType.FOR_DELIVERY) {
          deliveryTotalWithVat += itemTotalWithVat;
          hasDeliveryItems = true;
        } else {
          collectionTotalWithVat += itemTotalWithVat;
        }
      });

      // Apply delivery charge if there are delivery items
      const deliveryCharge = hasDeliveryItems ? 5 : 0;
      const deliveryVat = deliveryCharge * 0.2; // 20% VAT on delivery

      // Calculate VAT-exclusive amounts
      const deliveryTotalWithoutVat = deliveryTotalWithVat / 1.2;
      const collectionTotalWithoutVat = collectionTotalWithVat / 1.2;
      const subTotalWithVat = deliveryTotalWithVat + collectionTotalWithVat;
      const subTotalWithoutVat =
        deliveryTotalWithoutVat + collectionTotalWithoutVat;
      const vat = subTotalWithVat - subTotalWithoutVat + deliveryVat;

      // Final totals including delivery and its VAT
      const totalPriceWithVat = subTotalWithVat + deliveryCharge + deliveryVat;
      const totalPriceWithoutVat = subTotalWithoutVat + deliveryCharge;

      // Update cart with all calculated values
      const finalCart = await prisma.cart.update({
        where: { id: updatedCart.id },
        data: {
          deliveryTotalWithVat,
          deliveryTotalWithoutVat,
          collectionTotalWithVat,
          collectionTotalWithoutVat,
          subTotalWithVat,
          subTotalWithoutVat,
          deliveryCharge,
          vat,
          totalPriceWithVat,
          totalPriceWithoutVat,
        },
        include: { cartItems: true },
      });

      return finalCart;
    });

    // Revalidate relevant paths
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/basket");
    revalidatePath("/checkout");

    return {
      message: "Cart item quantity updated successfully!",
      data: result,
      success: true,
    };
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return {
      message:
        error instanceof Error
          ? error.message
          : "Failed to update cart item quantity",
      error: error instanceof Error ? error.message : String(error),
      success: false,
    };
  }
}

export async function searchProducts(searchTerm: string) {
  try {
    const products = await prisma.inventory.findMany({
      where: {
        product: {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
      },
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
    });

    return products;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
}

type BrandInfo = {
  id: string;
  name: string;
  image: string | null;
};

export type BrandsByCategory = {
  [categoryName: string]: BrandInfo[];
};

export async function getTopBrands(): Promise<BrandsByCategory> {
  try {
    // First get all primary categories
    const primaryCategories = await prisma.category.findMany({
      where: {
        type: "PRIMARY",
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Create a map to store results
    const brandsByCategory: BrandsByCategory = {};

    // For each primary category, get top 10 brands
    await Promise.all(
      primaryCategories.map(async (category) => {
        const brands = await prisma.brand.findMany({
          where: {
            status: "ACTIVE",
            products: {
              some: {
                primaryCategoryId: category.id,
              },
            },
          },
          select: {
            id: true,
            name: true,
            image: true,
            _count: {
              select: {
                products: {
                  where: {
                    primaryCategoryId: category.id,
                  },
                },
              },
            },
          },
          orderBy: {
            products: {
              _count: "desc",
            },
          },
          take: 10,
        });

        if (brands.length > 0) {
          // Only add categories that have brands
          brandsByCategory[category.name.toLowerCase()] = brands.map(
            (brand) => ({
              id: brand.id,
              name: brand.name,
              image: brand.image,
            })
          );
        }
      })
    );

    return brandsByCategory;
  } catch (error) {
    console.error("Error fetching top brands:", error);
    return {};
  }
}

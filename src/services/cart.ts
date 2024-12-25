// src/services/cart.ts

import axios from "axios";
import { Prisma } from "@prisma/client";

// Define the cart item relations type
export type CartItemWithRelations = Prisma.CartItemGetPayload<{
  include: {
    inventory: {
      include: {
        product: {
          select: {
            name: true;
            retailPrice: true;
            promotionalPrice: true;
          };
        };
      };
    };
  };
}>;

// Define the cart with relations type
export type CartWithRelations = Prisma.CartGetPayload<{
  include: {
    cartItems: {
      include: {
        inventory: {
          include: {
            product: {
              select: {
                name: true;
                retailPrice: true;
                promotionalPrice: true;
                images: true;
              };
            };
          };
        };
      };
    };
  };
}>;

// Define the API response type
export type CartApiResponse = {
  success: boolean;
  data?: CartWithRelations | null;
  error?: {
    message: string;
    code?: string;
  };
};

/**
 * Fetches cart data from the API
 * @returns Promise containing cart data with its relations
 * @throws Error if the API request fails
 */
export const fetchCart = async (): Promise<CartWithRelations | null> => {
  const { data } = await axios.get<CartApiResponse>("/api/cart");
  if (!data.success) {
    throw new Error(data.error?.message || "Failed to fetch cart");
  }
  return data.data || null;
};

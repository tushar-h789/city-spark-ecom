import { z } from "zod";

export const inventorySchema = z.object({
  stock: z.string().min(1, "Stock value is required"),
  deliveryEligibility: z.boolean().default(false),
  collectionEligibility: z.boolean().default(false),
  maxDeliveryTime: z.string().optional(),
  maxDeliveryTimeExceedingStock: z.string().optional(),
  collectionAvailabilityTime: z.string().optional(),
  maxCollectionTimeExceedingStock: z.string().optional(),
  deliveryAreas: z
    .array(
      z.object({
        deliveryArea: z.string(),
      })
    )
    .optional(),
  collectionPoints: z
    .array(
      z.object({
        collectionPoint: z.string(),
      })
    )
    .optional(),
  minDeliveryCount: z.string().optional(),
  minCollectionCount: z.string().optional(),
  maxDeliveryCount: z.string().optional(),
  maxCollectionCount: z.string().optional(),
  productId: z.string().min(1, "Select product is required"),
});

// Export the TypeScript type for the schema
export type InventoryFormInputType = z.infer<typeof inventorySchema>;

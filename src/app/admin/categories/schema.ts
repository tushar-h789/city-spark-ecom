"use client";

import { z } from "zod";
import { CategoryType } from "@prisma/client";

export const categorySchema = z
  .object({
    name: z
      .string({
        required_error: "Category name is required.",
        invalid_type_error: "Category name must be a string.",
      })
      .trim()
      .min(1, "Category name is required and must be unique"),

    image: z.string().optional(),

    type: z.nativeEnum(CategoryType, {
      required_error: "Category type is required.",
      invalid_type_error: "Invalid category type selected.",
    }),

    parentPrimaryCategory: z
      .string({
        invalid_type_error: "Primary category must be a string.",
      })
      .trim()
      .optional(),

    parentSecondaryCategory: z
      .string({
        invalid_type_error: "Secondary category must be a string.",
      })
      .trim()
      .optional(),

    parentTertiaryCategory: z
      .string({
        invalid_type_error: "Tertiary category must be a string.",
      })
      .trim()
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Add validation based on category type
    if (data.type === "SECONDARY") {
      if (!data.parentPrimaryCategory) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Primary category is required for secondary categories",
          path: ["parentPrimaryCategory"],
        });
      }
    }

    if (data.type === "TERTIARY") {
      if (!data.parentPrimaryCategory || !data.parentSecondaryCategory) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Primary and secondary categories are required for tertiary categories",
          path: !data.parentPrimaryCategory
            ? ["parentPrimaryCategory"]
            : ["parentSecondaryCategory"],
        });
      }
    }

    if (data.type === "QUATERNARY") {
      if (
        !data.parentPrimaryCategory ||
        !data.parentSecondaryCategory ||
        !data.parentTertiaryCategory
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Primary, secondary and tertiary categories are required for quaternary categories",
          path: !data.parentPrimaryCategory
            ? ["parentPrimaryCategory"]
            : !data.parentSecondaryCategory
            ? ["parentSecondaryCategory"]
            : ["parentTertiaryCategory"],
        });
      }
    }
  });

export type CategoryFormInputType = z.infer<typeof categorySchema>;

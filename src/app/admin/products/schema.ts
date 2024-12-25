import { z } from "zod";

// Product schema with detailed error messages and trimmed text fields

export const createProductSchema = (
  secondaryCategories?: any[],
  tertiaryCategories?: any[],
  quaternaryCategories?: any[]
) => {
  return z.object({
    name: z
      .string({
        required_error: "Product name is required.",
        invalid_type_error: "Product name must be a string.",
      })
      .trim()
      .min(1, "Product name is required and can't be left blank."),

    description: z
      .string({
        required_error: "Product description is required.",
        invalid_type_error: "Product description must be a string.",
      })
      .trim()
      .min(1, "Product description is required and can't be left blank."),
    brand: z.string().trim().optional(),
    manufacturerLink: z.string().trim().optional(),
    model: z.string().trim().optional(),
    type: z.string().trim().optional(),
    productCode: z.string().trim().optional(),
    warranty: z.string().trim().optional(),
    guarantee: z.string().trim().optional(),
    tradePrice: z.string().optional(),
    retailPrice: z.string().optional(),
    contractPrice: z.string().optional(),
    promotionalPrice: z.string().optional(),
    unit: z.string().trim().optional(),
    weight: z.string().optional(),
    color: z.string().trim().optional(),
    length: z.string().optional(),
    width: z.string().optional(),
    height: z.string().optional(),
    material: z.string().trim().optional(),

    productTemplateId: z
      .string({
        invalid_type_error: "Template must be a string.",
      })
      .trim()
      .optional(),

    templateId: z
      .string({
        invalid_type_error: "Template must be a string.",
      })
      .trim()
      .optional(),

    productTemplateFields: z
      .array(
        z
          .object({
            id: z.string().trim().optional(),
            fieldId: z.string().trim().optional(),
            fieldName: z.string().trim().optional(),
            fieldType: z
              .enum(["TEXT", "SELECT"], {
                invalid_type_error:
                  "Field type must be either 'TEXT' or 'SELECT'.",
              })
              .optional(),
            fieldOptions: z.string().trim().optional(),
            fieldValue: z.string().trim().optional(),
          })
          .optional()
      )
      .optional()
      .default([]), // Provide a default empty array

    shape: z.string().trim().optional(),
    volume: z.string().trim().optional(),
    features: z
      .array(
        z.object({
          feature: z
            .string({
              invalid_type_error: "Feature must be a string.",
            })
            .trim(),
        })
      )
      .optional(),
    status: z
      .enum(["DRAFT", "ACTIVE", "ARCHIVED"], {
        invalid_type_error:
          "Status must be one of 'DRAFT', 'ACTIVE', or 'ARCHIVED'.",
      })
      .optional(),
    images: z
      .array(
        z.object({
          image: z.string().trim(),
        })
      )
      .optional(),
    manuals: z
      .array(z.string().trim(), {
        invalid_type_error: "Manuals must be an array of strings.",
      })
      .optional(),

    primaryCategoryId: z
      .string({
        required_error: "Primary category is required.",
        invalid_type_error: "Primary category must be a string.",
      })
      .trim()
      .min(1, "Primary category is required"),

    secondaryCategoryId:
      secondaryCategories && secondaryCategories.length > 0
        ? z.string().trim().min(1, "Secondary category is required")
        : z.string().trim().optional(),
    tertiaryCategoryId:
      tertiaryCategories && tertiaryCategories.length > 0
        ? z.string().trim().min(1, "Tertiary category is required")
        : z.string().trim().optional(),
    quaternaryCategoryId:
      quaternaryCategories && quaternaryCategories.length > 0
        ? z.string().trim().min(1, "Quaternary category is required")
        : z.string().trim().optional(),
  });
};

export type ProductFormInputType = z.infer<
  ReturnType<typeof createProductSchema>
>;

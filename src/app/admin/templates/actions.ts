"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TemplateFormInputType } from "./schema";
import { FieldType, Prisma } from "@prisma/client";

export async function createTemplate(data: TemplateFormInputType) {
  try {
    const createTemplate = await prisma.template.create({
      data: {
        name: data.name,
        description: data.description,
        status: data.status,
        fields: {
          create: data.fields.map((item) => ({
            fieldName: item.fieldName,
            fieldType: item.fieldType,
            fieldOptions: item.fieldOptions,
            orderIndex: item.orderIndex,
          })),
        },
      },
    });

    revalidatePath("/admin", "layout");

    return {
      message: "Template created successfully!",
      data: createTemplate,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "An error occurred while creating the template.",
      success: false,
    };
  }
}

export async function deleteTemplates(templateIds: string[]) {
  if (!templateIds?.length) {
    return {
      message: "At least one template ID is required",
      success: false,
    };
  }

  try {
    // First check for any templates with associated product templates
    const templatesWithProducts = await prisma.template.findMany({
      where: {
        id: {
          in: templateIds,
        },
        productTemplates: {
          some: {
            products: {
              some: {},
            },
          },
        },
      },
      include: {
        productTemplates: {
          include: {
            products: true,
          },
        },
      },
    });

    // If any templates have associated products, return an error
    if (templatesWithProducts.length > 0) {
      const templateNames = templatesWithProducts
        .map((t) => `"${t.name}"`)
        .join(", ");
      return {
        message: `Cannot delete ${
          templatesWithProducts.length > 1 ? "templates" : "template"
        } ${templateNames} because ${
          templatesWithProducts.length > 1 ? "they are" : "it is"
        } being used by one or more products. Please remove the product associations first.`,
        success: false,
      };
    }

    // If no associations exist, proceed with deletion
    await prisma.template.deleteMany({
      where: {
        id: {
          in: templateIds,
        },
      },
    });

    revalidatePath("/admin", "layout");

    return {
      message:
        templateIds.length === 1
          ? "Template deleted successfully!"
          : `${templateIds.length} templates deleted successfully!`,
      success: true,
    };
  } catch (error) {
    console.error("Error deleting templates:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return {
        message:
          "Cannot delete templates that have associated products. Please remove all product associations first.",
        success: false,
      };
    }

    return {
      message: "An error occurred while deleting the template(s).",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

type FieldToUpdate = {
  fieldId: string;
  fieldName: string;
  fieldType: FieldType;
  fieldOptions: string | null;
  orderIndex: number;
};

type FieldToCreate = {
  fieldName: string;
  fieldType: FieldType;
  fieldOptions: string | null;
  orderIndex: number;
};

export async function updateTemplate(
  templateId: string,
  data: TemplateFormInputType
) {
  try {
    console.log("Starting template update for templateId:", templateId);
    console.log("Update data received:", data);

    const existingTemplate = await prisma.template.findUnique({
      where: { id: templateId },
      include: {
        fields: true,
        productTemplates: {
          include: {
            fields: true,
          },
        },
      },
    });

    if (!existingTemplate) {
      console.log("Template not found:", templateId);
      throw new Error("Template not found");
    }

    console.log("Existing template found:", {
      id: existingTemplate.id,
      name: existingTemplate.name,
      fieldCount: existingTemplate.fields.length,
      productTemplateCount: existingTemplate.productTemplates.length,
    });

    const fieldsToUpdate: FieldToUpdate[] = [];
    const fieldsToCreate: FieldToCreate[] = [];
    const fieldIdsToKeep = new Set<string>();

    // Log incoming field data
    console.log("Processing fields from form data:", data.fields);

    // Process fields with order index
    data.fields.forEach((field, index) => {
      if (field.fieldId) {
        console.log("Field to update:", field);
        fieldsToUpdate.push({
          fieldId: field.fieldId,
          fieldName: field.fieldName,
          fieldType: field.fieldType,
          fieldOptions: field.fieldOptions ?? "",
          orderIndex: index, // Add order index
        });
        fieldIdsToKeep.add(field.fieldId);
      } else {
        console.log("New field to create:", field);
        fieldsToCreate.push({
          fieldName: field.fieldName,
          fieldType: field.fieldType,
          fieldOptions: field.fieldOptions ?? "",
          orderIndex: index, // Add order index
        });
      }
    });

    const fieldIdsToDelete = existingTemplate.fields
      .filter((field) => !fieldIdsToKeep.has(field.id))
      .map((field) => field.id);

    console.log("Fields analysis:", {
      toUpdate: fieldsToUpdate.length,
      toCreate: fieldsToCreate.length,
      toDelete: fieldIdsToDelete.length,
      idsToDelete: fieldIdsToDelete,
    });

    const result = await prisma.$transaction(async (tx) => {
      console.log("Starting database transaction");

      // 1. Update template
      console.log("Updating main template...");
      const updatedTemplate = await tx.template.update({
        where: { id: templateId },
        data: {
          name: data.name,
          description: data.description,
          status: data.status,
          fields: {
            update: fieldsToUpdate.map((field) => ({
              where: { id: field.fieldId },
              data: {
                fieldName: field.fieldName,
                fieldType: field.fieldType,
                fieldOptions: field.fieldOptions,
                orderIndex: field.orderIndex, // Include order index in update
              },
            })),
            create: fieldsToCreate.map((field) => ({
              ...field,
              orderIndex: field.orderIndex, // Include order index in create
            })),
            deleteMany: { id: { in: fieldIdsToDelete } },
          },
        },
        include: {
          fields: {
            orderBy: {
              orderIndex: "asc", // Order fields by index when returning
            },
          },
        },
      });

      console.log("Template updated successfully:", {
        id: updatedTemplate.id,
        updatedFieldCount: updatedTemplate.fields.length,
      });

      // 2. Update ProductTemplates
      console.log("Starting product templates update...");
      for (const productTemplate of existingTemplate.productTemplates) {
        console.log("Processing product template:", productTemplate.id);

        // Handle deletions
        if (fieldIdsToDelete.length > 0) {
          console.log(
            "Deleting fields from product template:",
            fieldIdsToDelete
          );
          await tx.productTemplateField.deleteMany({
            where: {
              productTemplateId: productTemplate.id,
              templateFieldId: { in: fieldIdsToDelete },
            },
          });
        }

        // Handle updates
        for (const field of fieldsToUpdate) {
          console.log("Updating field in product template:", field);
          await tx.productTemplateField.updateMany({
            where: {
              productTemplateId: productTemplate.id,
              templateFieldId: field.fieldId,
            },
            data: {
              templateFieldId: field.fieldId,
            },
          });
        }

        // Handle new fields
        if (fieldsToCreate.length > 0) {
          console.log("Creating new fields in product template");
          const newTemplateFields = await tx.templateField.findMany({
            where: {
              templateId,
              fieldName: { in: fieldsToCreate.map((f) => f.fieldName) },
            },
            orderBy: {
              orderIndex: "asc", // Maintain order when finding new fields
            },
          });

          console.log("New template fields found:", newTemplateFields.length);

          await tx.productTemplateField.createMany({
            data: newTemplateFields.map((templateField) => ({
              productTemplateId: productTemplate.id,
              templateFieldId: templateField.id,
              fieldValue: null,
            })),
          });
        }
      }

      return updatedTemplate;
    });

    console.log("Transaction completed successfully");
    revalidatePath("/", "layout");

    return {
      message:
        "Template and associated product templates updated successfully!",
      data: result,
      success: true,
    };
  } catch (error) {
    console.error("Detailed error in updateTemplate:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error details:", {
        code: error.code,
        meta: error.meta,
        message: error.message,
      });

      if (error.code === "P2002") {
        return {
          message: "A template with this name already exists.",
          success: false,
        };
      }
    }

    return {
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while updating the template.",
      success: false,
    };
  }
}

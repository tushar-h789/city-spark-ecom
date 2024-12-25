"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CategoryFormInputType } from "./schema";
import { backendClient } from "@/lib/edgestore-server";

// Create a new category
export async function createCategory(data: CategoryFormInputType) {
  try {
    const result = await prisma.$transaction(
      async (tx) => {
        // First, create the category
        const createdCategory = await tx.category.create({
          data: {
            name: data.name,
            type: data.type,
            parentPrimaryCategoryId: data.parentPrimaryCategory || null,
            parentSecondaryCategoryId: data.parentSecondaryCategory || null,
            parentTertiaryCategoryId: data.parentTertiaryCategory || null,
            image: data.image,
          },
        });

        // If there's an image, confirm the upload
        if (createdCategory.image) {
          try {
            await backendClient.publicImages.confirmUpload({
              url: createdCategory.image,
            });
          } catch (error) {
            console.error(
              `Failed to confirm upload for ${createdCategory.image}:`,
              error
            );
            // Explicitly throw an error to trigger transaction rollback
            throw new Error(`Failed to upload ${createdCategory.image}`);
          }
        }

        return createdCategory;
      },
      {
        maxWait: 5000, // 5 seconds
        timeout: 10000, // 10 seconds
      }
    );

    revalidatePath("/", "layout");

    return {
      message: "Category created successfully!",
      data: result,
      success: true,
    };
  } catch (error) {
    console.error("Error in createCategory:", error);
    return {
      message:
        "An error occurred while creating the category. Please try again later.",
      success: false,
    };
  }
}

// Update a category
export async function updateCategory(
  categoryId: string,
  data: CategoryFormInputType
) {
  try {
    const result = await prisma.$transaction(
      async (tx) => {
        // First, fetch the existing category
        const existingCategory = await tx.category.findUnique({
          where: { id: categoryId },
        });

        if (!existingCategory) {
          throw new Error("Category not found");
        }

        // Update the category
        const updatedCategory = await tx.category.update({
          where: { id: categoryId },
          data: {
            name: data.name,
            type: data.type,
            parentPrimaryCategoryId: data.parentPrimaryCategory || null,
            parentSecondaryCategoryId: data.parentSecondaryCategory || null,
            parentTertiaryCategoryId: data.parentTertiaryCategory || null,
            image: data.image,
          },
        });

        // Handle image updates
        if (data.image && data.image !== existingCategory.image) {
          // Confirm the new image upload
          try {
            await backendClient.publicImages.confirmUpload({
              url: data.image,
            });
          } catch (error) {
            console.error(`Failed to confirm upload for ${data.image}:`, error);
            throw new Error(`Failed to upload ${data.image}`);
          }

          // Delete the old image if it exists
          if (existingCategory.image) {
            try {
              await backendClient.publicImages.deleteFile({
                url: existingCategory.image,
              });
            } catch (error) {
              console.error(
                `Failed to delete old image ${existingCategory.image}:`,
                error
              );
              // We don't throw here as the update was successful, but log the error
            }
          }
        }

        return updatedCategory;
      },
      {
        maxWait: 5000, // 5 seconds
        timeout: 10000, // 10 seconds
      }
    );

    revalidatePath("/", "layout");

    return {
      message: "Category updated successfully!",
      data: result,
      success: true,
    };
  } catch (error) {
    console.error("Error in updateCategory:", error);
    return {
      message:
        "An error occurred while updating the category. Please try again later.",
      success: false,
    };
  }
}

export async function deleteCategory(categoryId: string) {
  if (!categoryId) {
    return {
      message: "Category ID is required",
      success: false,
    };
  }

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        // First, fetch the category to get the image URL
        const category = await tx.category.findUnique({
          where: { id: categoryId },
        });

        if (!category) {
          throw new Error("Category not found");
        }

        // Delete the category
        const deletedCategory = await tx.category.delete({
          where: { id: categoryId },
        });

        // If there's an associated image, delete it
        if (deletedCategory.image) {
          try {
            await backendClient.publicImages.deleteFile({
              url: deletedCategory.image,
            });
          } catch (error) {
            console.error(
              `Failed to delete image ${deletedCategory.image}:`,
              error
            );
            throw new Error(
              `Failed to delete image for category ${categoryId}`
            );
          }
        }

        return deletedCategory;
      },
      {
        maxWait: 5000, // 5 seconds
        timeout: 10000, // 10 seconds
      }
    );

    revalidatePath("/admin", "layout");

    return {
      message: "Category deleted successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    return {
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while deleting the category. Please try again later.",
      success: false,
    };
  }
}

"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { BrandFormInputType } from "./schema";
import { backendClient } from "@/lib/edgestore-server";
import { Prisma } from "@prisma/client";

export async function createBrand(data: BrandFormInputType) {
  try {
    const result = await prisma.$transaction(
      async (tx) => {
        let confirmedImageUrl = null;

        // Handle image upload confirmation
        if (data.image) {
          try {
            const result = await backendClient.publicImages.confirmUpload({
              url: data.image,
            });
            if (result.success) {
              confirmedImageUrl = data.image;
            } else {
              throw new Error(`Failed to confirm upload for ${data.image}`);
            }
          } catch (error) {
            console.error(`Failed to confirm upload for ${data.image}:`, error);
            throw new Error(`Failed to upload brand image`);
          }
        }

        // Create the brand
        const createdBrand = await tx.brand.create({
          data: {
            name: data.brandName,
            website: data.website,
            description: data.description,
            image: confirmedImageUrl,
            countryOfOrigin: data.countryOfOrigin,
            status: data.status,
          },
        });

        return createdBrand;
      },
      {
        maxWait: 5000, // 5 seconds
        timeout: 10000, // 10 seconds
      }
    );

    revalidatePath("/admin", "layout");

    return {
      message: "Brand created successfully!",
      data: result,
      success: true,
    };
  } catch (error) {
    console.error("Error in createBrand:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message:
            "A brand with this name already exists. Please use a unique brand name.",
          success: false,
          error: "DUPLICATE_BRAND",
        };
      }
    }

    return {
      message:
        "An unexpected error occurred while creating the brand. Please try again later.",
      success: false,
      error: "UNKNOWN_ERROR",
    };
  }
}

export async function deleteBrand(brandId: string) {
  if (!brandId) {
    return {
      message: "Brand ID is required",
      success: false,
    };
  }

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const brandToDelete = await tx.brand.findUnique({
          where: { id: brandId },
        });

        if (!brandToDelete) {
          throw new Error("Brand not found");
        }

        // Delete the brand image if it exists
        if (brandToDelete.image) {
          try {
            await backendClient.publicImages.deleteFile({
              url: brandToDelete.image,
            });
          } catch (error) {
            console.error(`Failed to delete brand image:`, error);
            // Continue with brand deletion even if image deletion fails
          }
        }

        // Delete the brand
        const deletedBrand = await tx.brand.delete({
          where: { id: brandId },
        });

        return deletedBrand;
      },
      {
        maxWait: 5000, // 5 seconds
        timeout: 10000, // 10 seconds
      }
    );

    revalidatePath("/admin", "layout");

    return {
      message: "Brand deleted successfully!",
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error deleting brand:", error);
    return {
      message: "An error occurred while deleting the Brand.",
      success: false,
    };
  }
}

export async function updateBrand(brandId: string, data: BrandFormInputType) {
  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const existingBrand = await tx.brand.findUnique({
          where: { id: brandId },
        });

        if (!existingBrand) {
          throw new Error("Brand not found");
        }

        let confirmedImageUrl = existingBrand.image;

        // Handle image changes
        if (data.image !== existingBrand.image) {
          // Delete old image if it exists
          if (existingBrand.image) {
            try {
              await backendClient.publicImages.deleteFile({
                url: existingBrand.image,
              });
            } catch (error) {
              console.error(`Failed to delete old image:`, error);
            }
          }

          // Confirm new image upload
          if (data.image) {
            try {
              const result = await backendClient.publicImages.confirmUpload({
                url: data.image,
              });
              if (result.success) {
                confirmedImageUrl = data.image;
              } else {
                throw new Error(`Failed to confirm upload for ${data.image}`);
              }
            } catch (error) {
              console.error(
                `Failed to confirm upload for ${data.image}:`,
                error
              );
              throw new Error(`Failed to upload brand image`);
            }
          } else {
            confirmedImageUrl = null;
          }
        }

        // Update the brand
        const updatedBrand = await tx.brand.update({
          where: { id: brandId },
          data: {
            name: data.brandName,
            description: data.description,
            image: confirmedImageUrl,
            status: data.status,
            website: data.website,
            countryOfOrigin: data.countryOfOrigin,
          },
        });

        return updatedBrand;
      },
      {
        maxWait: 5000, // 5 seconds
        timeout: 10000, // 10 seconds
      }
    );

    revalidatePath("/admin", "layout");

    return {
      message: "Brand Updated Successfully!",
      data: result,
      success: true,
    };
  } catch (error) {
    console.error("Error updating brand:", error);
    return {
      message: "An error occurred while updating the brand.",
      success: false,
    };
  }
}

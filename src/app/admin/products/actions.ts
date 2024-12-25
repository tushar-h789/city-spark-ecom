"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProductFormInputType } from "./schema";
import { backendClient } from "@/lib/edgestore-server";
import exceljs from "exceljs";
import dayjs from "dayjs";

export async function createProduct(data: ProductFormInputType) {
  try {
    const result = await prisma.$transaction(
      async (tx) => {
        let createdProductTemplate;

        if (data.templateId) {
          // First fetch all template fields for the selected template
          const templateFields = await tx.templateField.findMany({
            where: {
              templateId: data.templateId,
            },
          });

          // Create a map of provided field values
          const fieldValuesMap = new Map(
            data.productTemplateFields
              ?.filter(
                (field): field is NonNullable<typeof field> =>
                  field !== undefined && field.fieldId !== undefined
              )
              .map((field) => [field.fieldId, field.fieldValue || ""])
          );

          // Create product template fields for all template fields, including empty ones
          createdProductTemplate = await tx.productTemplate.create({
            data: {
              templateId: data.templateId,
              fields: {
                create: [...templateFields].reverse().map((templateField) => ({
                  // Reverse the array before mapping to maintain original order
                  templateField: {
                    connect: {
                      id: templateField.id,
                    },
                  },
                  fieldValue: fieldValuesMap.get(templateField.id) || "",
                })),
              },
            },
            include: {
              fields: {
                include: {
                  productTemplate: true,
                },
              },
            },
          });
        }

        // First create product with empty arrays for both images and manuals
        const createdProduct = await tx.product.create({
          data: {
            name: data.name,
            description: data.description,
            model: data.model ?? null,
            productCode: data.productCode,
            type: data.type ?? null,
            warranty: data.warranty ?? null,
            guarantee: data.guarantee ?? null,
            tradePrice: data.tradePrice ? parseFloat(data.tradePrice) : null,
            retailPrice: data.retailPrice ? parseFloat(data.retailPrice) : null,
            contractPrice: data.contractPrice
              ? parseFloat(data.contractPrice)
              : null,
            promotionalPrice: data.promotionalPrice
              ? parseFloat(data.promotionalPrice)
              : null,
            unit: data.unit ?? null,
            weight: data.weight ? parseFloat(data.weight) : null,
            color: data.color ?? null,
            length: data.length ? parseFloat(data.length) : null,
            width: data.width ? parseFloat(data.width) : null,
            height: data.height ? parseFloat(data.height) : null,
            material: data.material ?? null,
            volume: data.volume ?? null,
            shape: data.shape ?? null,
            productTemplate: createdProductTemplate?.id
              ? {
                  connect: { id: createdProductTemplate.id },
                }
              : undefined,
            features: data.features?.map((item) => item.feature),
            primaryCategory: data.primaryCategoryId
              ? {
                  connect: { id: data.primaryCategoryId },
                }
              : undefined,
            secondaryCategory: data.secondaryCategoryId
              ? {
                  connect: { id: data.secondaryCategoryId },
                }
              : undefined,
            tertiaryCategory: data.tertiaryCategoryId
              ? {
                  connect: { id: data.tertiaryCategoryId },
                }
              : undefined,
            quaternaryCategory: data.quaternaryCategoryId
              ? {
                  connect: { id: data.quaternaryCategoryId },
                }
              : undefined,
            brand: data.brand
              ? {
                  connect: { id: data.brand },
                }
              : undefined,
            manufacturerLink: data.manufacturerLink || null,
            status: data.status || "ACTIVE",
            images: [],
            manuals: [],
          },
          include: {
            inventory: {
              select: {
                id: true,
              },
            },
          },
        });

        await tx.inventory.create({
          data: {
            productId: createdProduct.id,
            deliveryEligibility: true,
            collectionEligibility: true,
            stockCount: 10,
            collectionPoints: [],
            deliveryAreas: [],
            heldCount: 0,
            minDeliveryCount: 0,
            minCollectionCount: 0,
          },
        });

        // Confirm image uploads
        const confirmedImages = [];
        for (const imageData of data.images || []) {
          try {
            const result = await backendClient.publicImages.confirmUpload({
              url: imageData.image,
            });
            if (result.success) {
              confirmedImages.push(imageData.image);
            } else {
              throw new Error(
                `Failed to confirm upload for image: ${imageData.image}`
              );
            }
          } catch (error) {
            console.error(
              `Failed to confirm image upload for ${imageData.image}:`,
              error
            );
            throw new Error(`Failed to upload image: ${imageData.image}`);
          }
        }

        // Confirm manual uploads
        const confirmedManuals = [];
        for (const manualUrl of data.manuals || []) {
          try {
            const result = await backendClient.publicFiles.confirmUpload({
              url: manualUrl,
            });
            if (result.success) {
              confirmedManuals.push(manualUrl);
            } else {
              throw new Error(
                `Failed to confirm upload for manual: ${manualUrl}`
              );
            }
          } catch (error) {
            console.error(
              `Failed to confirm manual upload for ${manualUrl}:`,
              error
            );
            throw new Error(`Failed to upload manual: ${manualUrl}`);
          }
        }

        // Update product with confirmed files
        const updatedProduct = await tx.product.update({
          where: { id: createdProduct.id },
          data: {
            images: confirmedImages,
            manuals: confirmedManuals,
          },
          include: {
            inventory: {
              select: {
                id: true,
              },
            },
          },
        });

        return updatedProduct;
      },
      {
        maxWait: 5000, // 5 seconds
        timeout: 10000, // 10 seconds
      }
    );

    revalidatePath("/", "layout");

    return {
      message: "Product created successfully!",
      data: result,
      success: true,
    };
  } catch (error) {
    console.error("Error in createProduct:", error);
    return {
      message:
        "An error occurred while creating the product. Please try again later.",
      success: false,
    };
  }
}

export async function duplicateProduct(productId: string) {
  try {
    // Get the original product with all necessary relations
    const originalProduct = await prisma.product.findUnique({
      where: { id: productId },
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

    if (!originalProduct) {
      return {
        message: "Original product not found",
        success: false,
      };
    }

    const result = await prisma.$transaction(
      async (tx) => {
        // Create a new product template if the original had one
        let duplicatedTemplate;
        if (originalProduct.productTemplate) {
          duplicatedTemplate = await tx.productTemplate.create({
            data: {
              templateId: originalProduct.productTemplate.templateId,
              fields: {
                create: originalProduct.productTemplate.fields.map((field) => ({
                  templateField: {
                    connect: {
                      id: field.templateFieldId,
                    },
                  },
                  fieldValue: field.fieldValue,
                })),
              },
            },
          });
        }

        // Create the duplicated product with the original files
        const duplicatedProduct = await tx.product.create({
          data: {
            name: `${originalProduct.name} (Copy)`,
            description: originalProduct.description,
            model: originalProduct.model,
            productCode: originalProduct.productCode,
            type: originalProduct.type,
            warranty: originalProduct.warranty,
            guarantee: originalProduct.guarantee,
            tradePrice: originalProduct.tradePrice,
            retailPrice: originalProduct.retailPrice,
            contractPrice: originalProduct.contractPrice,
            promotionalPrice: originalProduct.promotionalPrice,
            unit: originalProduct.unit,
            weight: originalProduct.weight,
            color: originalProduct.color,
            length: originalProduct.length,
            width: originalProduct.width,
            height: originalProduct.height,
            material: originalProduct.material,
            volume: originalProduct.volume,
            shape: originalProduct.shape,
            productTemplate: duplicatedTemplate
              ? {
                  connect: { id: duplicatedTemplate.id },
                }
              : undefined,
            features: originalProduct.features,
            primaryCategory: originalProduct.primaryCategoryId
              ? {
                  connect: { id: originalProduct.primaryCategoryId },
                }
              : undefined,
            secondaryCategory: originalProduct.secondaryCategoryId
              ? {
                  connect: { id: originalProduct.secondaryCategoryId },
                }
              : undefined,
            tertiaryCategory: originalProduct.tertiaryCategoryId
              ? {
                  connect: { id: originalProduct.tertiaryCategoryId },
                }
              : undefined,
            quaternaryCategory: originalProduct.quaternaryCategoryId
              ? {
                  connect: { id: originalProduct.quaternaryCategoryId },
                }
              : undefined,
            brand: originalProduct.brandId
              ? {
                  connect: { id: originalProduct.brandId },
                }
              : undefined,
            status: "DRAFT", // Always create duplicate as draft
            images: originalProduct.images, // Simply copy the original URLs
            manuals: originalProduct.manuals, // Simply copy the original URLs
          },
          include: {
            inventory: {
              select: {
                id: true,
              },
            },
          },
        });

        // Create inventory record for the duplicated product
        await tx.inventory.create({
          data: {
            productId: duplicatedProduct.id,
            deliveryEligibility: false,
            collectionEligibility: false,
            stockCount: 0,
            collectionPoints: [],
            deliveryAreas: [],
          },
        });

        return duplicatedProduct;
      },
      {
        maxWait: 5000, // 5 seconds
        timeout: 10000, // 10 seconds
      }
    );

    revalidatePath("/", "layout");

    return {
      message: "Product duplicated successfully!",
      data: result,
      success: true,
    };
  } catch (error) {
    console.error("Error in duplicateProduct:", error);
    return {
      message:
        "An error occurred while duplicating the product. Please try again later.",
      success: false,
    };
  }
}

export async function updateProduct(
  productId: string,
  data: ProductFormInputType
) {
  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const existingProduct = await tx.product.findUnique({
          where: { id: productId },
          include: {
            productTemplate: true,
            inventory: {
              select: {
                id: true,
              },
            },
          },
        });

        if (!existingProduct) {
          throw new Error("Product not found");
        }

        // Handle product template
        let productTemplateId = null;
        if (data.templateId) {
          // Template handling remains the same...
          const templateFields = await tx.templateField.findMany({
            where: {
              templateId: data.templateId,
            },
          });

          const fieldValuesMap = new Map(
            data.productTemplateFields
              ?.filter(
                (field): field is NonNullable<typeof field> =>
                  field !== undefined && field.fieldId !== undefined
              )
              .map((field) => [field.fieldId, field.fieldValue || ""])
          );

          if (existingProduct.productTemplate?.id) {
            const updatedProductTemplate = await tx.productTemplate.update({
              where: { id: existingProduct.productTemplate.id },
              data: {
                templateId: data.templateId,
                fields: {
                  deleteMany: {},
                  create: [...templateFields]
                    .reverse()
                    .map((templateField) => ({
                      templateField: {
                        connect: {
                          id: templateField.id,
                        },
                      },
                      fieldValue: fieldValuesMap.get(templateField.id) || "",
                    })),
                },
              },
            });
            productTemplateId = updatedProductTemplate.id;
          } else {
            const newProductTemplate = await tx.productTemplate.create({
              data: {
                templateId: data.templateId,
                fields: {
                  create: [...templateFields]
                    .reverse()
                    .map((templateField) => ({
                      templateField: {
                        connect: {
                          id: templateField.id,
                        },
                      },
                      fieldValue: fieldValuesMap.get(templateField.id) || "",
                    })),
                },
              },
            });
            productTemplateId = newProductTemplate.id;
          }
        } else if (existingProduct.productTemplate) {
          await tx.productTemplate.delete({
            where: { id: existingProduct.productTemplate.id },
          });
        }

        // Handle image deletions and confirmations
        const imagesToDelete = existingProduct.images.filter(
          (image) => !data.images?.some((img) => img?.image === image)
        );

        for (const image of imagesToDelete) {
          try {
            await backendClient.publicImages.deleteFile({
              url: image,
            });
          } catch (error) {
            console.error(`Failed to delete image ${image}:`, error);
            throw new Error(`Failed to delete image ${image}`);
          }
        }

        // Handle manual deletions
        const manualsToDelete = existingProduct.manuals.filter(
          (manual) => !data.manuals?.includes(manual)
        );

        for (const manual of manualsToDelete) {
          try {
            await backendClient.publicFiles.deleteFile({
              url: manual,
            });
          } catch (error) {
            console.error(`Failed to delete manual ${manual}:`, error);
            throw new Error(`Failed to delete manual ${manual}`);
          }
        }

        // Handle new image confirmations
        const confirmedImages = [];
        if (data.images) {
          for (const imageData of data.images) {
            if (
              imageData?.image &&
              !existingProduct.images.includes(imageData.image)
            ) {
              try {
                const result = await backendClient.publicImages.confirmUpload({
                  url: imageData.image,
                });
                if (result.success) {
                  confirmedImages.push(imageData.image);
                } else {
                  throw new Error(
                    `Failed to confirm upload for ${imageData.image}`
                  );
                }
              } catch (error) {
                console.error(
                  `Failed to confirm upload for ${imageData.image}:`,
                  error
                );
                throw new Error(`Failed to upload ${imageData.image}`);
              }
            } else if (imageData?.image) {
              confirmedImages.push(imageData.image);
            }
          }
        }

        // Handle new manual confirmations
        const confirmedManuals = [];
        if (data.manuals) {
          for (const manualUrl of data.manuals) {
            if (!existingProduct.manuals.includes(manualUrl)) {
              try {
                const result = await backendClient.publicFiles.confirmUpload({
                  url: manualUrl,
                });
                if (result.success) {
                  confirmedManuals.push(manualUrl);
                } else {
                  throw new Error(
                    `Failed to confirm upload for manual: ${manualUrl}`
                  );
                }
              } catch (error) {
                console.error(
                  `Failed to confirm upload for manual: ${manualUrl}`,
                  error
                );
                throw new Error(`Failed to upload manual: ${manualUrl}`);
              }
            } else {
              confirmedManuals.push(manualUrl);
            }
          }
        }

        // Features array with null check and undefined filtering
        const features =
          data.features
            ?.filter(
              (item): item is NonNullable<typeof item> =>
                item !== undefined && item.feature !== undefined
            )
            .map((item) => item.feature) ?? [];

        // Update the product
        const updatedProduct = await tx.product.update({
          where: { id: productId },
          data: {
            name: data.name,
            description: data.description,
            model: data.model ?? null,
            productCode: data.productCode,
            type: data.type ?? null,
            warranty: data.warranty ?? null,
            guarantee: data.guarantee ?? null,
            tradePrice: data.tradePrice ? parseFloat(data.tradePrice) : null,
            retailPrice: data.retailPrice ? parseFloat(data.retailPrice) : null,
            contractPrice: data.contractPrice
              ? parseFloat(data.contractPrice)
              : null,
            promotionalPrice: data.promotionalPrice
              ? parseFloat(data.promotionalPrice)
              : null,
            unit: data.unit ?? null,
            weight: data.weight ? parseFloat(data.weight) : null,
            color: data.color ?? null,
            length: data.length ? parseFloat(data.length) : null,
            width: data.width ? parseFloat(data.width) : null,
            height: data.height ? parseFloat(data.height) : null,
            material: data.material ?? null,
            volume: data.volume ?? null,
            shape: data.shape ?? null,
            status: data.status ?? "ACTIVE",
            productTemplate: productTemplateId
              ? { connect: { id: productTemplateId } }
              : { disconnect: true },
            features: features,
            brand: data.brand
              ? { connect: { id: data.brand } }
              : { disconnect: true },
            manufacturerLink: data.manufacturerLink || null,
            primaryCategory: data.primaryCategoryId
              ? { connect: { id: data.primaryCategoryId } }
              : { disconnect: true },
            secondaryCategory: data.secondaryCategoryId
              ? { connect: { id: data.secondaryCategoryId } }
              : { disconnect: true },
            tertiaryCategory: data.tertiaryCategoryId
              ? { connect: { id: data.tertiaryCategoryId } }
              : { disconnect: true },
            quaternaryCategory: data.quaternaryCategoryId
              ? { connect: { id: data.quaternaryCategoryId } }
              : { disconnect: true },
            images: confirmedImages,
            manuals: confirmedManuals,
            updatedAt: new Date(),
          },
          include: {
            inventory: {
              select: {
                id: true,
              },
            },
          },
        });

        return updatedProduct;
      },
      {
        maxWait: 5000,
        timeout: 10000,
      }
    );

    revalidatePath("/", "layout");

    return {
      message: "Product updated successfully!",
      data: result,
      success: true,
    };
  } catch (error) {
    console.error("Error in updateProduct:", error);
    return {
      message:
        "An error occurred while updating the product. Please try again later.",
      success: false,
    };
  }
}

export async function deleteProducts(productIds: string[]) {
  if (!productIds || productIds.length === 0) {
    return {
      message: "No products selected for deletion",
      success: false,
    };
  }

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        // Fetch all products to be deleted with their relations
        const productsToDelete = await tx.product.findMany({
          where: { id: { in: productIds } },
          include: {
            productTemplate: true,
            inventory: true,
          },
        });

        if (productsToDelete.length === 0) {
          throw new Error("No products found");
        }

        // Delete files (images and manuals) for all products
        for (const product of productsToDelete) {
          // Delete images
          if (product.images && product.images.length > 0) {
            for (const image of product.images) {
              try {
                await backendClient.publicImages.deleteFile({
                  url: image,
                });
              } catch (error) {
                console.error(`Failed to delete image ${image}:`, error);
                // Continue with deletion even if file deletion fails
              }
            }
          }

          // Delete manuals
          if (product.manuals && product.manuals.length > 0) {
            for (const manual of product.manuals) {
              try {
                await backendClient.publicFiles.deleteFile({
                  url: manual,
                });
              } catch (error) {
                console.error(`Failed to delete manual ${manual}:`, error);
                // Continue with deletion even if file deletion fails
              }
            }
          }
        }

        // Delete associated product templates
        const templateIds = productsToDelete
          .map((p) => p.productTemplateId)
          .filter((id): id is string => id !== null);

        if (templateIds.length > 0) {
          await tx.productTemplate.deleteMany({
            where: { id: { in: templateIds } },
          });
        }

        // Get all valid inventory IDs
        const inventoryIds = productsToDelete
          .flatMap((p) => p.inventory)
          .filter((inv): inv is NonNullable<typeof inv> => inv !== null)
          .map((inv) => inv.id);

        // Delete cart items referencing these products' inventories
        if (inventoryIds.length > 0) {
          await tx.cartItem.deleteMany({
            where: {
              inventoryId: {
                in: inventoryIds,
              },
            },
          });
        }

        // Delete inventories
        await tx.inventory.deleteMany({
          where: { productId: { in: productIds } },
        });

        // Delete order items referencing these products
        await tx.orderItem.deleteMany({
          where: { productId: { in: productIds } },
        });

        // Finally, delete the products
        const deletedProducts = await tx.product.deleteMany({
          where: { id: { in: productIds } },
        });

        return {
          count: deletedProducts.count,
          products: productsToDelete,
        };
      },
      {
        maxWait: 10000, // 10 seconds
        timeout: 30000, // 30 seconds
      }
    );

    revalidatePath("/", "layout");

    return {
      message: `Successfully deleted ${result.count} ${
        result.count === 1 ? "product" : "products"
      }`,
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error in deleteProducts:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      message: `Failed to delete products: ${errorMessage}`,
      success: false,
    };
  }
}

export async function exportProductsToJSON() {
  try {
    const products = await prisma.product.findMany({
      include: {
        primaryCategory: true,
        secondaryCategory: true,
        tertiaryCategory: true,
        quaternaryCategory: true,
        brand: true,
        inventory: true,
      },
    });

    const formattedProducts = products.map((product) => ({
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));

    const jsonData = JSON.stringify(formattedProducts, null, 2);

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Products successfully exported to JSON",
      data: jsonData,
    };
  } catch (error) {
    console.error("Failed to export products to JSON:", error);
    return {
      success: false,
      message: "Failed to export products to JSON",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function exportProductsToExcel() {
  try {
    const products = await prisma.product.findMany({
      include: {
        primaryCategory: true,
        secondaryCategory: true,
        tertiaryCategory: true,
        quaternaryCategory: true,
        brand: true,
        inventory: true,
      },
    });

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Products");

    worksheet.columns = [
      { header: "ID", key: "id", width: 30 },
      { header: "Name", key: "name", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Model", key: "model", width: 20 },
      { header: "Type", key: "type", width: 20 },
      { header: "Trade Price", key: "tradePrice", width: 15 },
      { header: "Contract Price", key: "contractPrice", width: 15 },
      { header: "Promotional Price", key: "promotionalPrice", width: 15 },
      { header: "Primary Category", key: "primaryCategory", width: 20 },
      { header: "Secondary Category", key: "secondaryCategory", width: 20 },
      { header: "Tertiary Category", key: "tertiaryCategory", width: 20 },
      { header: "Quaternary Category", key: "quaternaryCategory", width: 20 },
      { header: "Brand", key: "brand", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "Created At", key: "createdAt", width: 20 },
      { header: "Updated At", key: "updatedAt", width: 20 },
      { header: "Inventory Count", key: "inventoryCount", width: 15 },
    ];

    products.forEach((product) => {
      worksheet.addRow({
        id: product.id,
        name: product.name,
        description: product.description,
        model: product.model,
        type: product.type,
        tradePrice: product.tradePrice,
        contractPrice: product.contractPrice,
        promotionalPrice: product.promotionalPrice,
        primaryCategory: product.primaryCategory?.name,
        secondaryCategory: product.secondaryCategory?.name,
        tertiaryCategory: product.tertiaryCategory?.name,
        quaternaryCategory: product.quaternaryCategory?.name,
        brand: product.brand?.name,
        status: product.status,
        createdAt: dayjs(product.createdAt).format("DD MMMM YYYY HH:mm:ss"),
        updatedAt: dayjs(product.updatedAt).format("DD MMMM YYYY HH:mm:ss"),
        inventoryCount: product.inventory?.stockCount,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const excelData = Buffer.from(buffer).toString("base64");

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Products successfully exported to Excel",
      data: excelData,
    };
  } catch (error) {
    console.error("Failed to export products to Excel:", error);
    return {
      success: false,
      message: "Failed to export products to Excel",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

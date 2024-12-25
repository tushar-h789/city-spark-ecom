"use server";

import prisma from "./prisma";

// async function generateSku() {
//   // Prefix for all SKUs
//   const PREFIX = "CS";
//   // Starting number for first SKU
//   const START_NUMBER = 10000;

//   // Find the highest numbered SKU
//   const highestSku = await prisma.product.findFirst({
//     where: {
//       sku: {
//         startsWith: PREFIX,
//       },
//     },
//     orderBy: {
//       sku: "desc",
//     },
//   });

//   if (!highestSku) {
//     // First SKU in the system
//     return `${PREFIX}${START_NUMBER}`;
//   }

//   try {
//     // Extract the number from existing SKU
//     const currentNumber = parseInt(highestSku.sku.substring(PREFIX.length));
//     // Generate next number
//     const nextNumber = currentNumber + 1;
//     // Create new SKU
//     return `${PREFIX}${nextNumber}`;
//   } catch (error) {
//     // Fallback in case of parsing errors
//     console.error("Error generating SKU:", error);
//     // Generate a unique timestamp-based SKU as fallback
//     const timestamp = Date.now().toString().slice(-5);
//     return `${PREFIX}${START_NUMBER}${timestamp}`;
//   }
// }

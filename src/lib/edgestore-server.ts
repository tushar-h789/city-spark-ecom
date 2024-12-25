import { initEdgeStoreClient } from "@edgestore/server/core";
import { initEdgeStore } from "@edgestore/server";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";
import { z } from "zod";

const es = initEdgeStore.create();

/**
 * This is the main router for the Edge Store buckets.
 */
const edgeStoreRouter = es.router({
  publicFiles: es
    .fileBucket({
      maxSize: 1024 * 1024 * 50, // 50MB
    })
    .input(
      z.object({
        type: z.enum(["manual", "instruction", "technical", "specification"]),
        category: z.enum(["product", "brand", "template"]),
      })
    )
    // e.g. /products/manuals/product-name.pdf
    .path(({ input }) => [{ type: input.category }, { folder: input.type }])
    .beforeDelete(({ ctx, fileInfo }) => {
      console.log("beforeDelete document", ctx, fileInfo);
      return true; // allow delete
    }),

  publicImages: es
    .imageBucket({
      maxSize: 1024 * 1024 * 1, // 1MB
    })
    .input(
      z.object({
        type: z.enum([
          "product",
          "account",
          "brand",
          "template",
          "category",
          "user",
        ]),
      })
    )
    // e.g. /products/radiator.jpg
    .path(({ input }) => [{ type: input.type }])
    .beforeDelete(({ ctx, fileInfo }) => {
      console.log("beforeDelete", ctx, fileInfo);
      return true; // allow delete
    }),
});

export const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

export const backendClient = initEdgeStoreClient({
  router: edgeStoreRouter,
});

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;

import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  let globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

export default prisma;

// import { PrismaClient } from "@prisma/client";
// import { PrismaClient as EdgePrismaClient } from "@prisma/client/edge";
// import { withAccelerate } from "@prisma/extension-accelerate";

// declare global {
//   var prisma: PrismaClient | undefined;
// }

// // Create a single type that represents our Prisma client
// type PrismaClientType = PrismaClient | ReturnType<typeof createEdgeClient>;

// function createEdgeClient() {
//   return new EdgePrismaClient().$extends(withAccelerate());
// }

// function createClient(): PrismaClientType {
//   if (process.env.NODE_ENV === "production") {
//     return createEdgeClient();
//   }

//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }

//   return global.prisma;
// }

// // Use type assertion to ensure consistent typing
// const prisma = createClient() as PrismaClient;

// export default prisma;

import { Prisma } from "@prisma/client";

export function getCartWhereInput(
  userId?: string,
  sessionId?: string
): Prisma.CartWhereInput {
  if (userId && sessionId) {
    return { AND: [{ userId }, { sessionId }] };
  } else if (userId) {
    return { userId };
  } else if (sessionId) {
    return { sessionId };
  }
  throw new Error("Neither userId nor sessionId is available");
}

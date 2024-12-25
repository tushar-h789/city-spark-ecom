"use server";

import { cookies } from "next/headers";
import crypto from "crypto";

export async function getOrCreateSessionId() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
  }

  return sessionId;
}

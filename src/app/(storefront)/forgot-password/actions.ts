"use server";

import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";
import { sendResetPasswordEmail } from "@/lib/email";

export async function forgotPassword(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const token = uuidv4();
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.passwordResetToken.create({
      data: {
        token,
        expires,
        userId: user.id,
      },
    });

    // Send password reset email (placeholder implementation)
    await sendResetPasswordEmail(user.email, token);

    return { success: true };
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return {
      success: false,
      message: "An error occurred while processing your request",
    };
  }
}

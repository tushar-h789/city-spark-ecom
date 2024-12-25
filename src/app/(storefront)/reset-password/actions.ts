"use server";

import prisma from "@/lib/prisma";
import { hash } from "bcrypt";

export async function resetPassword(token: string, newPassword: string) {
  try {
    const passwordReset = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!passwordReset || passwordReset.expires < new Date()) {
      return { success: false, message: "Invalid or expired reset token" };
    }

    const hashedPassword = await hash(newPassword, 10);

    await prisma.user.update({
      where: { id: passwordReset.userId },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({
      where: { id: passwordReset.id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return {
      success: false,
      message: "An error occurred while resetting your password",
    };
  }
}

export async function verifyResetToken(token: string) {
  try {
    const passwordReset = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!passwordReset || passwordReset.expires < new Date()) {
      return { success: false, message: "Invalid or expired reset token" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in verifyResetToken:", error);
    return {
      success: false,
      message: "An error occurred while verifying the reset token",
    };
  }
}

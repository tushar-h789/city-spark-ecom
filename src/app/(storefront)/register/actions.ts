"use server";

import { RegisterFormData } from "./schema";
import prisma from "@/lib/prisma";
import { hash } from "bcrypt";

export async function createUser(data: RegisterFormData) {
  try {
    const { firstName, surname, email, password } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return {
        success: false,
        message: "A user with this email already exists.",
      };
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName: surname,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "User registered successfully.",
      data: {
        userId: newUser.id,
      },
    };
  } catch (error) {
    console.error("Error in createUser:", error);

    if (error instanceof Error) {
      return {
        success: false,
        message: `Error creating user: ${error.message}`,
      };
    }

    return {
      success: false,
      message:
        "An unexpected error occurred while creating the user. Please try again later.",
    };
  }
}

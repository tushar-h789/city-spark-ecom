"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FromInputType } from "./schema";
export type FormState = {
  message: string;
};

export async function createUser(data: FromInputType) {
  try {
    const createUser = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        avatar: data.avatar,
        addresses: {
          create: data.address.map((item) => ({
            addressLine1: item.addressLine1,
            addressLine2: item.addressLine2,
            city: item.city,
            county: item.state,
            postcode: item.postalCode,
            country: item.country,
            isBilling: false,
            isShipping: false,
            isDefaultBilling: false,
            isDefaultShipping: false,
          })),
        },
      },
    });

    // Revalidate the entire site
    revalidatePath("/", "layout");

    return {
      message: "User created successfully!",
      data: createUser,
      success: true,
    };
  } catch (error) {
    return {
      message: "An error occurred while creating the user.",
      success: false,
    };
  }
}

export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      include: {
        addresses: true,
        orders: true,
        carts: true,
        wishlist: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error(
      "An error occurred while fetching users. Please try again later."
    );
  }
};

export async function deleteUser(userId: string) {
  try {
    if (!userId) {
      return {
        message: "User ID is required",
        success: false,
      };
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    // Revalidate the entire site
    revalidatePath("/", "layout");

    return {
      message: "User deleted successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      message: "An error occurred while deleting the user.",
      success: false,
    };
  }
}

export async function updateUser(userId: string, data: FromInputType) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: true },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    const updateData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      avatar: data.avatar,
    };

    const addressesToUpdate = [];
    const addressesToCreate = [];
    const addressIdsToKeep = new Set();

    for (const address of data.address) {
      if (address.addressId) {
        addressesToUpdate.push({
          addressId: address.addressId,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          city: address.city,
          county: address.state,
          postcode: address.postalCode,
          country: address.country,
          isBilling: false,
          isShipping: false,
          isDefaultBilling: false,
          isDefaultShipping: false,
        });
        addressIdsToKeep.add(address.addressId);
      } else {
        addressesToCreate.push({
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          city: address.city,
          county: address.state,
          postcode: address.postalCode,
          country: address.country,
          isBilling: false,
          isShipping: false,
          isDefaultBilling: false,
          isDefaultShipping: false,
        });
      }
    }

    const addressIdsToDelete = existingUser.addresses
      .filter((address) => !addressIdsToKeep.has(address.id))
      .map((address) => address.id);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        addresses: {
          update: addressesToUpdate.map((address) => ({
            where: { id: address.addressId },
            data: {
              addressLine1: address.addressLine1,
              addressLine2: address.addressLine2,
              city: address.city,
              county: address.county,
              postcode: address.postcode,
              country: address.country,
              isBilling: address.isBilling,
              isShipping: address.isShipping,
              isDefaultBilling: address.isDefaultBilling,
              isDefaultShipping: address.isDefaultShipping,
            },
          })),
          create: addressesToCreate,
          deleteMany: { id: { in: addressIdsToDelete } },
        },
      },
      include: {
        addresses: true,
      },
    });

    // Revalidate the entire site
    revalidatePath("/", "layout");

    return {
      message: "User updated successfully!",
      data: updatedUser,
      success: true,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      message: "An error occurred while updating the user.",
      success: false,
    };
  }
}

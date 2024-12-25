import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      firstName?: string | null;
      lastName?: string | null;
      image?: string | null;
      email: string; // Add this line to explicitly include email
    } & Omit<DefaultSession["user"], "name">;
  }

  interface User {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email: string; // Change this to non-optional if email is always required
    emailVerified?: Date | null;
    image?: string | null;
    role: Role;
    phone?: string | null;
    avatar?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }

  interface JWT {
    userId: string;
    role: string;
    firstName?: string | null;
    lastName?: string | null;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId: string;
    role: Role;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
  }
}

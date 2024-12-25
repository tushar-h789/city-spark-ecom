import { z } from "zod";

const nonEmptyString = (fieldName: string) =>
  z.string().min(1, `${fieldName} is required`);

export const registerSchema = z
  .object({
    firstName: nonEmptyString("First name").min(
      2,
      "First name must be at least 2 characters long"
    ),
    surname: nonEmptyString("Surname").min(
      2,
      "Surname must be at least 2 characters long"
    ),
    email: nonEmptyString("Email").email("Please enter a valid email address"),
    password: nonEmptyString("Password")
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: nonEmptyString("Confirm password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

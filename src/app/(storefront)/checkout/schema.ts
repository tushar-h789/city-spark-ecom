import { z } from "zod";

export const contactDetailsSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^[0-9+\-\s()]+$/, "Invalid mobile number format"),
  createAccount: z.boolean().default(false),
});

export type ContactDetailsFormInput = z.infer<typeof contactDetailsSchema>;

export const addressSchema = z.object({
  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City/Town is required"),
  county: z.string().optional(),
  postcode: z.string().min(1, "Postcode is required"),
  country: z.string().min(1, "Country is required").default("United Kingdom"),
});

export type AddressFormData = z.infer<typeof addressSchema>;

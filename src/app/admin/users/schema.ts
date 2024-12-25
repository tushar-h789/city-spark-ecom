import { z } from 'zod';

export const userSchema = z.object({
  avatar: z.string().optional(),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  password: z.string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(100, { message: "Password must be less than 100 characters long" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address:z
  .array(
    z.object({     
      addressId: z.string().trim().optional(),
      city: z.string().trim().min(1,"City is required"),
      postalCode: z.string().trim().min(1, "Postal Code is required"),
      state: z.string().trim().min(1, "State is required"),  
      addressLine1: z.string().trim().min(1, "Address line 1 is required "), 
      addressLine2: z.string().optional(),
      country: z.string().min(1, "Country is required"),
    })
  )
  .min(1),
 
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"] // path of error
}); 
export type FromInputType = z.infer<typeof userSchema>;
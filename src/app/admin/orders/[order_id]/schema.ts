import { z } from "zod";

export const orderDetailsSchema = z.object({
  name: z.string().min(1, "User name is required"),
  email: z.string().email().min(1, "Email is required"),
  shippingAddress: z.string().min(1,'Shipping address is required' ),
  billingAddress: z.string().min(1,'Billing address is required' ),
  payment:z.string().min(1,'payment is required is required' )
});

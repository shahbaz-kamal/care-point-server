import z from "zod";

export const loginZodSchema = z.object({
  email: z.string().nonempty("Email is required"),
  password: z.string("Password Must be string"),
  // .min(6, "Password must includes at least 6 characters")
  // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .regex(/[a-z]/, "Password must contain at least one lowercase letter"),
});

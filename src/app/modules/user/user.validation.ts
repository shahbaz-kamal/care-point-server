import z from "zod";

const createUserZodSchema = z.object({
  password: z.string({
    error: "Password is required",
  }),
  patient: z.object({
    name: z
      .string()
      .nonempty("Name is Required")
      .min(2, "Name must be at leas two characters")
      .max(100, "Name can not exceed 100 characters"),

    email: z.string().nonempty("Email is required"),
    address: z.string().optional(),
  }),
});

export const UserValidation = { createUserZodSchema };

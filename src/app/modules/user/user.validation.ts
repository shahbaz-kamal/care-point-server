import { Gender } from "@prisma/client";
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

const createAdminZodSchema = z.object({
  password: z.string({
    error: "Password is required",
  }),
  admin: z.object({
    name: z
      .string()
      .nonempty("Name is Required")
      .min(2, "Name must be at leas two characters")
      .max(100, "Name can not exceed 100 characters"),

    email: z.string().nonempty("Email is required"),
    contactNumber: z.string().nonempty("contact number i s required"),
    // address: z.string(),
    // registrationNumber:z.string().nonempty("registration number i s required"),
    // experience:z.number().optional(),
    // gender:z.enum(Object.values(Gender) as [string]),
  }),
});
const createDoctorZodSchema = z.object({
  password: z.string({
    error: "Password is required",
  }),
  doctor: z.object({
    name: z
      .string()
      .nonempty("Name is Required")
      .min(2, "Name must be at leas two characters")
      .max(100, "Name can not exceed 100 characters"),

    email: z.string().nonempty("Email is required"),
    contactNumber: z.string().nonempty("contact number i s required"),
    address: z.string(),
    registrationNumber: z.string().nonempty("registration number i s required"),
    experience: z.number().optional(),
    gender: z.enum(Object.values(Gender) as [string]),
    appoinmentFee: z.number("Appoinment Fee is required"),
    qualification: z.string("qualification is required"),
    currentWorkingPlace: z.string("currentWorkingPlace is required"),
    designation: z.string("designation is required"),
  }),
});

export const UserValidation = { createUserZodSchema, createAdminZodSchema, createDoctorZodSchema };

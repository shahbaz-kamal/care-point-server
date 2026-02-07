import { ICreatePatient } from "./user.interface";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { prisma } from "../../shared/prisma";
import { Request } from "express";
import { fileUploader } from "../../../utils/fileUploader";

const createPatient = async (req: Request) => {
  const hashedPassword = await bcrypt.hash(req.body.password, Number(envVars.BCRYPT_SALT_ROUND));

  if (req.file) {
    const uploadedResult = await fileUploader.uploadToCloudinary(req.file);
    req.body.patient.profilePhoto = uploadedResult?.secure_url;
  }
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        email: req.body.patient.email,
        password: hashedPassword,
      },
    });

    return await tx.patient.create({
      data: req.body.patient,
    });
  });

  return result;
};

const getAllUser = async (page: number, limit: number, searchTerm?: string, sortBy?: string | null, sortOrder?: string | null) => {
  const skip = (page - 1) * limit;

  console.log("From controller", page, limit, skip, sortBy, sortOrder);
  const result = await prisma.user.findMany({
    skip,
    take: limit,

    where: {
      email: {
        contains: searchTerm,
        mode: "insensitive",
      },
    },
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const totalUser = await prisma.user.count();

  const matchedDocument = result.length;

  const totalPage = totalUser / limit;
  const meta = {
    page,
    limit,
    totalPage,
    totalDocuments: totalUser,
    matchedDocument,
  };
  return { result, meta };
};

export const UserService = { createPatient, getAllUser };

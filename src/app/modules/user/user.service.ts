import { ICreatePatient } from "./user.interface";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { prisma } from "../../shared/prisma";
import { Request } from "express";
import { fileUploader } from "../../../utils/fileUploader";
import { PaginationHelper } from "../../../utils/paginationHelper";
import { IPaginationOptions } from "../../types";
import { Prisma } from "@prisma/client";
import { userSearchableFields } from "./user.constant";



const getAllUser = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } = PaginationHelper.calcualtePagination(options);

  const { searchTerm, ...filterData } = params;

  const andCondition: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData.length > 0)) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.UserWhereInput =
    andCondition.length > 0
      ? {
          AND: andCondition,
        }
      : {};

  const result = await prisma.user.findMany({
    skip,
    take: limit,

    where: whereCondition,
    orderBy: { [sortBy]: sortOrder },
  });

  const totalUser = await prisma.user.count({
    where: whereCondition,
  });

  const totalPage = Math.ceil(totalUser / limit);
  const meta = {
    page,
    limit,
    totalPage,
    totalDocuments: totalUser,
  };
  return { result, meta };
};

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

const createDoctor=async()=>{

}
export const UserService = { createPatient, getAllUser,createDoctor };

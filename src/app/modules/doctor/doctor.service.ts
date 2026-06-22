import { Doctor, Prisma } from "@prisma/client";
import { PaginationHelper } from "../../../utils/paginationHelper";
import { IPaginationOptions } from "../../types";
import { doctorSearchableFields } from "./doctor.constants";
import { prisma } from "../../shared/prisma";
import { IDoctorUpdateInput } from "./doctor.interface";

const getAllFromDb = async (filters: any, options: IPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelper.calcualtePagination(options);

  const { searchTerm, specialities, ...filterData } = filters;
  //   console.log(page, limit, skip, sortBy, sortBy);

  const andConditions: Prisma.DoctorWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (specialities && specialities.length > 0) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialities: {
            title: {
              contains: specialities,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filterData.length > 0)) {
    const filteredCondition = Object.keys(filterData).map((key) => ({
      [key]: { equals: (filterData as any)[key] },
    }));
    andConditions.push(...filteredCondition);
  }

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      doctorSpecialties: {
        include: { specialities: true },
      },
    },
  });
  const total = await prisma.doctor.count({
    where: whereConditions,
  });
  return { meta: { total, page, limit }, data: result };
};

const updateInDB = async (id: string, payload: Partial<IDoctorUpdateInput>) => {
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const { specialities, ...doctorData } = payload;

  return await prisma.$transaction(async (txn) => {
    if (specialities && specialities.length > 0) {
      const specialityIdsToBeDeleted = specialities.filter(
        (s) => s.toBeDeleted
      );
      const newSpecialities = specialities.filter((s) => !s.toBeDeleted);

      for (const speciality of specialityIdsToBeDeleted) {
        await txn.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctorInfo.id,
            specialitiesId: speciality.specialityId,
          },
        });
      }

      for (const speciality of newSpecialities) {
        await txn.doctorSpecialties.create({
          data: { doctorId: id, specialitiesId: speciality.specialityId },
        });
      }
    }
    const updatedDoc = await txn.doctor.update({
      where: {
        id,
      },
      data: doctorData,
      include: {
        doctorSpecialties: {
          include: {
            specialities: true,
          },
        },
      },
    });
    return updatedDoc;
  });
};

export const DoctorService = { getAllFromDb, updateInDB };

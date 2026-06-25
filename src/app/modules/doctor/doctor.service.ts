import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { PaginationHelper } from "../../../utils/paginationHelper";
import { prisma } from "../../shared/prisma";
import { IPaginationOptions } from "../../types";
import { doctorSearchableFields } from "./doctor.constants";
import { IDoctorUpdateInput } from "./doctor.interface";
import { openai } from "../../config/openRouter";
import { extractJsonFromMessage } from "../../../utils/extractJsonFromMessage";

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

const getAiSuggestion = async (payload: { symptoms: string }) => {
  const doctors = await prisma.doctor.findMany({
    where: { isDeleted: false },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });

  console.log("doctors data loaded.......\n");
  const prompt = `
You are a medical assistant AI. Based on the patient's symptoms, suggest the top 3 most suitable doctors.
Each doctor has specialties and years of experience.
Only suggest doctors who are relevant to the given symptoms.

Symptoms: ${payload.symptoms}

Here is the doctor list (in JSON):
${JSON.stringify(doctors, null, 2)}

Return your response in JSON format with full individual doctor data. 
`;

  console.log("analyzing......\n");
  const completion = await openai.chat.completions.create({
    model: "google/gemma-4-31b-it:free",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful AI medical assistant that provides doctor suggestions.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const result = await extractJsonFromMessage(completion.choices[0].message);
  return result;
};

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
      doctorSchedules: {
        include: {
          schedule: true,
        },
      },
    },
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: deleteDoctor.email,
      },
    });

    return deleteDoctor;
  });
};

const softDelete = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deleteDoctor.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return deleteDoctor;
  });
};

export const DoctorService = {
  getAllFromDb,
  updateInDB,
  getAiSuggestion,
  getByIdFromDB,
  deleteFromDB,
  softDelete,
};

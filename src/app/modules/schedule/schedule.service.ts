import { Prisma } from "@prisma/client";
import { addHours, addMinutes, format } from "date-fns";
import { PaginationHelper } from "../../../utils/paginationHelper";
import { prisma } from "../../shared/prisma";
import { IPaginationOptions } from "../../types";
import { IJwtPayload } from "../../types/common";

const scheduleForDoctors = async (
  options: IPaginationOptions,
  filters: any,
  user: IJwtPayload
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelper.calcualtePagination(options);
  const { startDateTime: filterStartDateTime, endDateTime: filterEndDateTime } =
    filters;
  const andConditions: Prisma.ScheduleWhereInput[] = [];

  if (filterStartDateTime && filterEndDateTime) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: filterStartDateTime,
          },
        },
        {
          endDateTime: {
            lte: filterEndDateTime,
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.ScheduleWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};
  const doctorSchedules = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user.email,
      },
    },
    select: {
      scheduleId: true,
    },
  });

  const doctorScheduleIds = doctorSchedules.map(
    (schedule) => schedule.scheduleId
  );
  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorScheduleIds,
      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const totalDocuments = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorScheduleIds,
      },
    },
  });

  return {
    meta: {
      page,
      limit,
      totalDocuments,
    },
    data: result,
  };
};

const insertIntoDB = async (payload: any) => {
  const { startTime, endTime, startDate, endDate } = payload;
  const intervalTime = 30;

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  const schedules = [];
  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );
    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      const slotStartDateTime = startDateTime;
      const slotEndDateTime = addMinutes(startDateTime, intervalTime);
      const schedulData = {
        startDateTime: slotStartDateTime,
        endDateTime: slotEndDateTime,
      };
      const isScheduleExist = await prisma.schedule.findFirst({
        where: {
          startDateTime: schedulData.startDateTime,
          endDateTime: schedulData.endDateTime,
        },
      });
      if (!isScheduleExist) {
        const result = await prisma.schedule.create({
          data: schedulData,
        });
        schedules.push(result);
      }
      slotStartDateTime.setMinutes(
        slotStartDateTime.getMinutes() + intervalTime
      );
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  console.log(payload);
  console.log(schedules);
  return schedules;
};

const deleteScheduleFromDb = async (id: string) => {
  return await prisma.schedule.delete({
    where: {
      id: id,
    },
  });
};
export const ScheduleServices = {
  insertIntoDB,
  scheduleForDoctors,
  deleteScheduleFromDb,
};

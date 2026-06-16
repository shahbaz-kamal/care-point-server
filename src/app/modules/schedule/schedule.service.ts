import { addMinutes, addHours, format } from "date-fns";
import { prisma } from "../../shared/prisma";

const scheduleForDoctors=async()=>{}

const insertIntoDB = async (payload: any) => {
  const { startTime, endTime, startDate, endDate } = payload;
  const intervalTime = 30;

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  const schedules=[]
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
        schedules.push(result)
      }
    slotStartDateTime.setMinutes(slotStartDateTime.getMinutes()+ intervalTime)
    
    }
    currentDate.setDate(currentDate.getDate()+1)
  }
  console.log(payload)
  console.log(schedules)
  return schedules;
};

export const ScheduleServices = {
  insertIntoDB,scheduleForDoctors
};

import { prisma } from "../../shared/prisma";
import { IJwtPayload } from "../../types/common";

const insertIntoDb = async (user: IJwtPayload, payload: {scheduleIds:string[]}) => {
  const doctorData = await prisma.doctor.findUnique({
    where: {
      email: user.email,
    },
  });
  if(!doctorData) return
  const doctorScheduleData=payload.scheduleIds.map(scheduleId=>({
    doctorId:doctorData.id ,
    scheduleId
  }))
  return await prisma.doctorSchedules.createMany({
    data:doctorScheduleData
  })
};

export const DoctorScheduleService = { insertIntoDb };

import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { DoctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status-codes";
const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await DoctorScheduleService.insertIntoDb(user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Doctor Schedule created successfully",
    success: true,
    data: result,
  });
});

export const DoctorScheduleController = { insertIntoDb };

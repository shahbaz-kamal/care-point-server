import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";

import { ScheduleServices } from "./schedule.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleServices.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Schedule Creation Successfull",
    data: result,
  });
});

export const ScheduleController = { insertIntoDB };

import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
// import pick from "../../utils/pick.ts"
import { ScheduleServices } from "./schedule.service";
import { pick } from "../../../utils/pick";
import { IPaginationOptions } from "../../types";
import { IJwtPayload } from "../../types/common";

const scheduleForDoctors = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]) as IPaginationOptions;
  const filters = pick(req.query, ["startDateTime", "endDateTime"]);
  const user=req.user
  const result = await ScheduleServices.scheduleForDoctors(options, filters,user as IJwtPayload);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Schedule Creation Successfull",
    meta: result.meta,
    data: result.data,
  });
});
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleServices.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Schedule Creation Successfull",
    data: result,
  });
});
const deletScheduleFromDb = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleServices.deleteScheduleFromDb(
    req.params.id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Schedule Deleted Successfull",
    data: result,
  });
});

export const ScheduleController = {
  insertIntoDB,
  scheduleForDoctors,
  deletScheduleFromDb,
};

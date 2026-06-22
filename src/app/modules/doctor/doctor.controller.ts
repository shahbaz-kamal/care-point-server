import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { pick } from "../../../utils/pick";
import sendResponse from "../../shared/sendResponse";
import { DoctorService } from "./doctor.service";
import { doctorFilterableFields } from "./doctor.constants";

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, doctorFilterableFields);

  const result = await DoctorService.getAllFromDb(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});
const updateInDB = catchAsync(async (req: Request, res: Response) => {
  // const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  // const filters = pick(req.query, doctorFilterableFields);
  const { id } = req.params;
  const payload = req.body;
  const result = await DoctorService.updateInDB(id as string, payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor Updated successfully",
    data: result,
    // meta:result.meta
  });
});

export const DoctorController = { getAllFromDb, updateInDB };

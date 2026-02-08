import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status-codes";
import { pick } from "../../../utils/pick";
import { userFilterableFields } from "./user.constant";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const newUser = req.body;
  console.log(newUser);
  const result = await UserService.createPatient(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User Creation Successfull",
    data: result,
  });
});
const getAllUser = catchAsync(async (req: Request, res: Response) => {
  // page, limit, sortBy, sortOrder ---> Pagination, Sorting
  // fields, searchTerm ---> Searching and filtering

  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  // const page = Number(req?.query?.page) || 1;
  // const limit = Number(req?.query?.limit) || 10;

  // const searchTerm = req?.query?.searchTerm || "";
  // const sortBy = req?.query?.sortBy || null;
  // const sortOrder = req?.query?.sortOrder || null;

  // console.log("From controller", page, limit);

  const { result, meta } = await UserService.getAllUser(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Retrieved successfully",
    meta,
    data: result,
  });
});

export const UserController = { createPatient, getAllUser };

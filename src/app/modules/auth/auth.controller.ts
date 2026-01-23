import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AuthService } from "./suth.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status-codes";

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  sendResponse(res, {
    data: result,
    statusCode: httpStatus.OK,
    message: "Log In successfull",
    success: true,
  });
});


export const AuthControllers={login}
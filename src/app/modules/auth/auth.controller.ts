import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AuthService } from "./suth.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status-codes";
import { setAuthCookie } from "../../../utils/setAuthCookie";
import { createUserToken } from "../../../utils/userToken";

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  const userTokens = await createUserToken(result.user);

  await setAuthCookie(res, userTokens);
  sendResponse(res, {
    data: { needPasswordChange: result.user.needPasswordChanged },
    statusCode: httpStatus.OK,
    message: "Log In successfull",
    success: true,
  });
});

export const AuthControllers = { login };

import { verifyToken } from "./../../utils/token";
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const auth = (...roles: string[]) => {
 return  async (req: Request & { user: any }, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;
      if (!token) throw new AppError(httpStatus.FORBIDDEN, "No Token Received");

      const verifiedToken = verifyToken(token, envVars.JWT.ACCESS_TOKEN_SECRET);
      if (!verifiedToken) throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
      req.user = verifiedToken;

      if (roles.length && !roles.includes(verifiedToken.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

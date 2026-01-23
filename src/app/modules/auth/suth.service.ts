import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import { ILogin } from "./auth.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

import bcrypt from "bcryptjs";

export const login = async (payload: ILogin) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  if (user.status === UserStatus.DELETED) throw new AppError(httpStatus.BAD_REQUEST, "Your account is deleted, Please contact our admin");
  if (user.status === UserStatus.INACTIVE)
    throw new AppError(httpStatus.BAD_REQUEST, "Your account is marked as inactive, Please contact our admin");

  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
  console.log(isPasswordMatched);

  if (!isPasswordMatched) throw new AppError(httpStatus.BAD_REQUEST, "Password dosent match");
  return payload;
};

export const AuthService = { login };

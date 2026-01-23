import { User } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { generateToken } from "./token";
import { envVars } from "../app/config/env";

export const createUserToken = async (user: Partial<User>) => {
  const jwtPayload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(jwtPayload, envVars.JWT.ACCESS_TOKEN_SECRET, envVars.JWT.ACCESS_TOKEN_EXPIRES_IN);
  const refreshToken = generateToken(jwtPayload, envVars.JWT.REFRESH_TOKEN_SECRET, envVars.JWT.REFRESH_TOKEN_EXPIRES_IN);
  return { accessToken, refreshToken };
};

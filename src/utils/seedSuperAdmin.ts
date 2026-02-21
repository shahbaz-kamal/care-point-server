import AppError from "../app/errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { prisma } from "../app/shared/prisma";
import { envVars } from "../app/config/env";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await prisma.user.findUnique({
      where: { email: envVars.SUPER_ADMIN.EMAIL },
    });

    if (isSuperAdminExist) {
      console.log("Super Admin Exist");
      return;
    }
    const result = await prisma.$transaction(async (tx) => {
      const hashedPassword: string = await bcrypt.hash(envVars.SUPER_ADMIN.PASSWORD, Number(envVars.BCRYPT_SALT_ROUND));
      const user = await tx.user.create({
        data: {
          email: envVars.SUPER_ADMIN.EMAIL,
          password: hashedPassword,
          role: UserRole.ADMIN,
          needPasswordChanged: false,
        },
      });
      const adminData = await tx.admin.create({
        data: {
          name: "Super Admin",
          contactNumber: "01799839985",
          email: envVars.SUPER_ADMIN.EMAIL,
          profilePhoto: "https://i.ibb.co.com/6c60Yv8D/shahbaz-small.png",
        },
      });

      return { user, adminData };
    });
    console.log("Super Admin Created ==>", result);
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, `Error in creating super admin : ${error.message}`);
  }
};

import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../../utils/fileUploader";
import { UserValidation } from "./user.validation";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.get("/", auth(UserRole.ADMIN, UserRole.DOCTOR), UserController.getAllUser);

router.post("/create-patient", fileUploader.upload.single("file"), (req: Request, res: Response, next: NextFunction) => {
  req.body = UserValidation.createUserZodSchema.parse(JSON.parse(req.body.data));
  console.log(req.body);
  return UserController.createPatient(req, res, next);
});

router.post(
  "/create-admin",
  auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  validateRequest(UserValidation.createAdminZodSchema)
);

// (req: Request, res: Response, next: NextFunction) => {
//   req.body = UserValidation.createUserZodSchema.parse(JSON.parse(req.body.data));
//   console.log(req.body);
//   return UserController.createPatient(req, res, next);
// }

export const UserRoutes = router;

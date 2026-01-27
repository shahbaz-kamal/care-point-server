import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../../utils/fileUploader";
import { UserValidation } from "./user.validation";

const router = Router();

router.get("/", UserController.getAllUser);

router.post("/create-patient", fileUploader.upload.single("file"), (req: Request, res: Response, next: NextFunction) => {
  req.body = UserValidation.createUserZodSchema.parse(JSON.parse(req.body.data));
  console.log(req.body);
  return UserController.createPatient(req, res, next);
});

export const UserRoutes = router;

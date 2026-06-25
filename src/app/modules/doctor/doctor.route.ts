import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/", DoctorController.getAllFromDb);
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.DOCTOR),
  DoctorController.updateInDB
);
router.post("/suggestion", DoctorController.getAiSuggestion);
router.get("/:id", DoctorController.getByIdFromDB);
router.delete("/:id", auth(UserRole.ADMIN), DoctorController.deleteFromDB);

router.delete("/soft/:id", auth(UserRole.ADMIN), DoctorController.softDelete);

export const DoctorRoutes = router;

import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/",
  auth(UserRole.DOCTOR, UserRole.ADMIN),
  ScheduleController.scheduleForDoctors
);
router.post("/", ScheduleController.insertIntoDB);
router.delete("/:id", ScheduleController.deletScheduleFromDb);

export const ScheduleRoutes = router;

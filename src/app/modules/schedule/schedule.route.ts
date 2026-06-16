import { Router } from "express";
import { ScheduleController } from "./schedule.controller";

const router = Router();

router.get("/", ScheduleController.scheduleForDoctors);
router.post("/", ScheduleController.insertIntoDB);

export const ScheduleRoutes = router;

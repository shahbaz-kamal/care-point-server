import express from "express";

import { UserRole } from "@prisma/client";
import { AppointmentController } from "./appoinment.controller";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.PATIENT),
  AppointmentController.createAppointment
);

export const AppointmentRoute = router;

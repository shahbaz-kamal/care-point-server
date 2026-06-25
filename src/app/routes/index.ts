import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ScheduleRoutes } from "../modules/schedule/schedule.route";
import { DoctorScheduleRoute } from "../modules/doctorSchedule/doctorSchedule.route";
import { SpecialtiesRoutes } from "../modules/specialities/specialities.route";
import { DoctorRoutes } from "../modules/doctor/doctor.route";
import { PatientRoute } from "../modules/Patient/patient.route";
import { AdminRoute } from "../modules/admin/admin.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/schedule",
    route: ScheduleRoutes,
  },
  {
    path: "/doctor-schedule",
    route: DoctorScheduleRoute,
  },
  {
    path: "/specialties",
    route: SpecialtiesRoutes,
  },
  {
    path: "/doctor",
    route: DoctorRoutes,
  },
  {
    path: "/patient",
    route: PatientRoute,
  },
  {
    path: "/admin",
    route: AdminRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

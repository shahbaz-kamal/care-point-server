import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.get("/", DoctorController.getAllFromDb);
router.patch("/:id", DoctorController.updateInDB);

export const DoctorRoutes = router;

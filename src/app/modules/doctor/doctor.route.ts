import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.get("/", DoctorController.getAllFromDb);
router.patch("/:id", DoctorController.updateInDB);
router.post("/suggestion", DoctorController.getAiSuggestion);

export const DoctorRoutes = router;

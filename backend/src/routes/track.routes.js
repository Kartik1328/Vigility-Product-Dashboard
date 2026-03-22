import { Router } from "express";
import { track } from "../controllers/track.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { trackSchema } from "../validations/dashboard.validation.js";

const router = Router();

router.post("/", authMiddleware, validate(trackSchema), track);

export default router;

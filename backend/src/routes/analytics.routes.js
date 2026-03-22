import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { analyticsSchema } from "../validations/dashboard.validation.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  validate(analyticsSchema, "query"),
  getAnalytics,
);

export default router;

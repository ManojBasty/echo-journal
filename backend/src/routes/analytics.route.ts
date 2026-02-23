import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getMoodTrend } from "../controllers/analytics.controller";

const router = Router();

router.get("/analytics/mood-trend", authenticate, getMoodTrend);

export default router;

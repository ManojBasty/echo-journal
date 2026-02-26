import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getDashboardSummary, getLatestAnalysis, getMoodTrend } from "../controllers/analytics.controller";

const router = Router();

router.get("/analytics/mood-trend", authenticate, getMoodTrend);
router.get("/analytics/latest-analysis", authenticate, getLatestAnalysis);
router.get("/analytics/dashboard-summary",authenticate,getDashboardSummary);
export default router;

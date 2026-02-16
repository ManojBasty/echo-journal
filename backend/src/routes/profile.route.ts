import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/profile", authenticate, (req, res) => {
  res.json({
    message: "You are authenticated",
    userId: (req as any).userId,
  });
});



export default router;

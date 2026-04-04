import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import * as ctrl from "./leaderboard.controller.js";

const router = Router();

router.get("/", ctrl.getLeaderboard);
router.get("/me", authenticate, ctrl.getMyRank);

export default router;
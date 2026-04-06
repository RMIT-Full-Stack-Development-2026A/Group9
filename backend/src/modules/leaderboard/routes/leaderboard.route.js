import { Router } from "express";
import { authenticate, requirePremium } from "../../../middlewares/auth.middleware.js";

const router = Router();

router.get("/health", (req, res) => {
	res.status(200).json({ module: "leaderboard", status: "ok" });
});

router.use(authenticate, requirePremium);

router.get("/global", (req, res) => {
	res.status(501).json({
		success: false,
		message: "Global leaderboard service not implemented yet",
	});
});

router.get("/me", (req, res) => {
	res.status(501).json({
		success: false,
		message: "Personal leaderboard service not implemented yet",
	});
});

export default router;
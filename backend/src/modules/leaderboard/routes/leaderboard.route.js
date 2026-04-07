import { Router } from "express";

const router = Router();

// Public probe for infrastructure checks.
router.get("/health", (req, res) => {
	res.status(200).json({ module: "leaderboard", status: "ok" });
});

// TODO: replace stub with controller/service using leaderboard DTO + repository.
router.get("/global", (req, res) => {
	res.status(501).json({
		success: false,
		message: "Global leaderboard service not implemented yet",
	});
});

// TODO: return current premium player's summary card data.
router.get("/me", (req, res) => {
	res.status(501).json({
		success: false,
		message: "Personal leaderboard service not implemented yet",
	});
});

export default router;
import { Router } from "express";

const router = Router();

// Public endpoint used by health monitors.
router.get("/health", (req, res) => {
	res.status(200).json({ module: "game", status: "ok" });
});

router.post("/sessions", (req, res) => {
	res.status(501).json({
		success: false,
		message: "Game session creation service not implemented yet",
	});
});

router.post("/sessions/move", (req, res) => {
	res.status(501).json({
		success: false,
		message: "Game move service not implemented yet",
	});
});

export default router;
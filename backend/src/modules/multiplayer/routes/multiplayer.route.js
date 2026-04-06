import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware.js";

const router = Router();

// Public endpoint used by health monitors.
router.get("/health", (req, res) => {
	res.status(200).json({ module: "multiplayer", status: "ok" });
});

// Keep as route stubs until multiplayer controller/service is implemented.
router.post("/rooms", authenticate, (req, res) => {
	res.status(501).json({
		success: false,
		message: "Create room service not implemented yet",
	});
});

router.get("/rooms/public", authenticate, (req, res) => {
	res.status(501).json({
		success: false,
		message: "Public room listing service not implemented yet",
	});
});

export default router;
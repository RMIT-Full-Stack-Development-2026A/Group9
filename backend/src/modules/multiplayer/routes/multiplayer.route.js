import { Router } from "express";

const router = Router();

// Health probe used by monitoring and quick module checks.
router.get("/health", (req, res) => {
	res.status(200).json({ module: "multiplayer", status: "ok" });
});

// Placeholder: create room flow to be implemented by multiplayer owner.
router.post("/rooms", (req, res) => {
	res.status(501).json({
		success: false,
		message: "Create room service not implemented yet",
	});
});

// Placeholder: list public rooms flow to be implemented by multiplayer owner.
router.get("/rooms/public", (req, res) => {
	res.status(501).json({
		success: false,
		message: "Public room listing service not implemented yet",
	});
});

export default router;
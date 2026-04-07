import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
	res.status(200).json({ module: "user", status: "ok" });
});

router.get("/search", (req, res) => {
	return res.status(501).json({
		success: false,
		message: "User search service not implemented yet",
	});
});

router.patch("/me", (req, res) => {
	return res.status(501).json({
		success: false,
		message: "Profile update service not implemented yet",
	});
});

export default router;
import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
	res.status(200).json({ module: "admin", status: "ok" });
});

router.get("/users", (req, res) => {
	return res.status(501).json({
		success: false,
		message: "Admin users list not implemented yet",
	});
});

router.post("/users/ban", (req, res) => {
	return res.status(501).json({
		success: false,
		message: "Ban user service not implemented yet",
	});
});

export default router;
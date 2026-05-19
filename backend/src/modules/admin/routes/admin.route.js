import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { authenticate, authorizeRoles } from "../../../middlewares/auth.middleware.js";

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

router.use(authenticate);
router.use(authorizeRoles("admin"));

router.get("/metrics", adminController.getMetrics);
router.get("/players", adminController.getPlayers);
router.put("/players/:id/toggle-status", adminController.togglePlayerStatus);

export default router;
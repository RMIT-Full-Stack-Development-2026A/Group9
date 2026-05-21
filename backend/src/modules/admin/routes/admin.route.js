import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { authenticate, authorizeRoles } from "../../../middlewares/auth.middleware.js";

const router = Router();

// Health check for the admin module
router.get("/health", (req, res) => {
    res.status(200).json({ module: "admin", status: "ok" });
});

// Placeholder endpoints — implemented later if needed.
// Note: these endpoints are intentionally left unimplemented to avoid
// exposing admin-sensitive operations without proper auditing.
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

// Protect the following routes: require valid auth and `admin` role
router.use(authenticate);
router.use(authorizeRoles("admin"));

// Admin-only routes
router.get("/metrics", adminController.getMetrics);
router.get("/players", adminController.getPlayers);
router.put("/players/:id/toggle-status", adminController.togglePlayerStatus);

export default router;
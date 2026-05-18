import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { authenticate, authorizeRoles } from "../../../middlewares/auth.middleware.js";

const router = Router();

router.get("/health", (req, res) => {
	res.status(200).json({ module: "admin", status: "ok" });
});

// Protected routes - require authentication and admin role
router.use(authenticate);
router.use(authorizeRoles("admin"));

// Metrics and data retrieval
router.get("/metrics", adminController.getMetrics);
router.get("/players", adminController.getPlayers);
router.get("/rooms", adminController.getRooms);

// Player management
router.put("/players/:id/toggle-status", adminController.togglePlayerStatus);

// Room management
router.delete("/rooms/:roomId", adminController.closeRoom);

export default router;
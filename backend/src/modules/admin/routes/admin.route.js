import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { authenticate, authorizeRoles } from "../../../middlewares/auth.middleware.js";

const router = Router();

router.get("/health", (req, res) => {
	res.status(200).json({ module: "admin", status: "ok" });
});

router.use(authenticate);
router.use(authorizeRoles("admin"));

router.get("/metrics", adminController.getMetrics);
router.get("/players", adminController.getPlayers);
router.put("/players/:id/toggle-status", adminController.togglePlayerStatus);

// Room management
router.get("/rooms", adminController.getActiveRooms);
router.get("/rooms/search", adminController.searchRooms);
router.post("/rooms/:id/close", adminController.closeRoom);

export default router;

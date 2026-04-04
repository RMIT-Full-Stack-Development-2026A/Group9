import { Router } from "express";
import * as adminController from "./admin.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";

const router = Router();

// All admin routes require admin role
router.use(authenticate, authorize("admin"));

router.get("/players", adminController.getAllPlayers);
router.put("/players/:id/status", adminController.togglePlayerStatus);
router.get("/game-rooms", adminController.getAllGameRooms);
router.put("/game-rooms/:id/close", adminController.closeGameRoom);

export default router;

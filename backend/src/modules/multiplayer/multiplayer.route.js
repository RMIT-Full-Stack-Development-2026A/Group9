import { Router } from "express";
import * as multiplayerController from "./multiplayer.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/rooms", authenticate, authorize("player", "admin"), multiplayerController.createRoom);
router.get("/rooms", authenticate, authorize("player", "admin"), multiplayerController.getWaitingRooms);
router.post("/rooms/:id/join", authenticate, authorize("player", "admin"), multiplayerController.joinRoom);
router.get("/rooms/:id", authenticate, authorize("player", "admin"), multiplayerController.getRoom);

export default router;
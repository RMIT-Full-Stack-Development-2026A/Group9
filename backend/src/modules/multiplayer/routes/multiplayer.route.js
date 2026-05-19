import { Router } from "express";
import * as multiplayerController from "../controllers/multiplayer.controller.js";
import { authenticate } from "../../../middlewares/auth.middleware.js";

const router = Router();

router.get("/health", (req, res) => {
	res.status(200).json({ module: "multiplayer", status: "ok" });
});

router.post("/rooms", authenticate, multiplayerController.createRoom);
router.get("/rooms", authenticate, multiplayerController.getWaitingRooms);
router.get("/rooms/active", authenticate, multiplayerController.getActiveRooms);
router.post("/rooms/:id/join", authenticate, multiplayerController.joinRoom);
router.post("/rooms/:id/close", authenticate, multiplayerController.closeRoom);
router.get("/rooms/:id", authenticate, multiplayerController.getRoom);

export default router;

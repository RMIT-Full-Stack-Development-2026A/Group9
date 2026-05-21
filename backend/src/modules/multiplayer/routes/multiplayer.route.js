import { Router } from "express";
import * as multiplayerController from "../controllers/multiplayer.controller.js";
import { authenticate } from "../../../middlewares/auth.middleware.js";

const router = Router();

// Health check used by deployment and uptime monitoring.
router.get("/health", (req, res) => {
	res.status(200).json({ module: "multiplayer", status: "ok" });
});

// Create a multiplayer room for the authenticated user.
router.post("/rooms", authenticate, multiplayerController.createRoom);
// List rooms that are waiting for a second player.
router.get("/rooms", authenticate, multiplayerController.getWaitingRooms);
// List rooms that are already active.
router.get("/rooms/active", authenticate, multiplayerController.getActiveRooms);
// Join a waiting room and become player2.
router.post("/rooms/:id/join", authenticate, multiplayerController.joinRoom);
// Manually close a room and broadcast the change through sockets.
router.post("/rooms/:id/close", authenticate, multiplayerController.closeRoom);
// Fetch a room by id for the room detail screen.
router.get("/rooms/:id", authenticate, multiplayerController.getRoom);

export default router;

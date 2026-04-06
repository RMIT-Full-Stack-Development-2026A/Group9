import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware.js";
import { createSession, makeMove } from "../controllers/game.controller.js";

const router = Router();

// Public endpoint used by health monitors.
router.get("/health", (req, res) => {
	res.status(200).json({ module: "game", status: "ok" });
});

// Game endpoints require authenticated players.
router.post("/sessions", authenticate, createSession);
router.post("/sessions/move", authenticate, makeMove);

export default router;
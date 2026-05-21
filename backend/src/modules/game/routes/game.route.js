import { Router } from "express";
import * as gameController from "../controllers/game.controller.js";
import { authenticate, requirePremium } from "../../../middlewares/auth.middleware.js";

const router = Router();

// Public endpoint used by health monitors.
router.get("/health", (req, res) => {
  res.status(200).json({ module: "game", status: "ok" });
});

// Create a new game session for the authenticated user.
router.post("/sessions", authenticate, gameController.createSession);

// Submit a standard move for a live game session.
router.post("/sessions/move", authenticate, gameController.makeMove);

// Ask the AI to respond to the last player move.
router.post("/sessions/ai-move", authenticate, gameController.makeAIMove);

// Abort an in-progress game session.
router.post("/sessions/abort", authenticate, gameController.abortSession);

// Return replay data for premium users.
router.get("/sessions/:sessionId/replay", authenticate, requirePremium, gameController.getSessionReplay);

export default router;

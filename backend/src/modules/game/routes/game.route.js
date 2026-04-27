import { Router } from "express";
import * as gameController from "../controllers/game.controller.js";
import { authenticate } from "../../../middlewares/auth.middleware.js";

const router = Router();

// Public endpoint used by health monitors.
router.get("/health", (req, res) => {
  res.status(200).json({ module: "game", status: "ok" });
});

router.post("/sessions", authenticate, gameController.createSession);

router.post("/sessions/move", authenticate, gameController.makeMove);

router.post("/sessions/ai-move", authenticate, gameController.makeAIMove);

export default router;

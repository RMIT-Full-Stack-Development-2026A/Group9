import { Router } from "express";
import * as gameController from "./game.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/sessions", authenticate, authorize("player", "admin"), gameController.createSession);
router.put("/sessions/:id/end", authenticate, authorize("player", "admin"), gameController.endSession);
router.get("/sessions/:id", authenticate, authorize("player", "admin"), gameController.getSession);
router.post("/moves", authenticate, authorize("player", "admin"), gameController.recordMove);
router.get("/sessions/:id/moves", authenticate, authorize("player", "admin"), gameController.getGameMoves);
router.post("/ai-move", authenticate, authorize("player", "admin"), gameController.getAIMove);

export default router;
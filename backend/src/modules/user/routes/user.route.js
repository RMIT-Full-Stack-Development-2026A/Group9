import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware.js";
import { uploadAvatar } from "../../../middlewares/upload.middleware.js";
import * as userCtrl from "../controllers/user.controller.js";
import { getMyHistory } from "../../game/controllers/gameSession.controller.js";

const router = Router();

router.get("/health", (req, res) => {
	res.status(200).json({ module: "user", status: "ok" });
});

// ── Profile ───────────────────────────────────────────────────────────
router.get("/me", authenticate, userCtrl.getMyProfile);
router.patch("/me", authenticate, userCtrl.updateMyProfile);
router.post("/me/avatar", authenticate, uploadAvatar, userCtrl.uploadMyAvatar);

// ── Game History ──────────────────────────────────────────────────────
router.get("/me/history", authenticate, getMyHistory);

export default router;
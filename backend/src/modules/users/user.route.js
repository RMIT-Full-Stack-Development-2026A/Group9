import { Router } from "express";
import * as userController from "./user.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { upload, resizeAvatar } from "../../middleware/upload.middleware.js";

const router = Router();

router.get("/profile", authenticate, userController.getProfile);
router.put("/profile", authenticate, userController.updateProfile);
router.post(
  "/profile/avatar",
  authenticate,
  upload.single("avatar"),
  resizeAvatar,
  userController.uploadAvatar
);
router.get("/game-history", authenticate, userController.getGameHistory);

export default router;

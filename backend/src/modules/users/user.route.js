import { Router } from "express";
import * as userController from "./user.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { upload, uploadToCloudinary } from "../../middleware/upload.middleware.js";

const router = Router();

router.get("/profile", authenticate, authorize("player", "admin"), userController.getProfile);
router.put("/profile", authenticate, authorize("player", "admin"), userController.updateProfile);
router.post(
  "/profile/avatar",
  authenticate,
  authorize("player", "admin"),
  upload.single("avatar"),
  uploadToCloudinary,
  userController.uploadAvatar
);
router.get("/game-history", authenticate, authorize("player", "admin"), userController.getGameHistory);

export default router;

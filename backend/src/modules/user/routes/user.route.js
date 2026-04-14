import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authenticate } from "../../../middlewares/auth.middleware.js";
import upload, { uploadToCloudinary } from "../../../middlewares/upload.middleware.js";

const router = Router();

router.get("/profile", authenticate, userController.getProfile);
router.put("/profile", authenticate, userController.updateProfile);
router.post(
  "/profile/avatar",
  authenticate,
  upload.single("avatar"),
  uploadToCloudinary,
  userController.uploadAvatar
);
router.get("/game-history", authenticate, userController.getGameHistory);

export default router;
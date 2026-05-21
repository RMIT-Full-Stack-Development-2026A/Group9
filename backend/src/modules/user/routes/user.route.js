import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authenticate } from "../../../middlewares/auth.middleware.js";
import upload, { uploadToCloudinary } from "../../../middlewares/upload.middleware.js";

const router = Router();

// Fetch the authenticated user's profile.
router.get("/profile", authenticate, userController.getProfile);
// Update profile fields for the authenticated user.
router.put("/profile", authenticate, userController.updateProfile);
// Upload and persist an avatar image for the authenticated user.
router.post(
  "/profile/avatar",
  authenticate,
  upload.single("avatar"),
  uploadToCloudinary,
  userController.uploadAvatar
);
// Return the authenticated user's game history.
router.get("/game-history", authenticate, userController.getGameHistory);

export default router;
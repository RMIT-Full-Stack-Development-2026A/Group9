/**
 * Auth routes boundary:
 * - This file is only for Authentication endpoints.
 */

import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware.js";
import { login, logout, me, register } from "../controllers/auth.controller.js";

const router = Router();

// Public endpoint used by health monitors.
router.get("/health", (req, res) => {
	res.status(200).json({ module: "auth", status: "ok" });
});

// Keep route handlers thin; all business logic stays in service layer.
router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, me);
router.post("/logout", authenticate, logout);

export default router;
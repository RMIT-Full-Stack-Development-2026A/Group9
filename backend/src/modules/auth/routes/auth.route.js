import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware.js";
import { login, me, register } from "../controllers/auth.controller.js";

const router = Router();

router.get("/health", (req, res) => {
	res.status(200).json({ module: "auth", status: "ok" });
});

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, me);

export default router;
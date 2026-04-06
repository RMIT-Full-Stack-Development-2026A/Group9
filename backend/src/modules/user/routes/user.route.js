import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware.js";
import {
	validateProfileQuery,
	validateUpdateProfilePayload,
} from "../dto/user.dto.js";

const router = Router();

router.get("/health", (req, res) => {
	res.status(200).json({ module: "user", status: "ok" });
});

router.get("/search", (req, res) => {
	const { valid, errors, value } = validateProfileQuery(req.query);
	if (!valid) {
		return res.status(400).json({ success: false, errors });
	}

	return res.status(501).json({
		success: false,
		message: "User search service not implemented yet",
		query: value,
	});
});

router.patch("/me", authenticate, (req, res) => {
	const { valid, errors, value } = validateUpdateProfilePayload(req.body);
	if (!valid) {
		return res.status(400).json({ success: false, errors });
	}

	return res.status(501).json({
		success: false,
		message: "Profile update service not implemented yet",
		payload: value,
	});
});

export default router;
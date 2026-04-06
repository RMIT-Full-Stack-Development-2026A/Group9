import { Router } from "express";
import { authenticate, authorizeRoles } from "../../../middlewares/auth.middleware.js";
import { validateBanUserPayload, validatePaginationQuery } from "../dto/admin.dto.js";

const router = Router();

router.use(authenticate, authorizeRoles("admin"));

router.get("/health", (req, res) => {
	res.status(200).json({ module: "admin", status: "ok" });
});

router.get("/users", (req, res) => {
	const { valid, errors, value } = validatePaginationQuery(req.query);
	if (!valid) {
		return res.status(400).json({ success: false, errors });
	}

	return res.status(501).json({
		success: false,
		message: "Admin users list not implemented yet",
		query: value,
	});
});

router.post("/users/ban", (req, res) => {
	const { valid, errors, value } = validateBanUserPayload(req.body);
	if (!valid) {
		return res.status(400).json({ success: false, errors });
	}

	return res.status(501).json({
		success: false,
		message: "Ban user service not implemented yet",
		payload: value,
	});
});

export default router;
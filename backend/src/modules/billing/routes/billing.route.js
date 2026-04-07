import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
	res.status(200).json({ module: "billing", status: "ok" });
});

router.post("/checkout/premium", (req, res) => {
	res.status(501).json({
		success: false,
		message: "Checkout service not implemented yet",
	});
});

router.post("/webhook", (req, res) => {
	res.status(501).json({
		success: false,
		message: "Billing webhook handler not implemented yet",
	});
});

export default router;
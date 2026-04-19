import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware.js";
import * as billingCtrl from "../controllers/billing.controller.js";

const router = Router();

router.get("/health", (req, res) => {
	res.status(200).json({ module: "billing", status: "ok" });
});

// ── Wallet ────────────────────────────────────────────────────────────
router.get("/wallet", authenticate, billingCtrl.getWallet);
router.post("/wallet/deposit", authenticate, billingCtrl.deposit);

// ── Subscribe via wallet ──────────────────────────────────────────────
router.post("/subscribe/wallet", authenticate, billingCtrl.subscribeWallet);

// ── Stripe checkout ───────────────────────────────────────────────────
router.post("/checkout/stripe", authenticate, billingCtrl.createStripeCheckout);

// ── Stripe webhook (raw body handled by app.js middleware) ────────────
router.post("/webhook/stripe", billingCtrl.stripeWebhook);

// ── Transaction history ───────────────────────────────────────────────
router.get("/transactions", authenticate, billingCtrl.getTransactions);

export default router;
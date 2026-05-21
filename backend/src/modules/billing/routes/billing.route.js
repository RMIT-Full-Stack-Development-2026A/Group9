import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware.js";
import * as billingCtrl from "../controllers/billing.controller.js";

const router = Router();

// Simple module health check used by deployment/runtime monitoring.
router.get("/health", (req, res) => {
	res.status(200).json({ module: "billing", status: "ok" });
});

// ── Wallet ────────────────────────────────────────────────────────────
// Get the authenticated user's wallet and premium snapshot.
router.get("/wallet", authenticate, billingCtrl.getWallet);
// Deposit funds into the authenticated user's wallet.
router.post("/wallet/deposit", authenticate, billingCtrl.deposit);

// ── Subscribe via wallet ──────────────────────────────────────────────
// Buy premium using the user's wallet balance.
router.post("/subscribe/wallet", authenticate, billingCtrl.subscribeWallet);

// ── Stripe checkout ───────────────────────────────────────────────────
// Create a Stripe Checkout session for premium purchase.
router.post("/checkout/stripe", authenticate, billingCtrl.createStripeCheckout);

// ── Stripe webhook (raw body handled by app.js middleware) ────────────
// Stripe calls this endpoint directly after payment events complete.
router.post("/webhook/stripe", billingCtrl.stripeWebhook);

// ── Transaction history ───────────────────────────────────────────────
// Fetch the authenticated user's billing transaction history.
router.get("/transactions", authenticate, billingCtrl.getTransactions);

export default router;
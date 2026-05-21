import * as billingService from "../services/billing.service.js";

// Return the authenticated user's wallet snapshot (balance + premium expiry).
export async function getWallet(req, res, next) {
	try {
		const data = await billingService.getWallet(req.user.id);
		res.status(200).json({ success: true, data });
	} catch (err) {
		next(err);
	}
}

// Add money to the authenticated user's wallet and return the updated balance.
export async function deposit(req, res, next) {
	try {
		const { amount } = req.body;
		const data = await billingService.depositToWallet(req.user.id, Number(amount));
		res.status(200).json({ success: true, data });
	} catch (err) {
		next(err);
	}
}

// Use wallet balance to purchase premium and return the updated wallet/profile info.
export async function subscribeWallet(req, res, next) {
	try {
		const data = await billingService.subscribeWithWallet(req.user.id);
		res.status(200).json({ success: true, data });
	} catch (err) {
		next(err);
	}
}

// Create a Stripe Checkout session and return the checkout URL to the client.
export async function createStripeCheckout(req, res, next) {
	try {
		const data = await billingService.createStripeCheckout(req.user.id);
		res.status(200).json({ success: true, data });
	} catch (err) {
		next(err);
	}
}

// Handle Stripe webhook events. The body must remain raw for signature verification.
export async function stripeWebhook(req, res, next) {
	try {
		await billingService.handleStripeWebhook(
			req.body,
			req.headers["stripe-signature"]
		);
		res.status(200).json({ received: true });
	} catch (err) {
		next(err);
	}
}

// Return the authenticated user's transaction history.
export async function getTransactions(req, res, next) {
	try {
		const data = await billingService.getTransactions(req.user.id);
		res.status(200).json({ success: true, data });
	} catch (err) {
		next(err);
	}
}